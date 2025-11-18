import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Upload, Trash2 } from "lucide-react";

const slugify = (text) =>
  text.toString().toLowerCase().trim().replace(/[\s\W-]+/g, "-");

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
    newArrival: false,
    topDeal: false,
    variants: [], // each variant: { type, value, colorCode?, images: [] }
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState("");

  // Load categories
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

  // Load subcategories
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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;
    if (["price", "oldPrice", "countInStock"].includes(name)) newValue = Number(value);

    setForm((prev) => {
      if (name === "name") {
        return { ...prev, name: value, slug: `${slugify(value)}-${Date.now()}` };
      }
      return { ...prev, [name]: newValue };
    });
  };

  // ---------- IMAGE HANDLERS ----------
  const handleImageFiles = (e) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map((file) => ({
      id: Date.now() + "-" + file.name,
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...previews]);
  };

  const removeImage = (id) => setImages((prev) => prev.filter((i) => i.id !== id));

  const uploadImages = async (imgs) => {
    const token = localStorage.getItem("token") || "";
    const uploads = imgs.map(async (img) => {
      if (img.url?.startsWith("http")) return img.url;

      const formData = new FormData();
      formData.append("image", img.file);

      try {
        const res = await axios.post("http://localhost:5000/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          timeout: 15000,
        });
        return res.data.url || res.data.imageUrl || res.data.secure_url;
      } catch (err) {
        console.error("Upload failed:", err);
        throw new Error("Image upload failed");
      }
    });

    return Promise.all(uploads);
  };

  // ---------- VARIANTS HANDLERS ----------
  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { type: "color", value: "", colorCode: "#000000", images: [] },
      ],
    }));
  };

  const updateVariant = (idx, field, value) => {
    setForm((prev) => {
      const newVariants = [...prev.variants];
      newVariants[idx][field] = value;
      return { ...prev, variants: newVariants };
    });
  };

  const removeVariant = (idx) => {
    setForm((prev) => {
      const newVariants = [...prev.variants];
      newVariants.splice(idx, 1);
      return { ...prev, variants: newVariants };
    });
  };

  const handleVariantImages = (idx, files) => {
    const previews = Array.from(files).map((file) => ({
      id: Date.now() + "-" + file.name,
      file,
      url: URL.createObjectURL(file),
    }));
    setForm((prev) => {
      const newVariants = [...prev.variants];
      newVariants[idx].images = [...(newVariants[idx].images || []), ...previews];
      return { ...prev, variants: newVariants };
    });
  };

  const removeVariantImage = (variantIdx, imgIdx) => {
    setForm((prev) => {
      const newVariants = [...prev.variants];
      newVariants[variantIdx].images.splice(imgIdx, 1);
      return { ...prev, variants: newVariants };
    });
  };

  // ---------- SUBMIT ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");

    if (!form.name || !form.price || !form.category) {
      return setErrors("Please fill all required fields.");
    }

    try {
      // Upload main images
      const mainImages = await uploadImages(images);
      if (mainImages.length === 0) return setErrors("Please upload at least one main image.");

      // Upload variant images and flatten variants
      const flattenedVariants = [];
      for (let i = 0; i < form.variants.length; i++) {
        const v = form.variants[i];
        if (!v.value.trim()) return setErrors(`Variant #${i + 1} missing value`);
        if (!v.images || v.images.length === 0)
          return setErrors(`Variant "${v.value}" needs at least one image.`);

        const uploadedVariantImages = await uploadImages(v.images);

        flattenedVariants.push({
          type: v.type,
          value: v.value,
          colorCode: v.type === "color" ? v.colorCode || "#000000" : undefined,
          images: uploadedVariantImages,
        });
      }

      const payload = {
        ...form,
        slug: `${slugify(form.name)}-${Date.now()}`,
        images: mainImages,
        variants: flattenedVariants,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
        countInStock: Number(form.countInStock || 0),
      };

      const token = localStorage.getItem("token") || "";
      await axios.post("http://localhost:5000/api/products", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      alert("✅ Product created successfully!");
      navigate("/admin/create-product");
    } catch (err) {
      console.error("Product creation failed:", err);
      setErrors("Failed to create product.");
    }
  };

  // ---------- UI ----------
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-semibold mb-6">🧸 Create New Product</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
        {errors && <div className="text-red-600 bg-red-50 p-3 rounded">{errors}</div>}

        {/* BASIC INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product Name"
              className="w-full border px-4 py-2 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Slug *</label>
            <input
              name="slug"
              value={form.slug}
              placeholder="slug"
              className="w-full border px-4 py-2 rounded-lg bg-gray-100"
              readOnly
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border px-4 py-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg"
              required
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Subcategory</label>
            <select
              name="subCategory"
              value={form.subCategory}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg"
              disabled={!subCategories.length}
            >
              <option value="">Select subcategory</option>
              {subCategories.map((sc) => (
                <option key={sc._id} value={sc._id}>{sc.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Count In Stock</label>
            <input
              name="countInStock"
              type="number"
              value={form.countInStock}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Price *</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Old Price</label>
            <input
              name="oldPrice"
              type="number"
              value={form.oldPrice}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg"
            />
          </div>

          <div className="flex items-center gap-3 mt-2">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="h-4 w-4" />
            <label className="text-sm">Featured</label>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <input type="checkbox" name="topDeal" checked={form.topDeal} onChange={handleChange} className="h-4 w-4" />
            <label className="text-sm">Top Deal</label>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <input type="checkbox" name="newArrival" checked={form.newArrival} onChange={handleChange} className="h-4 w-4" />
            <label className="text-sm">New Arrival</label>
          </div>
        </div>

        {/* MAIN IMAGES */}
        <div>
          <label htmlFor="main-images" className="inline-flex items-center bg-pink-500 text-white px-4 py-2 rounded-lg cursor-pointer">
            <Upload size={16} className="mr-2" /> Choose Files
          </label>
          <input
            id="main-images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageFiles}
            className="hidden"
          />
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img) => (
              <div key={img.id} className="relative border rounded-lg overflow-hidden">
                <img src={img.url} alt="preview" className="w-full h-32 object-cover" />
                <button type="button" onClick={() => removeImage(img.id)} className="absolute top-1 right-1 bg-white/80 rounded-full p-1">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* VARIANTS */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Variants</h3>
          {form.variants.map((variant, idx) => (
            <div key={idx} className="border p-3 rounded-lg">
              <div className="flex flex-wrap gap-2 mb-2 items-center">
                <select value={variant.type} onChange={(e) => updateVariant(idx, "type", e.target.value)} className="border px-2 py-1 rounded">
                  <option value="color">Color</option>
                  <option value="size">Size</option>
                  <option value="age">Age</option>
                </select>

                <input
                  type="text"
                  value={variant.value}
                  onChange={(e) => updateVariant(idx, "value", e.target.value)}
                  placeholder={`Variant ${variant.type} value`}
                  className="border px-3 py-1 rounded flex-1"
                />

                {variant.type === "color" && (
                  <input
                    type="color"
                    value={variant.colorCode || "#000000"}
                    onChange={(e) => updateVariant(idx, "colorCode", e.target.value)}
                    className="w-12 h-8 border rounded cursor-pointer"
                  />
                )}

                <button type="button" onClick={() => removeVariant(idx)} className="bg-red-500 text-white px-2 rounded">
                  Remove
                </button>
              </div>

              <label htmlFor={`variant-images-${idx}`} className="inline-flex items-center bg-pink-500 text-white px-3 py-1 rounded cursor-pointer mb-2">
                Upload Images
              </label>
              <input
                id={`variant-images-${idx}`}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleVariantImages(idx, e.target.files)}
                className="hidden"
              />

              <div className="flex gap-2 flex-wrap">
                {variant.images?.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 border rounded overflow-hidden">
                    <img src={img.url} alt="variant" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeVariantImage(idx, i)} className="absolute top-1 right-1 bg-white/80 rounded-full p-1">
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button type="button" onClick={addVariant} className="bg-green-500 text-white px-3 py-1 rounded">
            + Add Variant
          </button>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 rounded-lg border">
            Cancel
          </button>
          <button type="submit" className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
}
