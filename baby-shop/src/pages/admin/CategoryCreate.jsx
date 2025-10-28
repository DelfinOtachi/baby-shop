import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Upload, Trash2 } from "lucide-react";

export default function CategoryCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    slug: "",
    parent: "",
    image: "",
    featured: false, // ✅ NEW FIELD
  });
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const slugify = (text) =>
    text.toLowerCase().trim().replace(/[\s\W-]+/g, "-");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      slug: name === "name" ? slugify(value) : prev.slug,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((prev) => ({ ...prev, image: data.imageUrl }));
      setPreview(data.imageUrl);
    } catch (err) {
      console.error(err);
      setError("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name) {
      setError("Category name is required.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/categories", form);
      alert("✅ Category created successfully!");
      navigate("/admin/categories");
    } catch (err) {
      console.error(err);
      setError("Failed to create category.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        🍼 Create New Category
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 space-y-6"
      >
        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-2 rounded">{error}</div>
        )}

        {/* Category Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category Name *
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g., Baby Clothing"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-300 outline-none"
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Slug
          </label>
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="auto-generated from name"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none bg-gray-50"
            readOnly
          />
        </div>

        {/* Parent Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Parent Category (optional)
          </label>
          <input
            name="parent"
            value={form.parent}
            onChange={handleChange}
            placeholder="e.g., New Arrivals or Baby Gear"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none"
          />
        </div>

        {/* Featured Checkbox ✅ */}
        <div className="flex items-center gap-2">
          <input
            id="featured"
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
            className="h-4 w-4 text-pink-500 border-gray-300 rounded"
          />
          <label htmlFor="featured" className="text-gray-700 text-sm font-medium">
            Mark as Featured (show on homepage)
          </label>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category Image
          </label>
          <div className="flex items-center space-x-3">
            <label className="bg-pink-400 text-white px-4 py-2 rounded-lg flex items-center cursor-pointer hover:bg-pink-500 transition">
              <Upload size={18} className="mr-2" />
              {uploading ? "Uploading..." : "Upload Image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {preview && (
              <div className="relative w-20 h-20 border rounded-lg overflow-hidden">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreview("");
                    setForm((prev) => ({ ...prev, image: "" }));
                  }}
                  className="absolute top-1 right-1 bg-white/80 p-1 rounded-full hover:bg-white"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-full transition"
          >
            Save Category
          </button>
        </div>
      </form>
    </div>
  );
}
