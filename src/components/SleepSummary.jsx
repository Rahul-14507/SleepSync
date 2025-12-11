import React, { useState, useMemo } from "react";
import { useSleep } from "../context/SleepContext";
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Download,
  Award,
} from "lucide-react";
import {
  format,
  parseISO,
  startOfWeek,
  startOfMonth,
  endOfWeek,
  endOfMonth,
  isWithinInterval,
} from "date-fns";

const SleepSummary = ({ initialPeriod = "weekly" }) => {
  const { logs } = useSleep();
  const [period, setPeriod] = useState(initialPeriod); // 'weekly' or 'monthly'

  const summary = useMemo(() => {
    if (logs.length === 0) return null;

    const now = new Date();
    const periodStart =
      period === "weekly" ? startOfWeek(now) : startOfMonth(now);
    const periodEnd = period === "weekly" ? endOfWeek(now) : endOfMonth(now);

    // Filter logs for current period
    const periodLogs = logs.filter((log) => {
      const logDate = parseISO(log.date);
      return isWithinInterval(logDate, { start: periodStart, end: periodEnd });
    });

    if (periodLogs.length === 0) return null;

    // Calculate statistics
    const avgDuration =
      periodLogs.reduce((sum, log) => sum + log.duration, 0) /
      periodLogs.length;
    const avgQuality =
      periodLogs
        .filter((log) => log.sensorData)
        .reduce((sum, log) => sum + (log.sensorData?.qualityScore || 0), 0) /
        periodLogs.filter((log) => log.sensorData).length || 0;

    // Find best and worst nights
    const sortedByDuration = [...periodLogs].sort(
      (a, b) => b.duration - a.duration
    );
    const bestNight = sortedByDuration[0];
    const worstNight = sortedByDuration[sortedByDuration.length - 1];

    // Calculate trend (compare to previous period)
    const prevPeriodStart =
      period === "weekly"
        ? new Date(periodStart.getTime() - 7 * 24 * 60 * 60 * 1000)
        : new Date(periodStart.getFullYear(), periodStart.getMonth() - 1, 1);
    const prevPeriodEnd =
      period === "weekly"
        ? new Date(periodEnd.getTime() - 7 * 24 * 60 * 60 * 1000)
        : new Date(periodStart.getFullYear(), periodStart.getMonth(), 0);

    const prevPeriodLogs = logs.filter((log) => {
      const logDate = parseISO(log.date);
      return isWithinInterval(logDate, {
        start: prevPeriodStart,
        end: prevPeriodEnd,
      });
    });

    const prevAvgDuration =
      prevPeriodLogs.length > 0
        ? prevPeriodLogs.reduce((sum, log) => sum + log.duration, 0) /
          prevPeriodLogs.length
        : avgDuration;

    const trend = avgDuration - prevAvgDuration;

    return {
      periodLogs,
      avgDuration,
      avgQuality,
      bestNight,
      worstNight,
      trend,
      totalNights: periodLogs.length,
    };
  }, [logs, period]);

  const handleExport = () => {
    if (!summary) return;

    const data = {
      period: period === "weekly" ? "Weekly" : "Monthly",
      date: format(new Date(), "MMM do, yyyy"),
      avgDuration: `${summary.avgDuration.toFixed(1)} hours`,
      avgQuality: `${Math.round(summary.avgQuality)}`,
      totalNights: summary.totalNights,
      bestNight: {
        date: format(parseISO(summary.bestNight.date), "MMM do"),
        duration: `${summary.bestNight.duration}h`,
      },
      worstNight: {
        date: format(parseISO(summary.worstNight.date), "MMM do"),
        duration: `${summary.worstNight.duration}h`,
      },
      trend:
        summary.trend > 0
          ? `+${summary.trend.toFixed(1)}h`
          : `${summary.trend.toFixed(1)}h`,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sleepsync-${period}-summary-${format(
      new Date(),
      "yyyy-MM-dd"
    )}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!summary) {
    return (
      <div
        className="card fade-in"
        style={{ marginTop: "2rem", textAlign: "center", padding: "3rem 2rem" }}
      >
        <Calendar
          style={{
            width: "3rem",
            height: "3rem",
            color: "var(--color-text-muted)",
            margin: "0 auto 1rem",
          }}
        />
        <p style={{ color: "var(--color-text-secondary)", margin: 0 }}>
          No data available for this {period === "weekly" ? "week" : "month"}
        </p>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--color-text-muted)",
            marginTop: "0.5rem",
          }}
        >
          Start logging your sleep to see summaries
        </p>
      </div>
    );
  }

  return (
    <div className="card fade-in" style={{ marginTop: "2rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              marginBottom: "0.25rem",
            }}
          >
            📅 Sleep Summary
          </h3>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--color-text-secondary)",
              margin: 0,
            }}
          >
            Your {period} sleep insights
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => setPeriod("weekly")}
            className="btn-ghost"
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              background:
                period === "weekly"
                  ? "rgba(139, 92, 246, 0.2)"
                  : "rgba(139, 92, 246, 0.1)",
              borderColor:
                period === "weekly"
                  ? "rgba(139, 92, 246, 0.4)"
                  : "rgba(139, 92, 246, 0.2)",
            }}
          >
            Weekly
          </button>
          <button
            onClick={() => setPeriod("monthly")}
            className="btn-ghost"
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              background:
                period === "monthly"
                  ? "rgba(139, 92, 246, 0.2)"
                  : "rgba(139, 92, 246, 0.1)",
              borderColor:
                period === "monthly"
                  ? "rgba(139, 92, 246, 0.4)"
                  : "rgba(139, 92, 246, 0.2)",
            }}
          >
            Monthly
          </button>
          <button
            onClick={handleExport}
            className="btn-ghost"
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Download style={{ width: "1rem", height: "1rem" }} />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2"
        style={{ gap: "1rem", marginBottom: "1.5rem" }}
      >
        <div
          style={{
            background: "var(--gradient-card)",
            padding: "1.5rem",
            borderRadius: "var(--radius-lg)",
            border: "1px solid rgba(139, 92, 246, 0.15)",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--color-text-secondary)",
              marginBottom: "0.5rem",
            }}
          >
            Average Sleep Duration
          </p>
          <div
            style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}
          >
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: 800,
                color: "var(--color-accent)",
                margin: 0,
              }}
            >
              {summary.avgDuration.toFixed(1)}
            </h2>
            <span
              style={{ fontSize: "1rem", color: "var(--color-text-secondary)" }}
            >
              hours
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginTop: "0.5rem",
            }}
          >
            {summary.trend > 0 ? (
              <>
                <TrendingUp
                  style={{ width: "1rem", height: "1rem", color: "#10b981" }}
                />
                <span style={{ fontSize: "0.875rem", color: "#10b981" }}>
                  +{summary.trend.toFixed(1)}h from last{" "}
                  {period === "weekly" ? "week" : "month"}
                </span>
              </>
            ) : summary.trend < 0 ? (
              <>
                <TrendingDown
                  style={{ width: "1rem", height: "1rem", color: "#ef4444" }}
                />
                <span style={{ fontSize: "0.875rem", color: "#ef4444" }}>
                  {summary.trend.toFixed(1)}h from last{" "}
                  {period === "weekly" ? "week" : "month"}
                </span>
              </>
            ) : (
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "var(--color-text-muted)",
                }}
              >
                No change from last {period === "weekly" ? "week" : "month"}
              </span>
            )}
          </div>
        </div>

        <div
          style={{
            background: "var(--gradient-card)",
            padding: "1.5rem",
            borderRadius: "var(--radius-lg)",
            border: "1px solid rgba(139, 92, 246, 0.15)",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--color-text-secondary)",
              marginBottom: "0.5rem",
            }}
          >
            Average Quality Score
          </p>
          <div
            style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}
          >
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: 800,
                color: "var(--color-accent)",
                margin: 0,
              }}
            >
              {Math.round(summary.avgQuality) || "N/A"}
            </h2>
            <span
              style={{ fontSize: "1rem", color: "var(--color-text-secondary)" }}
            >
              / 100
            </span>
          </div>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--color-text-muted)",
              marginTop: "0.5rem",
            }}
          >
            Based on {summary.totalNights} nights of data
          </p>
        </div>
      </div>

      {/* Best/Worst Nights */}
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "1rem" }}>
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%)",
            padding: "1.25rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "0.75rem",
            }}
          >
            <Award
              style={{ width: "1.25rem", height: "1.25rem", color: "#10b981" }}
            />
            <h4
              style={{
                fontSize: "0.9375rem",
                fontWeight: 600,
                color: "var(--color-text-primary)",
                margin: 0,
              }}
            >
              Best Sleep
            </h4>
          </div>
          <p
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#10b981",
              margin: 0,
            }}
          >
            {summary.bestNight.duration}h
          </p>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--color-text-secondary)",
              marginTop: "0.25rem",
            }}
          >
            {format(parseISO(summary.bestNight.date), "EEEE, MMM do")}
          </p>
        </div>

        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.02) 100%)",
            padding: "1.25rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "0.75rem",
            }}
          >
            <TrendingDown
              style={{ width: "1.25rem", height: "1.25rem", color: "#ef4444" }}
            />
            <h4
              style={{
                fontSize: "0.9375rem",
                fontWeight: 600,
                color: "var(--color-text-primary)",
                margin: 0,
              }}
            >
              Needs Improvement
            </h4>
          </div>
          <p
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#ef4444",
              margin: 0,
            }}
          >
            {summary.worstNight.duration}h
          </p>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--color-text-secondary)",
              marginTop: "0.25rem",
            }}
          >
            {format(parseISO(summary.worstNight.date), "EEEE, MMM do")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SleepSummary;
