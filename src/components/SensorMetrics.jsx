import React from "react";
import { Activity, Heart, Moon, Zap } from "lucide-react";
import { getQualityLabel } from "../utils/sensorData";

const SensorMetrics = ({ sensorData }) => {
  if (!sensorData) return null;

  const { sleepStages, qualityScore, hrv, awakenings, restlessness } =
    sensorData;
  const qualityInfo = getQualityLabel(qualityScore);

  // Radial progress component
  const RadialProgress = ({ percentage, color, size = 80 }) => {
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(139, 92, 246, 0.1)"
          strokeWidth="6"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
    );
  };

  return (
    <div className="card fade-in" style={{ marginTop: "2rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            marginBottom: "0.25rem",
          }}
        >
          📊 Sleep Quality Metrics
        </h3>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--color-text-secondary)",
            margin: 0,
          }}
        >
          Detailed insights from sleep tracking sensors
        </p>
      </div>

      {/* Quality Score */}
      <div
        style={{
          background: "var(--gradient-card)",
          padding: "1.5rem",
          borderRadius: "var(--radius-lg)",
          border: `2px solid ${qualityInfo.color}33`,
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.5rem",
        }}
      >
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--color-text-secondary)",
              marginBottom: "0.5rem",
            }}
          >
            Overall Sleep Quality
          </p>
          <div
            style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}
          >
            <h2
              style={{
                fontSize: "3rem",
                fontWeight: 800,
                color: qualityInfo.color,
                margin: 0,
                lineHeight: 1,
              }}
            >
              {qualityScore}
            </h2>
            <span
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                color: qualityInfo.color,
              }}
            >
              {qualityInfo.label}
            </span>
          </div>
        </div>
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RadialProgress
            percentage={qualityScore}
            color={qualityInfo.color}
            size={100}
          />
          <Activity
            style={{
              position: "absolute",
              width: "2rem",
              height: "2rem",
              color: qualityInfo.color,
            }}
          />
        </div>
      </div>

      {/* Sleep Stages */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h4
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            marginBottom: "1rem",
            color: "var(--color-text-primary)",
          }}
        >
          Sleep Stages
        </h4>
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ gap: "1rem" }}
        >
          {[
            {
              label: "REM",
              value: sleepStages.rem,
              color: "#8b5cf6",
              icon: Zap,
            },
            {
              label: "Deep",
              value: sleepStages.deep,
              color: "#6366f1",
              icon: Moon,
            },
            {
              label: "Light",
              value: sleepStages.light,
              color: "#a78bfa",
              icon: Activity,
            },
            {
              label: "Awake",
              value: sleepStages.awake,
              color: "#f59e0b",
              icon: Activity,
            },
          ].map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.label}
                style={{
                  background: "var(--gradient-card)",
                  padding: "1rem",
                  borderRadius: "var(--radius-md)",
                  border: `1px solid ${stage.color}33`,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    marginBottom: "0.5rem",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Icon
                    style={{
                      width: "1.25rem",
                      height: "1.25rem",
                      color: stage.color,
                    }}
                  />
                </div>
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: stage.color,
                    margin: 0,
                  }}
                >
                  {stage.value}%
                </p>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--color-text-muted)",
                    marginTop: "0.25rem",
                  }}
                >
                  {stage.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "1rem" }}>
        <div
          style={{
            background: "var(--gradient-card)",
            padding: "1rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(139, 92, 246, 0.15)",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              background: "rgba(139, 92, 246, 0.15)",
              padding: "0.625rem",
              borderRadius: "var(--radius-md)",
              display: "flex",
            }}
          >
            <Heart
              style={{ width: "1.25rem", height: "1.25rem", color: "#8b5cf6" }}
            />
          </div>
          <div>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--color-text-muted)",
                margin: 0,
              }}
            >
              HRV
            </p>
            <p
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "var(--color-text-primary)",
                margin: 0,
              }}
            >
              {hrv} ms
            </p>
          </div>
        </div>

        <div
          style={{
            background: "var(--gradient-card)",
            padding: "1rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(139, 92, 246, 0.15)",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              background: "rgba(139, 92, 246, 0.15)",
              padding: "0.625rem",
              borderRadius: "var(--radius-md)",
              display: "flex",
            }}
          >
            <Activity
              style={{ width: "1.25rem", height: "1.25rem", color: "#8b5cf6" }}
            />
          </div>
          <div>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--color-text-muted)",
                margin: 0,
              }}
            >
              Awakenings
            </p>
            <p
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "var(--color-text-primary)",
                margin: 0,
              }}
            >
              {awakenings}
            </p>
          </div>
        </div>

        <div
          style={{
            background: "var(--gradient-card)",
            padding: "1rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(139, 92, 246, 0.15)",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              background: "rgba(139, 92, 246, 0.15)",
              padding: "0.625rem",
              borderRadius: "var(--radius-md)",
              display: "flex",
            }}
          >
            <Activity
              style={{ width: "1.25rem", height: "1.25rem", color: "#8b5cf6" }}
            />
          </div>
          <div>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--color-text-muted)",
                margin: 0,
              }}
            >
              Restlessness
            </p>
            <p
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "var(--color-text-primary)",
                margin: 0,
              }}
            >
              {restlessness.toFixed(1)}/h
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorMetrics;
