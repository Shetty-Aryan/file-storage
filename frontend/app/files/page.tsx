"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import styles from "./files.module.css";
import Navbar from "@/components/Navbar";

type FileItem = {
  fileId: string;
  name: string;
  mimeType: string;
  size: number;
  createdAt: any;
};


export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  /* 🔐 AUTH + FETCH */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      try {
        const token = await user.getIdToken();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/files/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error("Failed to fetch files");

        const data = await res.json();
        setFiles(data.files || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  /* ⬇ DOWNLOAD */
  const downloadFile = async (fileId: string, name: string) => {
    const token = await auth.currentUser!.getIdToken();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/files/download/${fileId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) return alert("Download failed");

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* 🗑 DELETE */
  const deleteFile = async (fileId: string) => {
    const token = await auth.currentUser!.getIdToken();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/files/${fileId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) return alert("Delete failed");

    setFiles((prev) => prev.filter((f) => f.fileId !== fileId));
  };

  /* 🚪 LOGOUT */
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    router.replace("/login");
  };

  if (loading) return <p className={styles.loading}>Loading files...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <>
      <Navbar />

      <div className={styles.container}>
        {/* 🔝 ACTION BAR */}
        <div className={styles.topBar}>
          <h2 className={styles.title}>Your Files</h2>

          <div className={styles.actionsBar}>
            <button
              className={styles.primary}
              onClick={() => router.push("/upload")}
            >
              ➕ Upload
            </button>

            <button
              className={styles.secondary}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        {/* 🖥 DESKTOP TABLE */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Size</th>
                
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((f) => (
                <tr key={f.fileId}>
                  <td>{f.name}</td>
                  <td>{f.mimeType}</td>
                  <td>{(f.size / 1024).toFixed(1)} KB</td>
                  

                  <td className={styles.rowActions}>
                    <button
                      onClick={() => downloadFile(f.fileId, f.name)}
                    >
                      ⬇
                    </button>
                    <button
                      onClick={() => deleteFile(f.fileId)}
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 📱 MOBILE CARDS */}
        <div className={styles.cards}>
          {files.map((f) => (
            <div key={f.fileId} className={styles.card}>
              <div className={styles.cardName}>{f.name}</div>

              


              <div className={styles.actions}>
                <button
                  className={`${styles.button} ${styles.download}`}
                  onClick={() => downloadFile(f.fileId, f.name)}
                >
                  Download
                </button>

                <button
                  className={`${styles.button} ${styles.delete}`}
                  onClick={() => deleteFile(f.fileId)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {files.length === 0 && (
          <p className={styles.empty}>
            No files uploaded yet.
          </p>
        )}
      </div>
    </>
  );
}