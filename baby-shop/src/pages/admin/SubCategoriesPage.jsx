import React, { useEffect, useState } from "react";
import axios from "axios";
import { Upload, Trash2, Edit } from "lucide-react";

export default function SubCategoriesPage() {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "",
    image: "",
    featured: false,
  });

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:5000/api/categories");
    setCategories(res.data);
  };

  const fetchSubCategories = async () => {
    const res = await axios.get("http://localhost:5000/api/subcategories");
    setSubCategories(res.data);
  };

  const slugify = (text) =>
    text.toLowerCase().trim().replace(/[\s\W-]+/g, "-");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      slug: name === "name" ? slugify(value) : prev.slug,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formDataImg = new FormData();
    formDataImg.append("image", file);

    try {
      const { data } = await axios.post("http://localhost:5000/api/upload", formDataImg, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData((prev) => ({ ...prev, image: data.imageUrl }));
      setPreview(data.imageUrl);
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category) {
      alert("Please enter name and select category");
      return;
    }

    if (editingId) {
      // Update existing subcategory
      await axios.put(`http://localhost:5000/api/subcategories/${editingId}`, formData);
      alert("SubCategory updated successfully!");
    } else {
      // Create new subcategory
      await axios.post("http://localhost:5000/api/subcategories", formData);
      alert("SubCategory created successfully!");
    }

    fetchSubCategories();
    resetForm();
  };

  const handleEdit = (sub) => {
    setEditingId(sub._id);
    setFormData({
      name: sub.name,
      slug: sub.slug,
      category: sub.category?._id || sub.category,
      image: sub.image || "",
      featured: sub.featured || false,
    });
    setPreview(sub.image || "");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this subcategory?")) {
      await axios.delete(`http://localhost:5000/api/subcategories/${id}`);
      fetchSubCategories();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      category: "",
      image: "",
      featured: false,
    });
    setPreview("");
    setEditingId(null);
  };

  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Manage SubCategories
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md space-y-4 mb-10"
      >
        <div>
          <label className="block mb-1 text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 w-full"
            placeholder="e.g. Sleepwear"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Slug</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 w-full"
            readOnly
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Parent Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 w-full"
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ Featured checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            id="featured"
          />
          <label htmlFor="featured" className="text-gray-700">
            Featured SubCategory
          </label>
        </div>

        {/* ✅ Image Upload */}
        <div>
          <label className="block mb-1 text-gray-700">Image</label>
          <div className="flex items-center space-x-3">
            <label className="bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center cursor-pointer hover:bg-purple-600 transition">
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
                    setFormData((prev) => ({ ...prev, image: "" }));
                  }}
                  className="absolute top-1 right-1 bg-white/80 p-1 rounded-full hover:bg-white"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-3 pt-2">
          <button
            type="submit"
            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600"
          >
            {editingId ? "Update SubCategory" : "Add SubCategory"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">All SubCategories</h2>
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Featured</th>
              <th className="border px-4 py-2">Image</th>
              <th className="border px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subCategories.map((sub) => (
              <tr key={sub._id}>
                <td className="border px-4 py-2">{sub.name}</td>
                <td className="border px-4 py-2">{sub.category?.name}</td>
                <td className="border px-4 py-2 text-center">
                  {sub.featured ? "✅" : "❌"}
                </td>
                <td className="border px-4 py-2">
                  {sub.image && (
                    <img
                      src={sub.image}
                      alt={sub.name}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  )}
                </td>
                <td className="border px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(sub)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(sub._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
