import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useSleep } from "../context/SleepContext";
import { format, parseISO } from "date-fns";
import { BarChart3 } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SleepChart = () => {
  const { logs } = useSleep();

  const sortedLogs = [...logs]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-7);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 41, 0.95)",
        titleColor: "#f1f5f9",
        bodyColor: "#cbd5e1",
        borderColor: "rgba(139, 92, 246, 0.3)",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function (context) {
            return `${context.parsed.y} hours`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(139, 92, 246, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: "#94a3b8",
          font: {
            size: 12,
            weight: "500",
          },
          callback: function (value) {
            return value + "h";
          },
        },
        border: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#94a3b8",
          font: {
            size: 12,
            weight: "600",
          },
        },
        border: {
          display: false,
        },
      },
    },
  };

  const data = {
    labels: sortedLogs.map((log) => format(parseISO(log.date), "EEE")),
    datasets: [
      {
        label: "Sleep Duration",
        data: sortedLogs.map((log) => log.duration),
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, "#8b5cf6");
          gradient.addColorStop(1, "#6366f1");
          return gradient;
        },
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: "#7c3aed",
      },
    ],
  };

  if (logs.length === 0) {
    return (
      <div
        className="card fade-in"
        style={{
          minHeight: "20rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)",
            padding: "1.5rem",
            borderRadius: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <BarChart3
            style={{ width: "3rem", height: "3rem", color: "#a78bfa" }}
          />
        </div>
        <p
          style={{
            color: "#94a3b8",
            fontSize: "1rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
          }}
        >
          No sleep data yet
        </p>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0 }}>
          Log your first sleep to see beautiful patterns
        </p>
      </div>
    );
  }

  return (
    <div className="card fade-in" style={{ minHeight: "20rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            marginBottom: "0.25rem",
          }}
        >
          Weekly Overview
        </h3>
        <p style={{ fontSize: "0.875rem", color: "#94a3b8", margin: 0 }}>
          Last 7 sleep sessions
        </p>
      </div>
      <div style={{ height: "14rem", width: "100%" }}>
        <Bar options={options} data={data} />
      </div>
    </div>
  );
};

export default SleepChart;
