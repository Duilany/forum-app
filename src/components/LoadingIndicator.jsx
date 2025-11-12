import React from "react";

export default function LoadingIndicator() {
  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "4px solid #e5e7eb",
          borderTopColor: "#1f6feb",
          margin: "0 auto",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <div style={{ marginTop: 8, color: "#6b7280" }}>Loading...</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
