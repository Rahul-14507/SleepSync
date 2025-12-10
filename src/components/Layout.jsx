import React from "react";
import { Moon, Sparkles } from "lucide-react";

const Layout = ({ children }) => {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <header
        style={{
          borderBottom: "1px solid rgba(139, 92, 246, 0.2)",
          background: "rgba(15, 23, 41, 0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          className="container"
          style={{
            padding: "1.25rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
                padding: "0.625rem",
                borderRadius: "0.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(139, 92, 246, 0.3)",
              }}
            >
              <Moon
                style={{ width: "1.25rem", height: "1.25rem", color: "white" }}
              />
            </div>
            <div>
              <h1
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  background:
                    "linear-gradient(135deg, #f1f5f9 0%, #a78bfa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  margin: 0,
                }}
              >
                SleepSync
              </h1>
              <p style={{ fontSize: "0.75rem", color: "#64748b", margin: 0 }}>
                Track your sleep, improve your life
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Sparkles
              style={{ width: "1rem", height: "1rem", color: "#8b5cf6" }}
            />
            <span
              style={{
                fontSize: "0.875rem",
                color: "#94a3b8",
                fontWeight: 500,
              }}
            >
              Premium
            </span>
          </div>
        </div>
      </header>

      <main
        style={{ flex: 1, padding: "3rem 0" }}
        className="container fade-in"
      >
        {children}
      </main>

      <footer
        style={{
          borderTop: "1px solid rgba(139, 92, 246, 0.1)",
          padding: "2rem 0",
          marginTop: "4rem",
          background: "rgba(10, 14, 26, 0.8)",
        }}
      >
        <div
          className="container"
          style={{
            textAlign: "center",
            color: "#64748b",
            fontSize: "0.875rem",
          }}
        >
          <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} SleepSync. Better rest, better life.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
