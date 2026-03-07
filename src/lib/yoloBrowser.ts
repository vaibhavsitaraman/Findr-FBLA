import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";

export type YoloPrediction = {
  x: number;
  y: number;
  width: number;
  height: number;
  score: number;
  classId: number;
  className: string;
};

export type YoloBrowserConfig = {
  /**
   * URL to a YOLO model exported to TensorFlow.js GraphModel format.
   * Example: "/models/yolo_backpack_person/model.json"
   */
  modelUrl: string;
  /**
   * Class names in the same order the model was trained (e.g. COCO labels).
   * We will filter to just "person" and "backpack" by default.
   */
  classNames: string[];
  /**
   * Only keep detections with score >= this threshold.
   */
  scoreThreshold?: number;
  /**
   * IOU threshold for non-max suppression.
   */
  iouThreshold?: number;
  /**
   * Model input size (assumes square input, e.g. 640 for 640x640).
   */
  inputSize?: number;
  /**
   * Target classes to keep. Defaults to ["person", "backpack"].
   */
  targetClasses?: string[];
};

/**
 * Lightweight YOLO wrapper for running an exported TensorFlow.js model
 * in the browser and drawing bounding boxes on top of a video stream.
 *
 * IMPORTANT:
 * - You must install dependencies in your project:
 *     npm install @tensorflow/tfjs @tensorflow/tfjs-backend-webgl
 * - You must export an Ultralytics YOLO model to tfjs format and host
 *   the resulting model.json + weights under `config.modelUrl`.
 *
 * This file does NOT fetch any weights by itself – it only knows how
 * to load and run a model that you provide.
 */
export class YoloBrowserDetector {
  private model: tf.GraphModel | null = null;
  private readonly classNames: string[];
  private readonly scoreThreshold: number;
  private readonly iouThreshold: number;
  private readonly inputSize: number;
  private readonly targetClasses: Set<string>;
  private readonly modelUrl: string;

  constructor(config: YoloBrowserConfig) {
    this.modelUrl = config.modelUrl;
    this.classNames = config.classNames;
    this.scoreThreshold = config.scoreThreshold ?? 0.35;
    this.iouThreshold = config.iouThreshold ?? 0.45;
    this.inputSize = config.inputSize ?? 640;
    this.targetClasses = new Set(
      (config.targetClasses ?? ["person", "backpack"]).map((c) =>
        c.toLowerCase(),
      ),
    );
  }

  /**
   * Load the YOLO model (once) and warm up the backend.
   */
  async load(): Promise<void> {
    if (this.model) return;
  
    await tf.setBackend("webgl");
    await tf.ready();
  
    this.model = await tf.loadGraphModel(this.modelUrl);
    console.log("[YOLO] Model loaded");
  
    const dummy = tf.zeros([1, this.inputSize, this.inputSize, 3], "float32");
  
    try {
      const warmup = this.model.execute(dummy) as tf.Tensor | tf.Tensor[];
      if (Array.isArray(warmup)) {
        warmup.forEach((t) => t.dispose());
      } else {
        warmup.dispose();
      }
      console.log("[YOLO] Warmup complete");
    } catch (err) {
      console.warn("[YOLO] Warmup failed:", err);
    } finally {
      dummy.dispose();
    }
  }

  /**
   * Run detection on the current frame of a video element.
   * Returns bounding boxes in video pixel coordinates.
   */
  async detect(video: HTMLVideoElement): Promise<YoloPrediction[]> {
    if (!this.model) {
      throw new Error("YOLO model is not loaded. Call detector.load() first.");
    }
  
    if (video.readyState < 2) return [];
  
    const { videoWidth, videoHeight } = video;
    if (!videoWidth || !videoHeight) return [];
  
    const inputSize = this.inputSize;
  
    const [boxesTensor, scoresTensor, classIdsTensor] = tf.tidy(() => {
      const frame = tf.browser.fromPixels(video);
  
      const resized = tf.image
        .resizeBilinear(frame, [inputSize, inputSize])
        .toFloat()
        .div(255)
        .expandDims(0) as tf.Tensor4D;
  
      frame.dispose();
  
      const raw = this.model!.execute(resized) as tf.Tensor | tf.Tensor[];
      const rawOutput = Array.isArray(raw) ? raw[0] : raw;
  
      let output = rawOutput.squeeze();
  
      if (output.shape.length === 2 && output.shape[0] < output.shape[1]) {
        output = output.transpose([1, 0]);
      }
  
      console.log("[YOLO] raw output shape:", rawOutput.shape);
      console.log("[YOLO] processed output shape:", output.shape);
  
      const numFeatures = output.shape[1];
      const modelHasObjectness = numFeatures === this.classNames.length + 5;
      const modelNoObjectness = numFeatures === this.classNames.length + 4;
  
      if (!modelHasObjectness && !modelNoObjectness) {
        throw new Error(
          `Unexpected YOLO feature count: ${numFeatures}. Expected ${
            this.classNames.length + 4
          } or ${this.classNames.length + 5}.`
        );
      }
  
      const boxes = output.slice([0, 0], [-1, 4]); // [N,4]
  
      let classScores: tf.Tensor2D;
      let scores: tf.Tensor1D;
  
      if (modelHasObjectness) {
        const objectness = output.slice([0, 4], [-1, 1]).squeeze() as tf.Tensor1D;
        classScores = output.slice([0, 5], [-1, this.classNames.length]) as tf.Tensor2D;
        scores = classScores.max(-1).mul(objectness) as tf.Tensor1D;
        console.log("[YOLO] decoding format: boxes + objectness + classes");
      } else {
        classScores = output.slice([0, 4], [-1, this.classNames.length]) as tf.Tensor2D;
        scores = classScores.max(-1) as tf.Tensor1D;
        console.log("[YOLO] decoding format: boxes + classes");
      }
  
      const classIds = classScores.argMax(-1) as tf.Tensor1D;
  
      const [cx, cy, w, h] = tf.split(boxes, 4, 1);
  
      const scaleX = videoWidth / inputSize;
      const scaleY = videoHeight / inputSize;
  
      const x1 = cx.sub(w.div(2)).mul(scaleX);
      const y1 = cy.sub(h.div(2)).mul(scaleY);
      const x2 = cx.add(w.div(2)).mul(scaleX);
      const y2 = cy.add(h.div(2)).mul(scaleY);
  
      const boxesXYXY = tf.concat([y1, x1, y2, x2], 1) as tf.Tensor2D;
  
      resized.dispose();
  
      if (Array.isArray(raw)) {
        raw.forEach((t) => t.dispose());
      } else {
        raw.dispose();
      }
  
      return [boxesXYXY, scores, classIds];
    });
  
    const indices = await tf.image.nonMaxSuppressionAsync(
      boxesTensor,
      scoresTensor,
      100,
      this.iouThreshold,
      this.scoreThreshold,
    );
  
    const boxesData = await boxesTensor.array();
    const scoresData = await scoresTensor.array();
    const classIdsData = await classIdsTensor.array();
    const keep = await indices.array();
  
    boxesTensor.dispose();
    scoresTensor.dispose();
    classIdsTensor.dispose();
    indices.dispose();
  
    const results: YoloPrediction[] = [];
  
    for (const i of keep) {
      const score = scoresData[i];
      const classId = classIdsData[i];
      const className = this.classNames[classId] ?? `cls_${classId}`;
  
      if (!this.targetClasses.has(className.toLowerCase())) continue;
  
      const [y1, x1, y2, x2] = boxesData[i];
  
      const x = Math.max(0, x1);
      const y = Math.max(0, y1);
      const width = Math.max(0, x2 - x1);
      const height = Math.max(0, y2 - y1);
  
      if (width <= 1 || height <= 1) continue;
  
      results.push({
        x,
        y,
        width,
        height,
        score,
        classId,
        className,
      });
    }
  
    console.log(
      "[YOLO] kept detections:",
      results.map((r) => ({
        classId: r.classId,
        className: r.className,
        score: r.score,
        x: r.x,
        y: r.y,
        width: r.width,
        height: r.height,
      })),
    );
  
    return results;
  }
}

/**
 * Draw detections as bounding boxes on a canvas overlay.
 * The canvas should be the same size as the video element.
 */
export function drawDetectionsOnCanvas(
  canvas: HTMLCanvasElement,
  detections: YoloPrediction[],
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);

  ctx.lineWidth = 2;
  ctx.font = "12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

  detections.forEach((det) => {
    const color =
      det.className.toLowerCase() === "person"
        ? "rgba(59,130,246,0.9)"
        : "rgba(236,72,153,0.9)";

    const x = Math.max(0, Math.min(det.x, width - 1));
    const y = Math.max(0, Math.min(det.y, height - 1));
    const w = Math.max(0, Math.min(det.width, width - x));
    const h = Math.max(0, Math.min(det.height, height - y));

    if (w <= 1 || h <= 1) return;

    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    ctx.strokeRect(x, y, w, h);

    const label = `${det.className} ${(det.score * 100).toFixed(1)}%`;
    const textWidth = ctx.measureText(label).width + 8;
    const textHeight = 16;

    const tx = Math.max(x, 0);
    const ty = Math.max(y - textHeight, 0);

    ctx.fillRect(tx, ty, textWidth, textHeight);

    ctx.fillStyle = "white";
    ctx.fillText(label, tx + 4, ty + 12);
  });
}


