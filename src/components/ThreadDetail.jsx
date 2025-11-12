// src/components/ThreadDetail.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DOMPurify from "dompurify";
import {
  addComment,
  voteThread,
  voteComment,
  fetchThreadDetail,
} from "../features/threads/threadsSlice";
import {
  FaRegThumbsUp,
  FaRegThumbsDown,
  FaRegCommentDots,
  FaRegShareSquare,
} from "react-icons/fa";

export default function ThreadDetail({ threadId }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { current: thread, loading } = useSelector((s) => s.threads);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (threadId) dispatch(fetchThreadDetail(threadId));
  }, [dispatch, threadId]);

  if (loading || !thread) return <p>Loading...</p>;

  const cleanHTML = DOMPurify.sanitize(thread.body || thread.content, {
    USE_PROFILES: { html: true },
  })
    .replaceAll("<div>", "")
    .replaceAll("</div>", "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Harap login untuk memberikan komentar.");
    if (!content.trim()) return;
    await dispatch(addComment({ threadId: thread.id, content }));
    setContent("");
    dispatch(fetchThreadDetail(thread.id));
  };

  const handleVoteThread = (type) => {
    if (!user) return alert("Harap login untuk vote.");
    const hasVoted =
      type === "up"
        ? thread.upVotesBy.includes(user.id)
        : thread.downVotesBy.includes(user.id);

    dispatch(
      voteThread({
        threadId: thread.id,
        type: hasVoted ? "neutral" : type,
      })
    );
  };

  const handleVoteComment = (comment, type) => {
    if (!user) return alert("Harap login untuk vote komentar.");
    const hasVoted =
      type === "up"
        ? comment.upVotesBy.includes(user.id)
        : comment.downVotesBy.includes(user.id);

    dispatch(
      voteComment({
        threadId: thread.id,
        commentId: comment.id,
        type: hasVoted ? "neutral" : type,
      })
    );
  };

  return (
    <div
      className="card"
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: 20,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      {/* 🔹 Kategori */}
      {thread.category && (
        <div
          style={{
            background: "#eef2ff",
            display: "inline-block",
            padding: "4px 10px",
            borderRadius: 8,
            color: "#4f46e5",
            fontWeight: 500,
          }}
        >
          #{thread.category}
        </div>
      )}

      {/* 🔹 Judul */}
      <h2
        style={{
          marginTop: 12,
          fontSize: 28,
          fontWeight: "bold",
          color: "#1e1e1e",
          lineHeight: 1.3,
        }}
      >
        {thread.title}
      </h2>

      {/* 🔹 Isi Thread */}
      <div
        className="thread-body"
        style={{ marginTop: 16, lineHeight: 1.7 }}
        dangerouslySetInnerHTML={{ __html: cleanHTML }}
      ></div>

      {/* 🔹 Info Pemilik */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: 20,
          marginBottom: 8,
          gap: 8,
          opacity: 0.8,
        }}
      >
        {thread.owner?.avatar && (
          <img
            src={thread.owner.avatar}
            alt={thread.owner.name}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        )}
        <div className="small-muted">
          <strong>{thread.owner?.name}</strong> •{" "}
          {new Date(thread.createdAt).toLocaleString()}
        </div>
      </div>

      {/* 🔹 Statistik (vote & komentar seperti di ThreadItem) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 16,
          borderTop: "1px solid #eee",
          paddingTop: 12,
        }}
      >
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <button
            onClick={() => handleVoteThread("up")}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: thread.upVotesBy.includes(user?.id) ? "#4f46e5" : "#555",
              fontSize: 16,
            }}
          >
            <FaRegThumbsUp /> {thread.upVotesBy?.length || 0}
          </button>

          <button
            onClick={() => handleVoteThread("down")}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: thread.downVotesBy.includes(user?.id) ? "red" : "#555",
              fontSize: 16,
            }}
          >
            <FaRegThumbsDown /> {thread.downVotesBy?.length || 0}
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#555",
              fontSize: 16,
            }}
          >
            <FaRegCommentDots /> {thread.comments?.length || 0}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#555",
              fontSize: 16,
            }}
          >
            <FaRegShareSquare /> 1
          </div>
        </div>
      </div>

      {/* 🔹 Komentar */}
      <hr style={{ margin: "16px 0" }} />
      <h3 style={{ fontSize: 20, marginBottom: 10 }}>
        Komentar ({thread.comments?.length ?? 0})
      </h3>

      <div style={{ marginTop: 8 }}>
        {thread.comments && thread.comments.length > 0 ? (
          thread.comments.map((c) => (
            <div
              key={c.id}
              style={{
                border: "1px solid #eee",
                borderRadius: 8,
                padding: 10,
                marginBottom: 10,
                background: "#fafafa",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {c.owner?.avatar && (
                  <img
                    src={c.owner.avatar}
                    alt={c.owner.name}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                )}
                <div className="small-muted">
                  <strong>{c.owner?.name}</strong> •{" "}
                  {new Date(c.createdAt).toLocaleString()}
                </div>
              </div>

              <div
                style={{ marginTop: 6, lineHeight: 1.5 }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(c.content),
                }}
              ></div>

              {/* 🔹 Vote pada komentar */}
              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <button
                  type="button"
                  onClick={() => handleVoteComment(c, "up")}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 14,
                    color: c.upVotesBy.includes(user?.id) ? "#4f46e5" : "#555",
                  }}
                >
                  <FaRegThumbsUp /> {c.upVotesBy?.length || 0}
                </button>

                <button
                  type="button"
                  onClick={() => handleVoteComment(c, "down")}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 14,
                    color: c.downVotesBy.includes(user?.id) ? "red" : "#555",
                  }}
                >
                  <FaRegThumbsDown /> {c.downVotesBy?.length || 0}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="small-muted">Belum ada komentar.</div>
        )}
      </div>

      {/* 🔹 Form komentar */}
      {user ? (
        <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
          <label
            htmlFor="comment"
            style={{
              display: "block",
              marginBottom: 6,
              fontWeight: 500,
              color: "#333",
            }}
          >
            Tambahkan Komentar
          </label>
          <textarea
            id="comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tulis komentar kamu..."
            rows={4}
            required
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ccc",
              resize: "none",
              marginBottom: 10,
              outlineColor: "#4f46e5",
              background: "#f9fafb",
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#4f46e5",
              color: "#fff",
              padding: "8px 16px",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Kirim Komentar
          </button>
        </form>
      ) : (
        <p style={{ marginTop: 16, color: "#666" }}>
          🔒 Silakan login untuk memberikan komentar.
        </p>
      )}
    </div>
  );
}
