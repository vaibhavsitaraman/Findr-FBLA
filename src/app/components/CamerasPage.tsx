import { useEffect, useRef, useState } from "react";
import { Camera, Settings2, PlayCircle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  YoloBrowserDetector,
  drawDetectionsOnCanvas,
} from "../../lib/yoloBrowser";

type Tab = "config" | "live";

interface CameraConfig {
  id: string;
  name: string;
  ipAddress: string;
  username: string;
  password: string;
}

// COCO class labels for YOLOv8 (80 classes).
// Index 0 = person, 24 = backpack.
const COCO_CLASSES = [
  "person",
  "bicycle",
  "car",
  "motorcycle",
  "airplane",
  "bus",
  "train",
  "truck",
  "boat",
  "traffic light",
  "fire hydrant",
  "stop sign",
  "parking meter",
  "bench",
  "bird",
  "cat",
  "dog",
  "horse",
  "sheep",
  "cow",
  "elephant",
  "bear",
  "zebra",
  "giraffe",
  "backpack",
  "umbrella",
  "handbag",
  "tie",
  "suitcase",
  "frisbee",
  "skis",
  "snowboard",
  "sports ball",
  "kite",
  "baseball bat",
  "baseball glove",
  "skateboard",
  "surfboard",
  "tennis racket",
  "bottle",
  "wine glass",
  "cup",
  "fork",
  "knife",
  "spoon",
  "bowl",
  "banana",
  "apple",
  "sandwich",
  "orange",
  "broccoli",
  "carrot",
  "hot dog",
  "pizza",
  "donut",
  "cake",
  "chair",
  "couch",
  "potted plant",
  "bed",
  "dining table",
  "toilet",
  "tv",
  "laptop",
  "mouse",
  "remote",
  "keyboard",
  "cell phone",
  "microwave",
  "oven",
  "toaster",
  "sink",
  "refrigerator",
  "book",
  "clock",
  "vase",
  "scissors",
  "teddy bear",
  "hair drier",
  "toothbrush",
];

export function CamerasPage() {
  const [activeTab, setActiveTab] = useState<Tab>("config");
  const [cameras, setCameras] = useState<CameraConfig[]>([
    {
      id: "1",
      name: "Main Entrance",
      ipAddress: "rtsp://10.0.0.10/stream",
      username: "admin",
      password: "••••••••",
    },
    {
      id: "2",
      name: "Library Lobby",
      ipAddress: "rtsp://10.0.0.11/stream",
      username: "admin",
      password: "••••••••",
    },
  ]);

  const [formValues, setFormValues] = useState({
    name: "",
    ipAddress: "",
    username: "",
    password: "",
  });

  const handleAddCamera = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.name || !formValues.ipAddress) return;

    setCameras((prev) => [
      ...prev,
      {
        id: String(prev.length + 1),
        name: formValues.name,
        ipAddress: formValues.ipAddress,
        username: formValues.username,
        password: formValues.password || "••••••••",
      },
    ]);

    setFormValues({
      name: "",
      ipAddress: "",
      username: "",
      password: "",
    });
  };

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const detectorRef = useRef<YoloBrowserDetector | null>(null);
  const rafRef = useRef<number | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Stop any active stream (and detection) when leaving the Live tab
  useEffect(() => {
    if (activeTab !== "live") {
      console.log("[Camera] Leaving live tab, stopping stream and loop");

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      if (overlayCanvasRef.current) {
        const ctx = overlayCanvasRef.current.getContext("2d");
        if (ctx) {
          ctx.clearRect(
            0,
            0,
            overlayCanvasRef.current.width,
            overlayCanvasRef.current.height,
          );
        }
      }

      setIsCameraOn(false);
      setCameraError(null);
    }
  }, [activeTab]);

  const startCamera = async () => {
    console.log("[Camera] startCamera called");

    if (!navigator.mediaDevices?.getUserMedia) {
      console.error("[Camera] getUserMedia is not supported in this browser");
      setCameraError("Camera access is not supported in this browser.");
      return;
    }

    // Clear old UI state first
    setCameraError(null);

    // STEP 1: Get camera stream
    let stream: MediaStream;
    try {
      console.log("[Camera] Requesting webcam access...");
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      console.log("[Camera] Webcam access granted", stream);
    } catch (err) {
      console.error("[Camera] Failed to access webcam:", err);
      setCameraError(
        "Unable to access your camera. Please allow camera permissions in your browser settings.",
      );
      setIsCameraOn(false);
      return;
    }

    streamRef.current = stream;

    if (!videoRef.current) {
      console.error("[Camera] videoRef is null after stream acquisition");
      setCameraError("Video element not available.");
      setIsCameraOn(false);
      return;
    }

    try {
      videoRef.current.srcObject = stream;

      await new Promise<void>((resolve, reject) => {
        if (!videoRef.current) {
          reject(new Error("Video element missing"));
          return;
        }

        videoRef.current.onloadedmetadata = () => {
          console.log(
            "[Camera] Video metadata loaded:",
            videoRef.current?.videoWidth,
            "x",
            videoRef.current?.videoHeight,
          );
          resolve();
        };

        videoRef.current.onerror = (e) => {
          reject(new Error("Video element failed to load metadata"));
        };
      });

      await videoRef.current.play();
      console.log("[Camera] Video playback started");
      setIsCameraOn(true);
    } catch (err) {
      console.error("[Camera] Failed after stream acquisition:", err);
      setCameraError("Camera stream started, but video playback failed.");
      setIsCameraOn(false);
      return;
    }

    // STEP 2: Load YOLO model
    try {
      if (!detectorRef.current) {
        console.log("[YOLO] Initializing detector...");
        const detector = new YoloBrowserDetector({
          modelUrl: "/yolov8n_web_model_tfjs/model.json",
          classNames: COCO_CLASSES,
          targetClasses: ["person", "backpack"],
          inputSize: 640,
          scoreThreshold: 0.35,
          iouThreshold: 0.45,
        });

        console.log("[YOLO] Loading model from /yolov8n_web_model/model.json");
        await detector.load();
        detectorRef.current = detector;
        console.log("[YOLO] Model loaded successfully");
      } else {
        console.log("[YOLO] Reusing already loaded detector");
      }
    } catch (err) {
      console.error("[YOLO] Model failed to load:", err);
      setCameraError(
        "Camera is working, but the detection model failed to load. Check model path and browser console.",
      );
      return;
    }

    // STEP 3: Start detection loop
    if (rafRef.current !== null) {
      console.log("[YOLO] Detection loop already running");
      return;
    }

    console.log("[YOLO] Starting detection loop");

    let isProcessing = false;
    let frameCount = 0;

    const loop = async () => {
      rafRef.current = requestAnimationFrame(loop);

      if (isProcessing) return;
      if (
        !videoRef.current ||
        !overlayCanvasRef.current ||
        !detectorRef.current
      )
        return;

      const video = videoRef.current;
      const canvas = overlayCanvasRef.current;

      if (video.readyState < 2) {
        return;
      }

      const vw = video.videoWidth;
      const vh = video.videoHeight;

      if (!vw || !vh) {
        return;
      }

      if (canvas.width !== vw || canvas.height !== vh) {
        canvas.width = vw;
        canvas.height = vh;
        console.log("[YOLO] Resized overlay canvas to", vw, "x", vh);
      }

      isProcessing = true;

      try {
        frameCount += 1;
        const detections = await detectorRef.current.detect(video);

        if (frameCount % 30 === 0) {
          console.log("[YOLO] Frame", frameCount, "detections:", detections);
        }

        drawDetectionsOnCanvas(canvas, detections);
      } catch (err) {
        console.error("[YOLO] Detection failed on frame:", err);
      } finally {
        isProcessing = false;
      }
    };

    rafRef.current = requestAnimationFrame(loop);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto max-w-6xl px-4 space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-1 text-xs font-medium text-blue-200">
            <Camera className="size-3.5" />
            <span>Camera Control Center</span>
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold text-foreground"
            style={{ fontFamily: "'EB Garamond', serif" }}
          >
            Campus Cameras
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
            Configure RTSP cameras for Findr and monitor live streams associated
            with your campus.
          </p>
        </div>

        <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1 text-sm">
          <button
            onClick={() => setActiveTab("config")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 transition-all ${
              activeTab === "config"
                ? "bg-blue-600 text-white shadow-[0_10px_30px_rgba(37,99,235,0.6)]"
                : "text-slate-300 hover:bg-white/5"
            }`}
          >
            <Settings2 className="size-4" />
            Camera Config
          </button>
          <button
            onClick={() => setActiveTab("live")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 transition-all ${
              activeTab === "live"
                ? "bg-blue-600 text-white shadow-[0_10px_30px_rgba(37,99,235,0.6)]"
                : "text-slate-300 hover:bg-white/5"
            }`}
          >
            <PlayCircle className="size-4" />
            Live
          </button>
        </div>

        {activeTab === "config" && (
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 items-start">
            <Card className="bg-slate-900/60 border-slate-700/70 shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg text-slate-50">
                      Connected cameras
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Cameras currently registered for your school.
                    </CardDescription>
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300 border border-emerald-500/40">
                    {cameras.length} active
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {cameras.map((camera) => (
                  <div
                    key={camera.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-2xl border border-slate-700/70 bg-slate-900/60 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 border border-blue-500/40">
                        <Camera className="size-4 text-blue-300" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-50">
                          {camera.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {camera.ipAddress}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="rounded-full bg-slate-800/80 px-3 py-1">
                        {camera.username}
                      </span>
                      <span className="rounded-full bg-slate-800/80 px-3 py-1">
                        {camera.password}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-900/60 border-slate-700/70 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-lg text-slate-50">
                  Add a new camera
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Configure a new RTSP camera. Credentials are stored securely
                  in your deployment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleAddCamera}>
                  <div className="space-y-1.5 text-sm">
                    <label className="block text-slate-300">Camera name</label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-700/70 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/60"
                      placeholder="Main Entrance"
                      value={formValues.name}
                      onChange={(e) =>
                        setFormValues((v) => ({ ...v, name: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <label className="block text-slate-300">
                      RTSP / IP address
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-700/70 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/60"
                      placeholder="rtsp://10.0.0.10/stream"
                      value={formValues.ipAddress}
                      onChange={(e) =>
                        setFormValues((v) => ({
                          ...v,
                          ipAddress: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="space-y-1.5">
                      <label className="block text-slate-300">Username</label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-slate-700/70 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/60"
                        placeholder="admin"
                        value={formValues.username}
                        onChange={(e) =>
                          setFormValues((v) => ({
                            ...v,
                            username: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-slate-300">Password</label>
                      <input
                        type="password"
                        className="w-full rounded-lg border border-slate-700/70 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/60"
                        placeholder="••••••••"
                        value={formValues.password}
                        onChange={(e) =>
                          setFormValues((v) => ({
                            ...v,
                            password: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    Save camera
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "live" && (
          <Card className="bg-slate-900/70 border-slate-700/70 shadow-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base md:text-lg text-slate-50">
                  Admin device camera
                </CardTitle>
                <CardDescription className="text-xs md:text-sm text-slate-400">
                  This preview uses your computer&apos;s camera as a stand-in
                  for a real RTSP stream.
                </CardDescription>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-medium text-emerald-300 border border-emerald-500/40">
                <span className="size-2.5 rounded-full bg-emerald-400 animate-pulse" />
                {isCameraOn ? "Live" : "Off"}
              </span>
            </CardHeader>
            <CardContent>
              <div
                className="relative w-full rounded-2xl border border-slate-700/80 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 overflow-hidden aspect-[16/9] md:aspect-[21/9] flex items-center justify-center"
                style={{
                  boxShadow:
                    "0 24px 80px rgba(15,23,42,0.95), inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <canvas
                  ref={overlayCanvasRef}
                  className="absolute inset-0 h-full w-full pointer-events-none"
                />
                {!isCameraOn && (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.35),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.25),_transparent_55%)] opacity-80 flex flex-col items-center justify-center gap-4 px-4 text-center text-slate-200">
                    <Camera className="size-10 text-blue-300" />
                    <p className="text-xs md:text-sm text-slate-200 max-w-md">
                      Turn on your device camera to preview a live feed.
                    </p>
                    {cameraError && (
                      <p className="text-[11px] md:text-xs text-rose-300 max-w-md">
                        {cameraError}
                      </p>
                    )}
                    <Button
                      type="button"
                      onClick={startCamera}
                      className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-semibold px-4 py-2 rounded-full"
                    >
                      Enable camera preview
                    </Button>
                    <p className="text-[10px] md:text-[11px] text-slate-400 max-w-md">
                      Your browser will ask for permission. Video stays on this
                      device and is not uploaded anywhere from this demo.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
