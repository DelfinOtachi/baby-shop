import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Upload, Trash2 } from "lucide-react";

// Utility: make slug from name
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-");

export default function ProductCreate() {
  const navigate = useNavigate();
  

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    oldPrice: "",
    category: "",
    subCategory: "",
    countInStock: 0,
    featured: false,
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState("");

  // 🟢 Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/categories");
        setCategories(data);
      } catch (err) {
        console.error("Could not load categories", err);
      }
    };
    loadCategories();
  }, []);

  // 🟢 Load subcategories when category changes
  useEffect(() => {
    const loadSubCategories = async () => {
      if (!form.category) {
        setSubCategories([]);
        setForm((prev) => ({ ...prev, subCategory: "" }));
        return;
      }
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/subcategories/category/${form.category}`
        );
        setSubCategories(data);
      } catch (err) {
        console.error("Could not load subcategories", err);
      }
    };
    loadSubCategories();
  }, [form.category]);

  // 🟢 Input handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newForm = { ...form, [name]: type === "checkbox" ? checked : value };
    if (name === "name" && !form.slug) {
      newForm.slug = slugify(value);
    }
    setForm(newForm);
  };

  // 🟢 File preview handler
  const handleImageFiles = (e) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map((file) => ({
      id: Date.now() + "-" + file.name,
      file,
      url: URL.createObjectURL(file),
      uploading: false,
      progress: 0,
    }));
    setImages((prev) => [...prev, ...previews]);
  };

  // 🟢 Upload images to Cloudinary
  const uploadImages = async () => {
    const token = localStorage.getItem("token") || "";
    const uploadedUrls = [];

    for (const img of images) {
      if (img.uploading || img.progress === 100) continue;

      const formData = new FormData();
      formData.append("image", img.file);

      setImages((prev) =>
        prev.map((i) => (i.id === img.id ? { ...i, uploading: true } : i))
      );

      try {
        const res = await axios.post("http://localhost:5000/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setImages((prev) =>
              prev.map((i) =>
                i.id === img.id ? { ...i, progress: percent } : i
              )
            );
          },
        });

        // ✅ Use Cloudinary URL only
        const imageUrl = res.data.imageUrl || res.data.url;
        if (imageUrl && imageUrl.startsWith("http")) {
          uploadedUrls.push(imageUrl);
        }

        setImages((prev) =>
          prev.map((i) =>
            i.id === img.id
              ? { ...i, uploading: false, progress: 100, url: imageUrl }
              : i
          )
        );
      } catch (err) {
        console.error("Upload error:", err);
        setErrors("Some images failed to upload.");
      }
    }

    return uploadedUrls;
  };

  // 🟢 Remove image preview
  const removeImage = (id) => {
    setImages((prev) => prev.filter((i) => i.id !== id));
  };

  // 🟢 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");

    if (!form.name || !form.slug || !form.price || !form.category) {
      setErrors("Please fill all required fields.");
      return;
    }

    const token = localStorage.getItem("token") || "";

    // ✅ Upload all images first
    const finalImages = (await uploadImages()).filter((url) =>
      url.startsWith("http")
    );

    if (finalImages.length === 0) {
      setErrors("Please upload at least one image.");
      return;
    }
    const baseSlug = slugify(form.name);
  const uniqueSlug = `${baseSlug}-${Date.now()}`; // 👈 makes it unique

    const productPayload = {
      name: form.name,
      slug: uniqueSlug,
      description: form.description,
      images: finalImages,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      category: form.category,
      subCategory: form.subCategory || undefined,
      countInStock: Number(form.countInStock || 0),
      featured: Boolean(form.featured),
    };

    try {
      await axios.post("http://localhost:5000/api/products", productPayload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      alert("✅ Product created successfully!");
      navigate("/admin/create-product");
    } catch (err) {
      console.error("Create product error:", err);
      setErrors("Failed to create product. Check console.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        🧸 Create New Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
      >
        {errors && (
          <div className="text-red-600 bg-red-50 p-3 rounded">{errors}</div>
        )}

        {/* Product details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Baby Cotton Romper"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-babyPink outline-none"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Slug *
            </label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="baby-cotton-romper"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              required
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              required
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subcategory
            </label>
            <select
              name="subCategory"
              value={form.subCategory}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              disabled={!subCategories.length}
            >
              <option value="">Select subcategory</option>
              {subCategories.map((sc) => (
                <option key={sc._id} value={sc._id}>
                  {sc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Count In Stock
            </label>
            <input
              name="countInStock"
              type="number"
              value={form.countInStock}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price (KES) *
            </label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              required
            />
          </div>

          {/* Old Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Old Price
            </label>
            <input
              name="oldPrice"
              type="number"
              value={form.oldPrice}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3 mt-2">
            <input
              id="featured"
              name="featured"
              type="checkbox"
              checked={form.featured}
              onChange={handleChange}
              className="h-4 w-4 text-pink-500"
            />
            <label htmlFor="featured" className="text-sm text-gray-700">
              Mark as Featured
            </label>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Images
          </label>
          <label className="inline-flex items-center bg-babyPink text-white px-4 py-2 rounded-lg cursor-pointer hover:brightness-95">
            <Upload size={16} className="mr-2" />
            Choose Files
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageFiles}
              className="hidden"
            />
          </label>

          {/* Preview */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="relative border rounded-lg overflow-hidden"
              >
                <img
                  src={img.url}
                  alt="preview"
                  className="w-full h-32 object-cover"
                />
                {img.uploading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-sm text-gray-600">
                    {img.progress}%
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-white"
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>
                {img.progress > 0 && img.progress < 100 && (
                  <div
                    className="absolute bottom-0 left-0 h-1 bg-babyPink transition-all"
                    style={{ width: `${img.progress}%` }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-babyPurple text-white rounded-lg hover:bg-purple-600"
          >
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
}
