import React from "react";
import { Link } from "react-router-dom";

const posts = [
  {
    id: 1,
    title: "Postpartum Wellness Reimagined: The Future of Mental Health Tools for New Parents",
    date: "October 23, 2025",
    excerpt: "Life after baby is a whole new world… discover how mental health tools can support you in 2025 and beyond.",
    image: "/images/blog/post1.jpg",
    category: "Parenting Tips",
  },
  {
    id: 2,
    title: "10 Essential Baby Gear Items Every Kenyan Parent Should Have",
    date: "September 15, 2025",
    excerpt: "From strollers to car seats — here’s your go-to list of must-haves for your little one.",
    image: "/images/blog/post2.jpg",
    category: "Gear Guide",
  },
  {
    id: 3,
    title: "How to Choose the Perfect Baby Romper: Fabric, Fit & Fashion",
    date: "August 10, 2025",
    excerpt: "It’s more than adorable — the right romper means comfort, safety and style. Learn how to pick wisely.",
    image: "/images/blog/post3.jpg",
    category: "Style Advice",
  },
];

export default function BlogListPage() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-gray-800 mb-12">From the Blog</h1>
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} to={`/blog/${post.id}`} className="group">
            <div className="overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="mt-4">
              <p className="text-sm text-babyPink uppercase font-medium">{post.category}</p>
              <h2 className="text-2xl font-semibold text-gray-800 mt-2 group-hover:text-babyPurple transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-600 mt-2">{post.excerpt}</p>
              <p className="text-sm text-gray-500 mt-1">{post.date}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
