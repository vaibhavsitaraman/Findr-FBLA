import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Plus,
  MapPin,
  Clock,
  Package,
  AlertTriangle,
  Lightbulb,
  Camera,
  Home,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../../lib/supabaseClient";

export function QueryPage() {
  const [activeTab, setActiveTab] = useState<"lost" | "found">("lost");
  const [lostFormData, setLostFormData] = useState({
    itemName: "",
    description: "",
    category: "",
    location: "",
    dateRange: "",
    contactEmail: "",
  });
  const [foundFormData, setFoundFormData] = useState({
    itemName: "",
    description: "",
    storageLocation: "",
    foundLocation: "",
    foundTime: "",
    image: null as File | null,
  });

  const handleLostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !lostFormData.itemName ||
      !lostFormData.description ||
      !lostFormData.category
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const { data: sessionRes, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError) {
      toast.error(sessionError.message);
      return;
    }

    const userId = sessionRes.session?.user.id;
    const email =
      lostFormData.contactEmail || sessionRes.session?.user.email || "";
    if (!email) {
      toast.error("Please enter a contact email");
      return;
    }

    const { error } = await supabase.from("listings").insert({
      title: lostFormData.itemName,
      description: lostFormData.description,
      category: lostFormData.category,
      source: "user",
      status: "active",
      estimated_location_text: lostFormData.location || null,
      contact_email: email,
      created_by: userId ?? null,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(
      "Lost item posted successfully! You will be notified if it's found.",
      {
        duration: 4000,
      },
    );

    // Reset form
    setLostFormData({
      itemName: "",
      description: "",
      category: "",
      location: "",
      dateRange: "",
      contactEmail: "",
    });
  };

  const handleFoundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !foundFormData.itemName ||
      !foundFormData.description ||
      !foundFormData.storageLocation
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success(
      "Found item reported successfully! Thank you for helping others.",
      {
        duration: 4000,
      },
    );

    // Reset form
    setFoundFormData({
      itemName: "",
      description: "",
      storageLocation: "",
      foundLocation: "",
      foundTime: "",
      image: null,
    });
  };

  const handleLostChange = (field: string, value: string) => {
    setLostFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFoundChange = (field: string, value: string | File) => {
    setFoundFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFoundFormData((prev) => ({ ...prev, image: file }));
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab("lost")}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === "lost"
                  ? "bg-white/20 text-white border border-white/20"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Package className="size-4 inline mr-2" />I Lost an Item
            </button>
            <button
              onClick={() => setActiveTab("found")}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === "found"
                  ? "bg-white/20 text-white border border-white/20"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Camera className="size-4 inline mr-2" />I Found an Item
            </button>
          </div>
        </div>

        {activeTab === "lost" ? (
          <>
            {/* Lost Item Header */}
            <div className="mb-8">
              <h1
                className="mb-2 text-white"
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "2.5rem",
                }}
              >
                Report a Lost Item
              </h1>
              <p className="text-gray-300 text-lg">
                Fill out the form below and we'll help you find your item
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form */}
              <Card
                className="lg:col-span-2 p-8 border border-white/10 bg-white/5 backdrop-blur-md shadow-xl rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                  boxShadow:
                    "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.15)",
                  backdropFilter: "blur(20px) saturate(180%)",
                }}
              >
                <form onSubmit={handleLostSubmit} className="space-y-6">
                  {/* Item Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="itemName"
                      className="flex items-center gap-2 text-white font-medium"
                    >
                      <Package className="size-4 text-blue-400" />
                      Item Name <span className="text-orange-400">*</span>
                    </Label>
                    <Input
                      id="itemName"
                      placeholder="e.g., Black JanSport Backpack"
                      value={lostFormData.itemName}
                      onChange={(e) =>
                        handleLostChange("itemName", e.target.value)
                      }
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300"
                      style={{
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                      }}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-white font-medium"
                    >
                      Description <span className="text-orange-400">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Provide a detailed description of your item (color, brand, distinguishing features, contents, etc.)"
                      value={lostFormData.description}
                      onChange={(e) =>
                        handleLostChange("description", e.target.value)
                      }
                      rows={4}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300"
                      style={{
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                      }}
                      required
                    />
                    <p className="text-gray-400 text-xs">
                      Be as specific as possible to help us identify your item
                    </p>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="category"
                      className="text-white font-medium"
                    >
                      Category <span className="text-orange-400">*</span>
                    </Label>
                    <Select
                      value={lostFormData.category}
                      onValueChange={(value) =>
                        handleLostChange("category", value)
                      }
                    >
                      <SelectTrigger
                        className="bg-white/5 border-white/10 text-white focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300"
                        style={{
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                        }}
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1e293b] border-white/10 text-white">
                        <SelectItem value="Backpack">Backpack</SelectItem>
                        <SelectItem value="Electronics">
                          Electronics (Phone, Laptop, etc.)
                        </SelectItem>
                        <SelectItem value="Keys">Keys</SelectItem>
                        <SelectItem value="Clothing">
                          Clothing & Accessories
                        </SelectItem>
                        <SelectItem value="Water Bottle">
                          Water Bottle
                        </SelectItem>
                        <SelectItem value="Books">Books & Notebooks</SelectItem>
                        <SelectItem value="Wallet">Wallet & Cards</SelectItem>
                        <SelectItem value="Jewelry">Jewelry</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location (Optional) */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="location"
                      className="flex items-center gap-2 text-white font-medium"
                    >
                      <MapPin className="size-4 text-blue-400" />
                      Last Known Location{" "}
                      <span className="text-gray-500 text-xs">(Optional)</span>
                    </Label>
                    <Input
                      id="location"
                      placeholder="e.g., Library 3rd Floor, Building A Room 205"
                      value={lostFormData.location}
                      onChange={(e) =>
                        handleLostChange("location", e.target.value)
                      }
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300"
                      style={{
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                      }}
                    />
                  </div>

                  {/* Time Range (Optional) */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="dateRange"
                      className="flex items-center gap-2 text-white font-medium"
                    >
                      <Clock className="size-4 text-blue-400" />
                      Approximate Time Lost{" "}
                      <span className="text-gray-500 text-xs">(Optional)</span>
                    </Label>
                    <Input
                      id="dateRange"
                      placeholder="e.g., Today around 2:00 PM, Yesterday afternoon"
                      value={lostFormData.dateRange}
                      onChange={(e) =>
                        handleLostChange("dateRange", e.target.value)
                      }
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300"
                      style={{
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                      }}
                    />
                  </div>

                  {/* Contact Email */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="contactEmail"
                      className="text-white font-medium"
                    >
                      Contact Email <span className="text-orange-400">*</span>
                    </Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="your.email@school.edu"
                      value={lostFormData.contactEmail}
                      onChange={(e) =>
                        handleLostChange("contactEmail", e.target.value)
                      }
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300"
                      style={{
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                      }}
                      required
                    />
                    <p className="text-gray-400 text-xs">
                      We'll notify you if your item is found
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full px-6 py-3 rounded-full font-semibold text-base text-white relative overflow-hidden group transition-all duration-300"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(96,165,250,0.9) 0%, rgba(37,99,235,0.95) 100%)",
                      boxShadow:
                        "0 4px 24px rgba(59,130,246,0.45), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.15)",
                      border: "1px solid rgba(255,255,255,0.25)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <Plus className="size-5 mr-2" />
                    Submit Lost Item Report
                  </Button>
                </form>
              </Card>

              {/* Info Sidebar */}
              <div className="space-y-6">
                {/* Tips Card */}
                <Card className="p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-md">
                  <h3 className="mb-4 flex items-center gap-2 text-blue-300 font-semibold text-lg">
                    <span className="size-8 rounded-lg flex items-center justify-center text-white font-bold bg-blue-600 shadow-lg">
                      <Lightbulb className="size-5" />
                    </span>
                    Tips for Success
                  </h3>
                  <ul className="space-y-3 text-gray-300 text-sm">
                    <li className="flex gap-2 items-start">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Be specific with your description</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>
                        Include unique identifiers (scratches, stickers, etc.)
                      </span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Mention the last known location</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Check the listings regularly</span>
                    </li>
                  </ul>
                </Card>

                {/* AI Detection Card */}
                <Card
                  className="p-6 rounded-2xl border border-green-500/20 bg-green-500/5 backdrop-blur-md"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                    boxShadow:
                      "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.15)",
                    backdropFilter: "blur(20px) saturate(180%)",
                  }}
                >
                  <h3 className="mb-4 text-green-300 font-semibold text-lg">
                    AI Detection Active
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Our AI system continuously monitors campus security cameras.
                    If your item is detected, you'll receive an automatic
                    notification!
                  </p>
                </Card>

                {/* Donation Warning */}
                <Card
                  className="p-6 rounded-2xl border border-orange-500/20 bg-orange-500/5 backdrop-blur-md"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                    boxShadow:
                      "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.15)",
                    backdropFilter: "blur(20px) saturate(180%)",
                  }}
                >
                  <h3 className="mb-2 text-orange-300 font-semibold text-lg flex items-center gap-2">
                    <AlertTriangle className="size-5" />
                    Reminder
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Unclaimed items are donated after 30 days. Make sure to
                    claim your item promptly!
                  </p>
                </Card>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Found Item Header */}
            <div className="mb-8">
              <h1
                className="mb-2 text-white"
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "2.5rem",
                }}
              >
                Report a Found Item
              </h1>
              <p className="text-gray-300 text-lg">
                Help others by reporting items you've found on campus
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form */}
              <Card
                className="lg:col-span-2 p-8 border border-white/10 bg-white/5 backdrop-blur-md shadow-xl rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                  boxShadow:
                    "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.15)",
                  backdropFilter: "blur(20px) saturate(180%)",
                }}
              >
                <form onSubmit={handleFoundSubmit} className="space-y-6">
                  {/* Item Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="foundItemName"
                      className="flex items-center gap-2 text-white font-medium"
                    >
                      <Package className="size-4 text-green-400" />
                      Item Name <span className="text-orange-400">*</span>
                    </Label>
                    <Input
                      id="foundItemName"
                      placeholder="e.g., Black JanSport Backpack"
                      value={foundFormData.itemName}
                      onChange={(e) =>
                        handleFoundChange("itemName", e.target.value)
                      }
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-500/50 backdrop-blur-sm transition-all duration-300"
                      style={{
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                      }}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="foundDescription"
                      className="text-white font-medium"
                    >
                      Description <span className="text-orange-400">*</span>
                    </Label>
                    <Textarea
                      id="foundDescription"
                      placeholder="Describe the item you found (color, brand, condition, any identifying features)"
                      value={foundFormData.description}
                      onChange={(e) =>
                        handleFoundChange("description", e.target.value)
                      }
                      rows={4}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-500/50 backdrop-blur-sm transition-all duration-300"
                      style={{
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                      }}
                      required
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="image"
                      className="flex items-center gap-2 text-white font-medium"
                    >
                      <Camera className="size-4 text-green-400" />
                      Photo of Item{" "}
                      <span className="text-gray-500 text-xs">(Optional)</span>
                    </Label>
                    <div className="relative">
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="image"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-300"
                        style={{
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                        }}
                      >
                        <Upload className="size-5 text-green-400" />
                        <span className="text-white">
                          {foundFormData.image
                            ? foundFormData.image.name
                            : "Click to upload image"}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Storage Location */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="storageLocation"
                      className="flex items-center gap-2 text-white font-medium"
                    >
                      <Home className="size-4 text-green-400" />
                      Where You Placed It{" "}
                      <span className="text-orange-400">*</span>
                    </Label>
                    <Input
                      id="storageLocation"
                      placeholder="e.g., Lost & Found office, Library front desk, Building A reception"
                      value={foundFormData.storageLocation}
                      onChange={(e) =>
                        handleFoundChange("storageLocation", e.target.value)
                      }
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-500/50 backdrop-blur-sm transition-all duration-300"
                      style={{
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                      }}
                      required
                    />
                  </div>

                  {/* Found Location */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="foundLocation"
                      className="flex items-center gap-2 text-white font-medium"
                    >
                      <MapPin className="size-4 text-green-400" />
                      Where You Found It{" "}
                      <span className="text-gray-500 text-xs">(Optional)</span>
                    </Label>
                    <Input
                      id="foundLocation"
                      placeholder="e.g., Library 3rd Floor study area, Cafeteria table 12"
                      value={foundFormData.foundLocation}
                      onChange={(e) =>
                        handleFoundChange("foundLocation", e.target.value)
                      }
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-500/50 backdrop-blur-sm transition-all duration-300"
                      style={{
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                      }}
                    />
                  </div>

                  {/* Found Time */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="foundTime"
                      className="flex items-center gap-2 text-white font-medium"
                    >
                      <Clock className="size-4 text-green-400" />
                      When You Found It{" "}
                      <span className="text-gray-500 text-xs">(Optional)</span>
                    </Label>
                    <Input
                      id="foundTime"
                      placeholder="e.g., Today around 2:00 PM, Yesterday during lunch"
                      value={foundFormData.foundTime}
                      onChange={(e) =>
                        handleFoundChange("foundTime", e.target.value)
                      }
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-500/50 backdrop-blur-sm transition-all duration-300"
                      style={{
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full px-6 py-3 rounded-full font-semibold text-base text-white relative overflow-hidden group transition-all duration-300"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(34,197,94,0.9) 0%, rgba(22,163,74,0.95) 100%)",
                      boxShadow:
                        "0 4px 24px rgba(34,197,94,0.45), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.15)",
                      border: "1px solid rgba(255,255,255,0.25)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <Plus className="size-5 mr-2" />
                    Submit Found Item Report
                  </Button>
                </form>
              </Card>

              {/* Info Sidebar */}
              <div className="space-y-6">
                {/* Thanks Card */}
                <Card
                  className="p-6 rounded-2xl border border-green-500/20 bg-green-500/5 backdrop-blur-md"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                    boxShadow:
                      "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.15)",
                    backdropFilter: "blur(20px) saturate(180%)",
                  }}
                >
                  <h3 className="mb-4 flex items-center gap-2 text-green-300 font-semibold text-lg">
                    <span className="size-8 rounded-lg flex items-center justify-center text-white font-bold bg-green-600 shadow-lg">
                      <Lightbulb className="size-5" />
                    </span>
                    Thank You for Helping!
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Your report helps reunite students with their belongings.
                    You're making a real difference in our campus community!
                  </p>
                </Card>

                {/* Safety Tips */}
                <Card
                  className="p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-md"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                    boxShadow:
                      "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.15)",
                    backdropFilter: "blur(20px) saturate(180%)",
                  }}
                >
                  <h3 className="mb-4 text-blue-300 font-semibold text-lg">
                    Safety Reminder
                  </h3>
                  <ul className="space-y-3 text-gray-300 text-sm">
                    <li className="flex gap-2 items-start">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Don't keep valuable items with you</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Turn items in to official locations</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Report immediately for best results</span>
                    </li>
                  </ul>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
