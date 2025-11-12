import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createThread } from "../features/threads/threadsSlice";
import { useNavigate } from "react-router-dom";

export default function NewThreadPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Harap login untuk membuat thread.");
    const payload = { title, body, category };
    const res = await dispatch(createThread(payload));
    if (res.type === "threads/createThread/fulfilled") {
      alert("Thread berhasil dibuat!");
      navigate("/");
    } else {
      alert(res.payload || res.error?.message || "Gagal membuat thread");
    }
  };

  return (
    <div
      className="card"
      style={{
        maxWidth: 600,
        margin: "0 auto",
        padding: "20px",
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>
        Buat Thread Baru
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {/* Judul */}
        <input
          className="input"
          style={{
            padding: "10px",
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
          placeholder="Judul"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Kategori */}
        <input
          className="input"
          style={{
            padding: "10px",
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
          placeholder="Kategori (mis. redux)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        {/* Isi / Body */}
        <textarea
          className="input"
          style={{
            padding: "10px",
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: "14px",
            resize: "vertical",
          }}
          placeholder="Isi thread..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          required
        />

        {/* Tombol Submit */}
        <button
          type="submit"
          className="button"
          style={{
            backgroundColor: "#2563eb",
            color: "#fff",
            padding: "10px",
            borderRadius: 6,
            fontWeight: 600,
            cursor: "pointer",
            border: "none",
          }}
        >
          Buat Thread
        </button>
      </form>
    </div>
  );
}
