import React, { useState } from "react";
import { useSleep } from "../context/SleepContext";
import { Moon, Sun, Plus, Sparkles } from "lucide-react";
import { differenceInMinutes, format } from "date-fns";

const SleepForm = () => {
  const { addLog } = useSleep();
  const [sleepTime, setSleepTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sleepTime || !wakeTime || !date) return;

    const sleepDate = new Date(`${date}T${sleepTime}`);
    let wakeDate = new Date(`${date}T${wakeTime}`);

    if (wakeDate < sleepDate) {
      wakeDate.setDate(wakeDate.getDate() + 1);
    }

    const durationMinutes = differenceInMinutes(wakeDate, sleepDate);
    const durationHours = (durationMinutes / 60).toFixed(1);

    addLog({
      sleepTime: sleepDate.toISOString(),
      wakeTime: wakeDate.toISOString(),
      duration: parseFloat(durationHours),
      date: date,
    });

    setSleepTime("");
    setWakeTime("");
  };

  return (
    <div
      className="card fade-in"
      style={{
        maxWidth: "32rem",
        margin: "0 auto",
        background:
          "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              marginBottom: "0.25rem",
            }}
          >
            Log Sleep
          </h3>
          <p style={{ fontSize: "0.875rem", color: "#94a3b8", margin: 0 }}>
            Track your nightly rest
          </p>
        </div>
        <div
          style={{
            background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
            padding: "0.5rem",
            borderRadius: "0.75rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Sparkles
            style={{ width: "1.25rem", height: "1.25rem", color: "white" }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#cbd5e1",
              marginBottom: "0.5rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2" style={{ gap: "1rem" }}>
          <div>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#cbd5e1",
                marginBottom: "0.5rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              <Moon style={{ width: "0.875rem", height: "0.875rem" }} /> Bedtime
            </label>
            <input
              type="time"
              value={sleepTime}
              onChange={(e) => setSleepTime(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#cbd5e1",
                marginBottom: "0.5rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              <Sun style={{ width: "0.875rem", height: "0.875rem" }} /> Wake Up
            </label>
            <input
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!sleepTime || !wakeTime}
          className="btn btn-primary"
          style={{
            width: "100%",
            marginTop: "1.5rem",
            opacity: !sleepTime || !wakeTime ? 0.5 : 1,
            cursor: !sleepTime || !wakeTime ? "not-allowed" : "pointer",
          }}
        >
          <Plus
            style={{
              width: "1.125rem",
              height: "1.125rem",
              marginRight: "0.5rem",
            }}
          />
          Add Sleep Entry
        </button>
      </form>
    </div>
  );
};

export default SleepForm;
