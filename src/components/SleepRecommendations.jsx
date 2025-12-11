import React, { useMemo } from "react";
import { useSleep } from "../context/SleepContext";
import { Lightbulb, Coffee, Moon, Activity, AlertCircle } from "lucide-react";
import { parseISO, differenceInHours } from "date-fns";

const SleepRecommendations = () => {
  const { logs } = useSleep();

  const recommendations = useMemo(() => {
    if (logs.length === 0) return [];

    const tips = [];

    // Calculate average sleep duration
    const avgDuration =
      logs.reduce((sum, log) => sum + log.duration, 0) / logs.length;

    // Check for insufficient sleep
    if (avgDuration < 7) {
      tips.push({
        icon: Moon,
        title: "Increase Sleep Duration",
        message: `Your average sleep is ${avgDuration.toFixed(
          1
        )}h. Aim for 7-9 hours for optimal health.`,
        type: "warning",
      });
    } else if (avgDuration >= 7 && avgDuration <= 9) {
      tips.push({
        icon: Activity,
        title: "Great Sleep Duration!",
        message: `You're averaging ${avgDuration.toFixed(
          1
        )}h of sleep - that's in the healthy range!`,
        type: "success",
      });
    }

    // Check sleep consistency (variance in wake times)
    if (logs.length >= 3) {
      const wakeTimes = logs.map(
        (log) =>
          new Date(log.wakeTime).getHours() +
          new Date(log.wakeTime).getMinutes() / 60
      );
      const avgWakeTime =
        wakeTimes.reduce((a, b) => a + b, 0) / wakeTimes.length;
      const variance =
        wakeTimes.reduce(
          (sum, time) => sum + Math.pow(time - avgWakeTime, 2),
          0
        ) / wakeTimes.length;

      if (variance > 2) {
        tips.push({
          icon: AlertCircle,
          title: "Irregular Wake Times",
          message:
            "Try waking up at the same time daily, even on weekends, to regulate your circadian rhythm.",
          type: "warning",
        });
      } else {
        tips.push({
          icon: Activity,
          title: "Consistent Sleep Schedule",
          message:
            "Your wake times are consistent - great for your body's internal clock!",
          type: "success",
        });
      }
    }

    // General sleep hygiene tips
    if (tips.length < 4) {
      const generalTips = [
        {
          icon: Coffee,
          title: "Limit Caffeine",
          message:
            "Avoid caffeine 6 hours before bedtime for better sleep quality.",
          type: "info",
        },
        {
          icon: Moon,
          title: "Dark Environment",
          message:
            "Keep your bedroom dark and cool (60-67°F) for optimal sleep.",
          type: "info",
        },
        {
          icon: Lightbulb,
          title: "Screen Time",
          message:
            "Reduce blue light exposure 1-2 hours before bed to help your brain prepare for sleep.",
          type: "info",
        },
      ];

      // Add general tips if we need more
      const needed = 4 - tips.length;
      tips.push(...generalTips.slice(0, needed));
    }

    return tips;
  }, [logs]);

  if (recommendations.length === 0) {
    return null;
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "success":
        return "#10b981";
      case "warning":
        return "#f59e0b";
      case "info":
      default:
        return "#8b5cf6";
    }
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
          💡 Sleep Hygiene Tips
        </h3>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--color-text-secondary)",
            margin: 0,
          }}
        >
          Personalized recommendations based on your sleep data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "1rem" }}>
        {recommendations.map((tip, index) => {
          const Icon = tip.icon;
          const color = getTypeColor(tip.type);

          return (
            <div
              key={index}
              className="slide-up"
              style={{
                padding: "1.25rem",
                background: "var(--gradient-card)",
                borderRadius: "var(--radius-lg)",
                border: `1px solid ${color}33`,
                display: "flex",
                gap: "1rem",
                alignItems: "flex-start",
                animationDelay: `${index * 0.1}s`,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${color}66`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${color}33`;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  background: `${color}22`,
                  padding: "0.625rem",
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon style={{ width: "1.25rem", height: "1.25rem", color }} />
              </div>
              <div style={{ flex: 1 }}>
                <h4
                  style={{
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    marginBottom: "0.375rem",
                    color: "var(--color-text-primary)",
                  }}
                >
                  {tip.title}
                </h4>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--color-text-secondary)",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {tip.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SleepRecommendations;
