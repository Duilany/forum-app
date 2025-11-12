import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeaderboard } from "../features/threads/threadsSlice";

export default function LeaderboardPage() {
  const dispatch = useDispatch();
  const { leaderboard, loading } = useSelector((s) => s.threads);

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  if (loading) return <div className="card">Loading...</div>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">🏆 Leaderboard</h2>

      <div className="card">
        {leaderboard && leaderboard.length > 0 ? (
          leaderboard.map((item, idx) => {
            const { user, score } = item;
            const name = user?.name || "Unknown User";
            const avatar = user?.avatar || null;

            return (
              <div
                key={user?.id || idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom:
                    idx < leaderboard.length - 1 ? "1px solid #e5e7eb" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={name}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "#e5e7eb",
                      }}
                    ></div>
                  )}
                  <div>
                    <strong>{name}</strong>
                    <div className="small-muted">{user?.email}</div>
                  </div>
                </div>

                <div
                  style={{
                    fontWeight: 700,
                    color: "#2563eb",
                    minWidth: 40,
                    textAlign: "right",
                  }}
                >
                  {score}
                </div>
              </div>
            );
          })
        ) : (
          <div className="small-muted">No leaderboard data.</div>
        )}
      </div>
    </div>
  );
}
