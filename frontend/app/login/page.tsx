"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

/* 🎨 UI STYLES (ADDED) */
const card = {
  maxWidth: 380,
  margin: "80px auto",
  padding: 24,
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  background: "#fff",
};

const input = {
  width: "100%",
  padding: "10px 12px",
  marginBottom: 14,
  borderRadius: 6,
  border: "1px solid #d1d5db",
  fontSize: 14,
};

const button = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 6,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

const linkBtn = {
  background: "none",
  border: "none",
  color: "#2563eb",
  cursor: "pointer",
  padding: 0,
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const router = useRouter();

  // ✅ Redirect if already logged in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/files");
      }
    });
    return () => unsub();
  }, [router]);

  async function handleLogin() {
    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const token = await userCred.user.getIdToken();
      localStorage.setItem("token", token);

      setStatus("Login successful ✅");
      router.push("/files");
    } catch (err: any) {
      setStatus(err.message);
    }
  }

  return (
    <div style={card}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>
        Login
      </h2>

      <input
        style={input}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        style={input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button style={button} onClick={handleLogin}>
        Login
      </button>

      {status && (
        <p style={{ marginTop: 12, textAlign: "center" }}>
          {status}
        </p>
      )}

      <p style={{ marginTop: 16, textAlign: "center" }}>
        Don’t have an account?{" "}
        <button
          style={linkBtn}
          onClick={() => router.push("/signup")}
        >
          Sign up
        </button>
      </p>
    </div>
  );
}