// Mock sensor data generator for sleep quality metrics
// Simulates wearable device data

export const generateSensorData = (duration) => {
  // Generate realistic sleep stage percentages
  // Total should roughly equal 100%

  // Base percentages (healthy sleep)
  let rem = 20 + Math.random() * 10; // 20-30%
  let deep = 15 + Math.random() * 10; // 15-25%
  let light = 50 + Math.random() * 10; // 50-60%
  let awake = 5 + Math.random() * 5; // 5-10%

  // Normalize to 100%
  const total = rem + deep + light + awake;
  rem = (rem / total) * 100;
  deep = (deep / total) * 100;
  light = (light / total) * 100;
  awake = (awake / total) * 100;

  // Sleep quality score (0-100)
  // Based on: good duration (7-9h), sufficient deep sleep, low awakenings
  let qualityScore = 70;

  if (duration >= 7 && duration <= 9) {
    qualityScore += 15;
  } else if (duration < 6) {
    qualityScore -= 20;
  }

  if (deep >= 20) {
    qualityScore += 10;
  }

  if (awake > 10) {
    qualityScore -= 15;
  }

  qualityScore = Math.max(
    0,
    Math.min(100, qualityScore + (Math.random() * 10 - 5))
  );

  // Heart rate variability (HRV) - higher is generally better
  // Typical range: 20-150ms
  const hrv = 40 + Math.random() * 60;

  // Awakenings count
  const awakenings = Math.floor(awake / 2) + Math.floor(Math.random() * 3);

  // Restlessness (movements per hour)
  const restlessness = 5 + Math.random() * 15;

  return {
    sleepStages: {
      rem: parseFloat(rem.toFixed(1)),
      deep: parseFloat(deep.toFixed(1)),
      light: parseFloat(light.toFixed(1)),
      awake: parseFloat(awake.toFixed(1)),
    },
    qualityScore: Math.round(qualityScore),
    hrv: Math.round(hrv),
    awakenings,
    restlessness: parseFloat(restlessness.toFixed(1)),
  };
};

export const getQualityLabel = (score) => {
  if (score >= 85) return { label: "Excellent", color: "#10b981" };
  if (score >= 70) return { label: "Good", color: "#8b5cf6" };
  if (score >= 50) return { label: "Fair", color: "#f59e0b" };
  return { label: "Poor", color: "#ef4444" };
};
