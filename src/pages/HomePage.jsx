// src/pages/HomePage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchThreads } from "../features/threads/threadsSlice";
import ThreadList from "../components/ThreadList";
import LoadingIndicator from "../components/LoadingIndicator";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading, error } = useSelector((s) => s.threads);
  const [filter, setFilter] = useState("all");

  // 🔹 Ambil semua thread saat halaman pertama kali dimuat
  useEffect(() => {
    dispatch(fetchThreads());
  }, [dispatch]);

  // 🔹 Pastikan list adalah array (untuk mencegah error render)
  const safeList = Array.isArray(list) ? list : [];

  // 🔹 Ambil kategori unik untuk filter tombol
  const categories = useMemo(() => {
    const cats = new Set();
    safeList.forEach((t) => {
      if (t.category) cats.add(t.category);
    });
    return Array.from(cats);
  }, [safeList]);

  // 🔹 Filter thread berdasarkan kategori
  const filtered =
    filter === "all" ? safeList : safeList.filter((t) => t.category === filter);

  return (
    <div className="page-container">
      {/* 🔸 Header + Tombol Create */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Diskusi</h2>
        <button
          onClick={() => navigate("/threads/create")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Buat Thread
        </button>
      </div>

      {/* 🔸 Kategori Populer */}
      <div className="card mb-4">
        <h2 className="text-lg font-semibold mb-3">Kategori populer</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`tag ${filter === "all" ? "tag-active" : ""}`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`tag ${filter === c ? "tag-active" : ""}`}
            >
              #{c}
            </button>
          ))}
        </div>
      </div>

      {/* 🔸 Daftar Diskusi */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Diskusi tersedia</h2>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-6">
            <LoadingIndicator />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="card text-red-600 text-center py-8">
            Gagal memuat thread: {error}
          </div>
        )}

        {/* Data Kosong */}
        {!loading && !error && filtered.length === 0 && (
          <div className="card text-center py-8 text-gray-500">
            Belum ada thread.
          </div>
        )}

        {/* Daftar Thread */}
        {!loading && !error && filtered.length > 0 && (
          <ThreadList threads={filtered} />
        )}
      </div>
    </div>
  );
}
