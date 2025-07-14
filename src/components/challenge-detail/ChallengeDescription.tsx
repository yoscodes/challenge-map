import React from "react";

type ChallengeDescriptionProps = {
  description: string;
};

const ChallengeDescription = ({ description }: ChallengeDescriptionProps) => (
  <section>
    <div
      style={{
        background: "#f8f9fa",
        padding: 20,
        borderRadius: 8,
        border: "1px solid #e9ecef",
        lineHeight: 1.6,
        color: "#333",
      }}
    >
      {description}
    </div>
  </section>
);

export default ChallengeDescription;
