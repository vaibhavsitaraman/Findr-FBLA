import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, MapPin, Clock, Package, AlertTriangle, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';

export function QueryPage() {
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    category: '',
    location: '',
    dateRange: '',
    contactEmail: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.itemName || !formData.description || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Mock submission
    toast.success('Lost item posted successfully! You will be notified if it\'s found.', {
      duration: 4000,
    });

    // Reset form
    setFormData({
      itemName: '',
      description: '',
      category: '',
      location: '',
      dateRange: '',
      contactEmail: '',
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 
            className="mb-2 text-white"
            style={{ 
              fontFamily: "'EB Garamond', serif",
              fontSize: '2.5rem'
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
          <Card className="lg:col-span-2 p-8 border border-white/10 bg-white/5 backdrop-blur-md shadow-xl rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item Name */}
              <div className="space-y-2">
                <Label htmlFor="itemName" className="flex items-center gap-2 text-white font-medium">
                  <Package className="size-4 text-blue-400" />
                  Item Name <span className="text-orange-400">*</span>
                </Label>
                <Input
                  id="itemName"
                  placeholder="e.g., Black JanSport Backpack"
                  value={formData.itemName}
                  onChange={(e) => handleChange('itemName', e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white font-medium">
                  Description <span className="text-orange-400">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of your item (color, brand, distinguishing features, contents, etc.)"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
                  required
                />
                <p className="text-gray-400 text-xs">
                  Be as specific as possible to help us identify your item
                </p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-white font-medium">
                  Category <span className="text-orange-400">*</span>
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-blue-500/50">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e293b] border-white/10 text-white">
                    <SelectItem value="Backpack">Backpack</SelectItem>
                    <SelectItem value="Electronics">Electronics (Phone, Laptop, etc.)</SelectItem>
                    <SelectItem value="Keys">Keys</SelectItem>
                    <SelectItem value="Clothing">Clothing & Accessories</SelectItem>
                    <SelectItem value="Water Bottle">Water Bottle</SelectItem>
                    <SelectItem value="Books">Books & Notebooks</SelectItem>
                    <SelectItem value="Wallet">Wallet & Cards</SelectItem>
                    <SelectItem value="Jewelry">Jewelry</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2 text-white font-medium">
                  <MapPin className="size-4 text-blue-400" />
                  Last Known Location <span className="text-gray-500 text-xs">(Optional)</span>
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., Library 3rd Floor, Building A Room 205"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
                />
              </div>

              {/* Time Range (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="dateRange" className="flex items-center gap-2 text-white font-medium">
                  <Clock className="size-4 text-blue-400" />
                  Approximate Time Lost <span className="text-gray-500 text-xs">(Optional)</span>
                </Label>
                <Input
                  id="dateRange"
                  placeholder="e.g., Today around 2:00 PM, Yesterday afternoon"
                  value={formData.dateRange}
                  onChange={(e) => handleChange('dateRange', e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
                />
              </div>

              {/* Contact Email */}
              <div className="space-y-2">
                <Label htmlFor="contactEmail" className="text-white font-medium">
                  Contact Email <span className="text-orange-400">*</span>
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="your.email@school.edu"
                  value={formData.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
                  required
                />
                <p className="text-gray-400 text-xs">
                  We'll notify you if your item is found
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 rounded-xl shadow-lg shadow-blue-900/20"
                size="lg"
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
                <span 
                  className="size-8 rounded-lg flex items-center justify-center text-white font-bold bg-blue-600 shadow-lg"
                >
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
                  <span>Include unique identifiers (scratches, stickers, etc.)</span>
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
            <Card className="p-6 rounded-2xl border border-green-500/20 bg-green-500/5 backdrop-blur-md">
              <h3 className="mb-4 text-green-300 font-semibold text-lg">
                AI Detection Active
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Our AI system continuously monitors campus security cameras. If your item is detected, you'll receive an automatic notification!
              </p>
            </Card>

            {/* Donation Warning */}
            <Card className="p-6 rounded-2xl border border-orange-500/20 bg-orange-500/5 backdrop-blur-md">
              <h3 className="mb-2 text-orange-300 font-semibold text-lg flex items-center gap-2">
                <AlertTriangle className="size-5" />
                Reminder
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Unclaimed items are donated after 30 days. Make sure to claim your item promptly!
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
