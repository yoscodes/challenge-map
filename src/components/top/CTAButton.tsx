import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const CTAButton = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleClick = () => {
    if (loading) return;
    if (user) {
      router.push("/challenge/new");
    } else {
      router.push("/auth");
    }
  };

  return (
    <div
      style={{ display: "flex", justifyContent: "center", margin: "40px 0" }}
    >
      <button
        className="cta-button fade-in"
        style={{
          fontSize: 22,
          padding: "18px 56px",
          borderRadius: 40,
          fontWeight: 700,
          background: "linear-gradient(90deg,#2563eb,#60a5fa)",
          color: "#fff",
          border: "none",
          boxShadow: "0 4px 24px rgba(37,99,235,0.15)",
          letterSpacing: "0.04em",
          transition: "all 0.2s",
          cursor: "pointer",
        }}
        onClick={handleClick}
        disabled={loading}
      >
        ✅ 自分も挑戦を始める
      </button>
    </div>
  );
};

export default CTAButton;
