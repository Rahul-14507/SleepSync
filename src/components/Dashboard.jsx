import React, { useMemo } from "react";
import { useSleep } from "../context/SleepContext";
import SleepForm from "./SleepForm";
import SleepChart from "./SleepChart";
import StatsCard from "./StatsCard";
import SleepRecommendations from "./SleepRecommendations";
import SensorMetrics from "./SensorMetrics";
import SleepSummary from "./SleepSummary";
import { Clock, TrendingUp, Activity, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";

const Dashboard = () => {
  const { logs, deleteLog } = useSleep();

  const stats = useMemo(() => {
    if (logs.length === 0)
      return { avgDuration: 0, totalEntries: 0, consistency: "N/A" };

    const totalDuration = logs.reduce((acc, log) => acc + log.duration, 0);
    const avgDuration = (totalDuration / logs.length).toFixed(1);

    const consistency = logs.length > 3 ? "Good" : "Building...";

    return {
      avgDuration,
      totalEntries: logs.length,
      consistency,
    };
  }, [logs]);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div
        className="fade-in"
        style={{ textAlign: "center", marginBottom: "3rem" }}
      >
        <h2
          style={{
            fontSize: "2.5rem",
            fontWeight: 800,
            marginBottom: "1rem",
            background: "linear-gradient(135deg, #f1f5f9 0%, #a78bfa 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.02em",
          }}
        >
          Your Sleep Dashboard
        </h2>
        <p
          style={{
            fontSize: "1.125rem",
            color: "#94a3b8",
            maxWidth: "36rem",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Track your sleep patterns, visualize trends, and optimize your rest
          for better wellness.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 fade-in">
        <StatsCard
          title="Avg. Sleep"
          value={`${stats.avgDuration}h`}
          subtext="Per night"
          icon={Clock}
        />
        <StatsCard
          title="Consistency"
          value={stats.consistency}
          subtext="Sleep pattern"
          icon={Activity}
        />
        <StatsCard
          title="Total Logs"
          value={stats.totalEntries}
          subtext="Entries tracked"
          icon={TrendingUp}
        />
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2"
        style={{ gap: "2rem", alignItems: "start" }}
      >
        {/* Visualizations Column */}
        <div className="space-y-8">
          <SleepChart />

          {/* Recent History List */}
          <div className="card fade-in">
            <div style={{ marginBottom: "1.5rem" }}>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  marginBottom: "0.25rem",
                }}
              >
                Recent History
              </h3>
              <p style={{ fontSize: "0.875rem", color: "#94a3b8", margin: 0 }}>
                Your latest sleep logs
              </p>
            </div>
            <div className="space-y-4">
              {logs.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "3rem 1rem",
                    color: "#64748b",
                  }}
                >
                  <p style={{ fontSize: "0.875rem", margin: 0 }}>
                    No sleep logs yet.
                  </p>
                  <p style={{ fontSize: "0.75rem", marginTop: "0.5rem" }}>
                    Start tracking to see your history.
                  </p>
                </div>
              ) : (
                [...logs]
                  .reverse()
                  .slice(0, 5)
                  .map((log, index) => (
                    <div
                      key={log.id}
                      className="slide-up"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "1rem 1.25rem",
                        background:
                          "linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)",
                        borderRadius: "0.75rem",
                        border: "1px solid rgba(139, 92, 246, 0.15)",
                        transition: "all 0.2s ease",
                        animationDelay: `${index * 0.1}s`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(139, 92, 246, 0.3)";
                        e.currentTarget.style.transform = "translateX(4px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(139, 92, 246, 0.15)";
                        e.currentTarget.style.transform = "translateX(0)";
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontWeight: 600,
                            color: "white",
                            marginBottom: "0.25rem",
                            fontSize: "0.9375rem",
                          }}
                        >
                          {format(parseISO(log.date), "MMM do, yyyy")}
                        </p>
                        <p
                          style={{
                            fontSize: "0.8125rem",
                            color: "#94a3b8",
                            margin: 0,
                          }}
                        >
                          {format(parseISO(log.sleepTime), "hh:mm a")} →{" "}
                          {format(parseISO(log.wakeTime), "hh:mm a")}
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "1.25rem",
                            fontWeight: 700,
                            color: "#a78bfa",
                            minWidth: "3rem",
                            textAlign: "right",
                          }}
                        >
                          {log.duration}h
                        </span>
                        <button
                          onClick={() => deleteLog(log.id)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#64748b",
                            cursor: "pointer",
                            padding: "0.5rem",
                            borderRadius: "0.5rem",
                            transition: "all 0.2s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "rgba(239, 68, 68, 0.1)";
                            e.currentTarget.style.color = "#ef4444";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "#64748b";
                          }}
                        >
                          <Trash2 style={{ width: "1rem", height: "1rem" }} />
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>

        {/* Input Column */}
        <div>
          <SleepForm />
        </div>
      </div>

      {/* Sleep Recommendations */}
      <SleepRecommendations />

      {/* Sensor Metrics - Show only for latest entry */}
      {logs.length > 0 && logs[logs.length - 1].sensorData && (
        <SensorMetrics sensorData={logs[logs.length - 1].sensorData} />
      )}

      {/* Weekly/Monthly Summary */}
      <SleepSummary />
    </div>
  );
};

export default Dashboard;
