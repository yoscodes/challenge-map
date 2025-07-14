import React, { useState } from "react";
import { addApplause, removeApplause, ApplauseTargetType } from "@/lib/applause";
import { useAuth } from "@/contexts/AuthContext";

interface ApplauseButtonProps {
  targetType: ApplauseTargetType;
  targetId: string;
  initialCount: number;
  initialApplauded: boolean;
  onChange?: (applauded: boolean, count: number) => void;
}

const ApplauseButton: React.FC<ApplauseButtonProps> = ({
  targetType,
  targetId,
  initialCount,
  initialApplauded,
  onChange,
}) => {
  const { user } = useAuth();
  const [applauded, setApplauded] = useState(initialApplauded);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!user || loading || applauded) return; // 拍手済みなら何もしない
    setLoading(true);
    try {
      await addApplause(user.id, targetType, targetId);
      setApplauded(true);
      setCount((c) => c + 1);
      onChange?.(true, count + 1);
    } catch (e) {
      alert("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!user || loading || applauded}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 16px",
        background: applauded ? "#ffe58f" : "#f5f5f5",
        color: applauded ? "#d48806" : "#888",
        border: applauded ? "1.5px solid #ffd666" : "1px solid #ddd",
        borderRadius: 20,
        fontWeight: "bold",
        fontSize: 15,
        cursor: !user || loading || applauded ? "not-allowed" : "pointer",
        transition: "all 0.2s",
        minWidth: 64,
      }}
      title={user ? (applauded ? "拍手済み" : "拍手する") : "ログインが必要です"}
    >
      <span style={{ fontSize: 18 }}>{applauded ? "👏" : "🖐"}</span>
      <span>{count}</span>
      {applauded && <span style={{ marginLeft: 4, fontSize: 13 }}>拍手済み</span>}
    </button>
  );
};

export default ApplauseButton; 