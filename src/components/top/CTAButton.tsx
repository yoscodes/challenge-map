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
    <div style={{ display: 'flex', justifyContent: 'center', margin: '32px 0' }}>
      <button
        style={{ fontSize: 20, padding: '16px 48px', borderRadius: 32, background: '#1890ff', color: '#fff', border: 'none', fontWeight: 'bold', boxShadow: '0 2px 8px rgba(24,144,255,0.15)' }}
        onClick={handleClick}
        disabled={loading}
      >
        ✅ 自分も挑戦を始める
      </button>
    </div>
  );
};

export default CTAButton; 