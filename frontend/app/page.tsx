"use client";

import { useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  const router = useRouter();

  // 🔁 Redirect logged-in users
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/files");
      }
    });
    return () => unsub();
  }, [router]);

  return (
    <>
      <Navbar />

      <main style={styles.main}>
        <div style={styles.card}>
          <h1 style={styles.title}>SecureVault</h1>
          <p style={styles.subtitle}>
            Upload, encrypt, and manage your files securely.
          </p>

          <div style={styles.actions}>
            <button
              style={styles.primary}
              onClick={() => router.push("/signup")}
            >
              Get Started
            </button>

            <button
              style={styles.secondary}
              onClick={() => router.push("/login")}
            >
              Login
            </button>
          </div>

          <ul style={styles.features}>
            <li>🔒 End-to-end encrypted storage</li>
            <li>📁 Private per-user files</li>
            <li>⬇ Secure downloads</li>
            <li>🗑 Full control (delete anytime)</li>
          </ul>
        </div>
      </main>
    </>
  );
}

/* ---------- STYLES ---------- */

const styles = {
  main: {
    minHeight: "calc(100vh - 60px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    background: "#f9fafb"
  },
  card: {
    maxWidth: 420,
    padding: 32,
    borderRadius: 12,
    background: "#fff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    textAlign: "center" as const
  },
  title: {
    fontSize: 28,
    marginBottom: 8
  },
  subtitle: {
    color: "#555",
    marginBottom: 24
  },
  actions: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
    marginBottom: 20
  },
  primary: {
    padding: "10px 16px",
    borderRadius: 8,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer"
  },
  secondary: {
    padding: "10px 16px",
    borderRadius: 8,
    border: "1px solid #ddd",
    background: "#fff",
    fontWeight: 600,
    cursor: "pointer"
  },
  features: {
    textAlign: "left" as const,
    marginTop: 20,
    color: "#444",
    lineHeight: 1.8
  }
};
