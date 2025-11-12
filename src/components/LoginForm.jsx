import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const dispatch = useDispatch();
  const { status, error } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (result.type === "auth/login/fulfilled") {
      navigate("/");
    } else {
      alert(result.payload || result.error?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Login ke Forum App
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full btn btn-primary justify-center mt-2"
          >
            {status === "loading" ? "Sedang masuk..." : "Login"}
          </button>

          {error && (
            <p className="text-red-600 text-sm text-center mt-2">{error}</p>
          )}
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Belum punya akun?{" "}
          <a
            href="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Daftar di sini
          </a>
        </p>
      </div>
    </div>
  );
}
