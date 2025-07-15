import React, { useState } from "react";
import { addApplause, ApplauseTargetType } from "@/lib/applause";
import { useAuth } from "@/contexts/AuthContext";

interface LikeButtonProps {
  targetType: ApplauseTargetType;
  targetId: string;
  initialCount: number;
  initialLiked: boolean;
  onChange?: (liked: boolean, count: number) => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  targetType,
  targetId,
  initialCount,
  initialLiked,
  onChange,
}) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!user || loading || liked) return; // 既にいいね済みなら何もしない
    setLoading(true);
    try {
      await addApplause(user.id, targetType, targetId); // applauseテーブルを流用
      setLiked(true);
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
      disabled={!user || loading || liked}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 16px",
        background: liked ? "#ffe6ef" : "#f5f5f5",
        color: liked ? "#d72660" : "#888",
        border: liked ? "1.5px solid #ffb3c6" : "1px solid #ddd",
        borderRadius: 20,
        fontWeight: "bold",
        fontSize: 15,
        cursor: !user || loading || liked ? "not-allowed" : "pointer",
        transition: "all 0.2s",
        minWidth: 64,
      }}
      title={user ? (liked ? "いいね済み" : "いいねする") : "ログインが必要です"}
    >
      <span style={{ fontSize: 18 }}>{liked ? "❤️" : "🤍"}</span>
      <span>{count}</span>
      {liked && <span style={{ marginLeft: 4, fontSize: 13 }}>いいね済み</span>}
    </button>
  );
};

export default LikeButton; 