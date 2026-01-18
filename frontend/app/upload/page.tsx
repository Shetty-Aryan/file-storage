"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

/* 🎨 UI STYLES */
const card = {
  maxWidth: 420,
  margin: "60px auto",
  padding: 24,
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  background: "#fff",
};

const button = {
  padding: "10px 14px",
  borderRadius: 6,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

const backBtn = {
  background: "none",
  border: "none",
  color: "#2563eb",
  cursor: "pointer",
  marginBottom: 12,
  padding: 0,
};

const fileInput = {
  width: "100%",
  padding: 10,
  border: "1px dashed #cbd5f5",
  borderRadius: 8,
  marginBottom: 16,
};

export default function UploadPage() {
  const { user, loading } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const router = useRouter();

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  async function handleUpload() {
    if (!user || !file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Uploading...");
      const res = await apiFetch("/files/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setStatus(`Uploaded ✅ (${file.name})`);
      setFile(null);
    } catch (err: any) {
      setStatus(err.message);
    }
  }

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading auth...</p>;
  }

  return (
    <>
      <Navbar />

      <div style={card}>
        <button style={backBtn} onClick={() => router.push("/files")}>
          ← Back to Files
        </button>

        <h2 style={{ marginBottom: 20 }}>Upload File</h2>

        <input
          style={fileInput}
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button
          style={{
            ...button,
            width: "100%",
            opacity: !file ? 0.6 : 1,
          }}
          disabled={!file}
          onClick={handleUpload}
        >
          Upload
        </button>

        {status && (
          <p style={{ marginTop: 14, textAlign: "center" }}>
            {status}
          </p>
        )}
      </div>
    </>
  );
}