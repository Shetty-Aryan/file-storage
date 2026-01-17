"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user);
    });
    return () => unsub();
  }, []);

  async function logout() {
    await signOut(auth);
    localStorage.removeItem("token");
    router.replace("/login");
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.left} onClick={() => router.push("/")}>
        🔐 SecureVault
      </div>

      <div style={styles.right}>
        {loggedIn && (
          <>
            <NavButton
              active={pathname === "/files"}
              onClick={() => router.push("/files")}
            >
              Files
            </NavButton>

            <NavButton
              active={pathname === "/upload"}
              onClick={() => router.push("/upload")}
            >
              Upload
            </NavButton>

            <NavButton danger onClick={logout}>
              Logout
            </NavButton>
          </>
        )}

        {!loggedIn && (
          <>
            <NavButton
              active={pathname === "/login"}
              onClick={() => router.push("/login")}
            >
              Login
            </NavButton>

            <NavButton
              active={pathname === "/signup"}
              onClick={() => router.push("/signup")}
            >
              Sign up
            </NavButton>
          </>
        )}
      </div>
    </nav>
  );
}

/* ---------- SMALL COMPONENT ---------- */

function NavButton({
  children,
  onClick,
  active,
  danger
}: any) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.button,
        ...(active ? styles.active : {}),
        ...(danger ? styles.danger : {})
      }}
    >
      {children}
    </button>
  );
}

/* ---------- STYLES ---------- */

const styles = {
  nav: {
    height: 60,
    padding: "0 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #e5e7eb",
    background: "#fff",
    position: "sticky" as const,
    top: 0,
    zIndex: 10
  },
  left: {
    fontWeight: 700,
    fontSize: 18,
    cursor: "pointer"
  },
  right: {
    display: "flex",
    gap: 10
  },
  button: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "1px solid #ddd",
    background: "#f9fafb",
    cursor: "pointer",
    fontWeight: 500
  },
  active: {
    background: "#2563eb",
    color: "#fff",
    borderColor: "#2563eb"
  },
  danger: {
    background: "#fee2e2",
    borderColor: "#fecaca",
    color: "#991b1b"
  }
};
