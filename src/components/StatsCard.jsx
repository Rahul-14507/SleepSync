import React from "react";

const StatsCard = ({ title, value, subtext, icon: Icon }) => {
  return (
    <div
      className="card slide-up"
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        background:
          "linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)",
        position: "relative",
      }}
    >
      <div style={{ flex: 1 }}>
        <p
          style={{
            color: "#94a3b8",
            fontSize: "0.8125rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {title}
        </p>
        <h4
          style={{
            fontSize: "2.25rem",
            fontWeight: 800,
            color: "white",
            marginBottom: "0.25rem",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          {value}
        </h4>
        {subtext && (
          <p style={{ fontSize: "0.75rem", color: "#64748b", margin: 0 }}>
            {subtext}
          </p>
        )}
      </div>
      {Icon && (
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)",
            padding: "0.75rem",
            borderRadius: "0.75rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(139, 92, 246, 0.3)",
          }}
        >
          <Icon
            style={{ width: "1.5rem", height: "1.5rem", color: "#a78bfa" }}
          />
        </div>
      )}
    </div>
  );
};

export default StatsCard;
