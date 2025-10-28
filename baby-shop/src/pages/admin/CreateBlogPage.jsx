import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Upload, Image } from "lucide-react";
import axios from "axios";

export default function CreateBlogPage() {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    image: "",
    content: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleEditorChange = (value) =>
    setFormData({ ...formData, content: value });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("image", file);

    try {
      const res = await axios.post("http://localhost:5000/api/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFormData({ ...formData, image: res.data.imageUrl });
      alert("✅ Image uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New blog post:", formData);
    alert("Blog post created successfully!");
    navigate("/blog");
  };

  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">✍️ Create New Blog Post</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Blog Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter blog title..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-babyPink outline-none"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Parenting Tips, New Arrivals..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-babyPurple outline-none"
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Featured Image</label>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Paste image URL or upload..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-babyBlue outline-none"
            />
            <label className="flex items-center bg-babyPink text-white px-4 py-2 rounded-lg hover:bg-pink-500 transition cursor-pointer">
              <Upload size={18} className="mr-2" />
              {uploading ? "Uploading..." : "Upload"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {formData.image && (
            <div className="mt-4">
              <img
                src={formData.image}
                alt="Preview"
                className="rounded-lg w-full max-h-80 object-cover border"
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Blog Content</label>
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={handleEditorChange}
            className="bg-white rounded-lg"
            placeholder="Write your amazing blog post here..."
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"],
                ["clean"],
              ],
            }}
          />
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            className="bg-babyPurple hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-full transition"
          >
            Publish Blog Post
          </button>
        </div>
      </form>
    </section>
  );
}
