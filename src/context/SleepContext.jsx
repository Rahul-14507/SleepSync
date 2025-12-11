import React, { createContext, useContext, useState, useEffect } from "react";
import { generateSensorData } from "../utils/sensorData";

const SleepContext = createContext();

export const useSleep = () => {
  const context = useContext(SleepContext);
  if (!context) {
    throw new Error("useSleep must be used within a SleepProvider");
  }
  return context;
};

export const SleepProvider = ({ children }) => {
  // Initialize from localStorage or empty array
  const [logs, setLogs] = useState(() => {
    try {
      const savedLogs = localStorage.getItem("sleepSync_logs");
      return savedLogs ? JSON.parse(savedLogs) : [];
    } catch (error) {
      console.error("Failed to load logs:", error);
      return [];
    }
  });

  // Save to localStorage whenever logs change
  useEffect(() => {
    try {
      localStorage.setItem("sleepSync_logs", JSON.stringify(logs));
    } catch (error) {
      console.error("Failed to save logs:", error);
    }
  }, [logs]);

  const addLog = (newLog) => {
    // Generate mock sensor data based on sleep duration
    const sensorData = generateSensorData(newLog.duration);

    setLogs((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...newLog,
        sensorData, // Add mock sensor data
      },
    ]);
  };

  const deleteLog = (id) => {
    setLogs((prev) => prev.filter((log) => log.id !== id));
  };

  return (
    <SleepContext.Provider value={{ logs, addLog, deleteLog }}>
      {children}
    </SleepContext.Provider>
  );
};
