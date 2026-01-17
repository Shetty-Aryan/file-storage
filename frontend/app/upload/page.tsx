"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function UploadPage() {
  const { user, loading } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  async function handleUpload() {
    if (!file) {
      setStatus("Choose a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Uploading...");

      const res = await apiFetch("/backend/files/upload", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Upload failed");
      }

      setStatus("Upload successful ✅");
      router.push("/files");
    } catch (err: any) {
      setStatus(err.message || "Upload failed");
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div style={{ padding: 20 }}>
        <button onClick={() => router.push("/files")}>
          ← Back to Files
        </button>

        <h2>Upload File</h2>

        <input
          type="file"
          onChange={(e) =>
            setFile(e.target.files?.[0] || null)
          }
        />

        <br /><br />

        <button onClick={handleUpload}>
          Upload
        </button>

        <p>{status}</p>
      </div>
    </>
  );
}
