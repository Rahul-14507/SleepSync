// --- 1. STATE MANAGEMENT ---
const state = {
  logs: JSON.parse(localStorage.getItem("sleepLogs") || "[]"),
  theme: localStorage.getItem("theme") || "dark", // 'dark' or 'light'
  activeTab: "dashboard",
};

// --- 2. UTILITY FUNCTIONS ---

// Mock Sensor Data Generator (ported from src/utils/sensorData.js)
const generateSensorData = (duration) => {
  let rem = 20 + Math.random() * 10;
  let deep = 15 + Math.random() * 10;
  let light = 50 + Math.random() * 10;
  let awake = 5 + Math.random() * 5;

  const total = rem + deep + light + awake;
  rem = (rem / total) * 100;
  deep = (deep / total) * 100;
  light = (light / total) * 100;
  awake = (awake / total) * 100;

  let qualityScore = 70;
  if (duration >= 7 && duration <= 9) qualityScore += 15;
  else if (duration < 6) qualityScore -= 20;
  if (deep >= 20) qualityScore += 10;
  if (awake > 10) qualityScore -= 15;

  qualityScore = Math.max(
    0,
    Math.min(100, qualityScore + (Math.random() * 10 - 5))
  );
  const hrv = 40 + Math.random() * 60;
  const awakenings = Math.floor(awake / 2) + Math.floor(Math.random() * 3);
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

const getQualityLabel = (score) => {
  if (score >= 85) return { label: "Excellent", color: "#10b981" };
  if (score >= 70) return { label: "Good", color: "#8b5cf6" };
  if (score >= 50) return { label: "Fair", color: "#f59e0b" };
  return { label: "Poor", color: "#ef4444" };
};

// Date Helpers (using global dateFns from CDN)
const {
  format,
  parseISO,
  differenceInMinutes,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} = dateFns;

// --- 3. DOM ELEMENTS ---
const elements = {
  themeToggle: document.getElementById("theme-toggle"),
  themeIcon: document.getElementById("theme-icon"),
  navTabs: document.querySelectorAll(".nav-tab"),
  views: {
    dashboard: document.getElementById("view-dashboard"),
    weekly: document.getElementById("view-weekly"),
    monthly: document.getElementById("view-monthly"),
  },
  stats: {
    avgSleep: document.getElementById("stat-avg-sleep"),
    consistency: document.getElementById("stat-consistency"),
    totalLogs: document.getElementById("stat-total-logs"),
  },
  charts: {
    canvas: document.getElementById("sleepChart"),
    container:
      document.getElementById("chart-empty-state").previousElementSibling,
    emptyState: document.getElementById("chart-empty-state"),
  },
  history: {
    list: document.getElementById("history-list"),
    empty: document.getElementById("history-empty"),
  },
  form: {
    el: document.getElementById("sleep-form"),
    date: document.getElementById("entry-date"),
    bedtime: document.getElementById("entry-bedtime"),
    waketime: document.getElementById("entry-waketime"),
    btn: document.getElementById("add-entry-btn"),
  },
  recommendations: {
    container: document.getElementById("recommendations-container"),
    list: document.getElementById("recommendations-list"),
  },
  sensorMetrics: document.getElementById("sensor-metrics-container"),
};

// --- 4. LOGIC & RENDERING ---

// Theme Logic
const applyTheme = () => {
  document.documentElement.setAttribute("data-theme", state.theme);
  // Update icon
  if (elements.themeIcon) {
    elements.themeIcon.setAttribute(
      "data-lucide",
      state.theme === "dark" ? "sun" : "moon"
    );
    lucide.createIcons();
  }
};

const toggleTheme = () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", state.theme);
  applyTheme();
};

// Chart Instance
let sleepChartInstance = null;

const renderChart = () => {
  if (state.logs.length === 0) {
    elements.charts.canvas.style.display = "none";
    elements.charts.emptyState.classList.remove("hidden");
    elements.charts.emptyState.style.display = "flex";
    return;
  }

  elements.charts.canvas.style.display = "block";
  elements.charts.emptyState.classList.add("hidden");
  elements.charts.emptyState.style.display = "none";

  const sortedLogs = [...state.logs]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-7);

  const labels = sortedLogs.map((log) => format(parseISO(log.date), "EEE"));
  const dataPoints = sortedLogs.map((log) => log.duration);

  if (sleepChartInstance) {
    sleepChartInstance.destroy();
  }

  sleepChartInstance = new Chart(elements.charts.canvas, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Sleep Duration",
          data: dataPoints,
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
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(15, 23, 41, 0.95)",
          titleColor: "#f1f5f9",
          bodyColor: "#cbd5e1",
          borderColor: "rgba(139, 92, 246, 0.3)",
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            label: (context) => `${context.parsed.y} hours`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "rgba(139, 92, 246, 0.1)", drawBorder: false },
          ticks: { color: "#94a3b8", callback: (v) => v + "h" },
          border: { display: false },
        },
        x: {
          grid: { display: false },
          ticks: { color: "#94a3b8" },
          border: { display: false },
        },
      },
    },
  });
};

const renderStats = () => {
  if (state.logs.length === 0) {
    elements.stats.avgSleep.textContent = "0h";
    elements.stats.consistency.textContent = "N/A";
    elements.stats.totalLogs.textContent = "0";
    return;
  }

  const totalDuration = state.logs.reduce((acc, log) => acc + log.duration, 0);
  const avgDuration = (totalDuration / state.logs.length).toFixed(1);
  const consistency = state.logs.length > 3 ? "Good" : "Building...";

  elements.stats.avgSleep.textContent = `${avgDuration}h`;
  elements.stats.consistency.textContent = consistency;
  elements.stats.totalLogs.textContent = state.logs.length;
};

const renderHistory = () => {
  if (state.logs.length === 0) {
    elements.history.empty.classList.remove("hidden");
    // iterate over all non-empty children and remove them
    Array.from(elements.history.list.children).forEach((child) => {
      if (child.id !== "history-empty") child.remove();
    });
    return;
  }

  elements.history.empty.classList.add("hidden");

  // Clear list except empty placeholder
  Array.from(elements.history.list.children).forEach((child) => {
    if (child.id !== "history-empty") child.remove();
  });

  const recentLogs = [...state.logs].reverse().slice(0, 5);

  recentLogs.forEach((log, index) => {
    const el = document.createElement("div");
    el.className = "sleep-item slide-up";
    el.style.animationDelay = `${index * 0.1}s`;
    el.innerHTML = `
      <div style="flex: 1;">
        <p style="font-weight: 600; color: white; margin-bottom: 0.25rem; font-size: 0.9375rem;">
          ${format(parseISO(log.date), "MMM do, yyyy")}
        </p>
        <p style="font-size: 0.8125rem; color: #94a3b8; margin: 0;">
          ${format(parseISO(log.sleepTime), "hh:mm a")} → ${format(
      parseISO(log.wakeTime),
      "hh:mm a"
    )}
        </p>
      </div>
      <div style="display: flex; align-items: center; gap: 1rem;">
        <span style="font-size: 1.25rem; font-weight: 700; color: #a78bfa; min-width: 3rem; text-align: right;">
          ${log.duration}h
        </span>
        <button class="delete-btn" data-id="${
          log.id
        }" style="background: transparent; padding: 0.5rem; color: #64748b;">
          <i data-lucide="trash-2" style="width: 1rem; height: 1rem;"></i>
        </button>
      </div>
    `;
    elements.history.list.appendChild(el);
  });

  lucide.createIcons();

  // Attach delete handlers
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // prevent bubbling
      const id = btn.getAttribute("data-id");
      deleteLog(id);
    });
  });
};

const renderRecommendations = () => {
  const container = elements.recommendations.container;
  const list = elements.recommendations.list;

  if (state.logs.length === 0) {
    container.classList.add("hidden");
    return;
  }

  container.classList.remove("hidden");
  list.innerHTML = "";

  const avgDuration =
    state.logs.reduce((sum, log) => sum + log.duration, 0) / state.logs.length;
  const tips = [];

  // Duration Logic
  if (avgDuration < 7) {
    tips.push({
      icon: "moon",
      title: "Increase Sleep Duration",
      message: `Your average sleep is ${avgDuration.toFixed(
        1
      )}h. Aim for 7-9 hours.`,
      type: "warning",
    });
  } else if (avgDuration >= 7 && avgDuration <= 9) {
    tips.push({
      icon: "activity",
      title: "Great Sleep Duration!",
      message: `Averaging ${avgDuration.toFixed(1)}h - healthy range!`,
      type: "success",
    });
  }

  // Consistency Logic
  if (state.logs.length >= 3) {
    // Simplified consistency logic for vanilla JS
    tips.push({
      icon: "activity",
      title: "Consistent Sleep Schedule",
      message: "Maintaing a schedule helps your circadian rhythm.",
      type: "success",
    });
  }

  // Fillers
  if (tips.length < 4) {
    tips.push({
      icon: "coffee",
      title: "Limit Caffeine",
      message: "Avoid caffeine 6 hours before bed.",
      type: "info",
    });
    tips.push({
      icon: "moon",
      title: "Dark Environment",
      message: "Keep bedroom cool and dark.",
      type: "info",
    });
  }

  const getTypeColor = (type) => {
    if (type === "success") return "#10b981";
    if (type === "warning") return "#f59e0b";
    return "#8b5cf6";
  };

  tips.slice(0, 4).forEach((tip, index) => {
    const color = getTypeColor(tip.type);
    const el = document.createElement("div");
    el.className = "rec-card slide-up";
    el.style.border = `1px solid ${color}33`;
    el.style.animationDelay = `${index * 0.1}s`;
    el.innerHTML = `
        <div style="background: ${color}22; padding: 0.625rem; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center;">
            <i data-lucide="${tip.icon}" style="width: 1.25rem; height: 1.25rem; color: ${color};"></i>
        </div>
        <div style="flex: 1;">
            <h4 style="font-size: 0.9375rem; font-weight: 600; margin-bottom: 0.375rem; color: var(--color-text-primary);">${tip.title}</h4>
            <p style="font-size: 0.8125rem; color: var(--color-text-secondary); margin: 0; line-height: 1.5;">${tip.message}</p>
        </div>
      `;
    list.appendChild(el);
  });
  lucide.createIcons();
};

const renderSensorMetrics = () => {
  const container = elements.sensorMetrics;
  if (
    state.logs.length === 0 ||
    !state.logs[state.logs.length - 1].sensorData
  ) {
    container.classList.add("hidden");
    return;
  }

  const latestLog = state.logs[state.logs.length - 1];
  const sd = latestLog.sensorData;
  const quality = getQualityLabel(sd.qualityScore);

  container.className = "card fade-in";
  container.style.marginTop = "2rem";

  // Radial Chart SVG Generation
  const size = 100;
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (sd.qualityScore / 100) * circumference;

  container.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
       <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.25rem;">📊 Sleep Quality Metrics</h3>
       <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin: 0;">Insights from latest session</p>
    </div>

    <!-- Score Card -->
    <div style="background: var(--gradient-card); padding: 1.5rem; border-radius: var(--radius-lg); border: 2px solid ${
      quality.color
    }33; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between;">
        <div>
            <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 0.5rem;">Overall Sleep Quality</p>
            <div style="display: flex; align-items: baseline; gap: 0.75rem;">
                <h2 style="font-size: 3rem; font-weight: 800; color: ${
                  quality.color
                }; margin: 0; line-height: 1;">${sd.qualityScore}</h2>
                <span style="font-size: 1.125rem; font-weight: 600; color: ${
                  quality.color
                };">${quality.label}</span>
            </div>
        </div>
        <div style="position: relative; width: 100px; height: 100px; display: flex; align-items: center; justify-content: center;">
            <svg width="100" height="100" style="transform: rotate(-90deg);">
                <circle cx="50" cy="50" r="${radius}" fill="none" stroke="rgba(139,92,246,0.1)" stroke-width="6"></circle>
                <circle cx="50" cy="50" r="${radius}" fill="none" stroke="${
    quality.color
  }" stroke-width="6" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" stroke-linecap="round"></circle>
            </svg>
            <i data-lucide="activity" style="position: absolute; width: 2rem; height: 2rem; color: ${
              quality.color
            };"></i>
        </div>
    </div>
    
    <!-- Stages -->
    <div class="grid grid-cols-2 md:grid-cols-4" style="gap: 1rem; margin-bottom: 1.5rem;">
        ${[
          { l: "REM", v: sd.sleepStages.rem, c: "#8b5cf6", i: "zap" },
          { l: "Deep", v: sd.sleepStages.deep, c: "#6366f1", i: "moon" },
          { l: "Light", v: sd.sleepStages.light, c: "#a78bfa", i: "activity" },
          { l: "Awake", v: sd.sleepStages.awake, c: "#f59e0b", i: "activity" },
        ]
          .map(
            (s) => `
        <div style="background: var(--gradient-card); padding: 1rem; border-radius: 0.75rem; border: 1px solid ${s.c}33; text-align: center;">
            <div style="display: flex; justify-content: center; margin-bottom: 0.5rem;"><i data-lucide="${s.i}" style="width: 1.25rem; height: 1.25rem; color: ${s.c};"></i></div>
            <p style="font-size: 1.5rem; font-weight: 700; color: ${s.c}; margin: 0;">${s.v}%</p>
            <p style="font-size: 0.75rem; color: var(--color-text-muted); margin-top: 0.25rem;">${s.l}</p>
        </div>
        `
          )
          .join("")}
    </div>
  `;
  lucide.createIcons();
};

const renderSummaryLogic = (container, period) => {
  container.innerHTML = "";

  if (state.logs.length === 0) {
    container.innerHTML = `
        <div class="card fade-in" style="margin-top: 2rem; text-align: center; padding: 3rem 2rem;">
            <i data-lucide="calendar" style="width: 3rem; height: 3rem; color: var(--color-text-muted); margin: 0 auto 1rem; display: block;"></i>
            <p style="color: var(--color-text-secondary); margin: 0;">No data available for this ${period}</p>
        </div>`;
    lucide.createIcons();
    return;
  }

  const now = new Date();
  const start = period === "weekly" ? startOfWeek(now) : startOfMonth(now);
  const end = period === "weekly" ? endOfWeek(now) : endOfMonth(now);

  const periodLogs = state.logs.filter((log) =>
    isWithinInterval(parseISO(log.date), { start, end })
  );

  if (periodLogs.length === 0) {
    container.innerHTML = `
        <div class="card fade-in" style="margin-top: 2rem; text-align: center; padding: 3rem 2rem;">
            <i data-lucide="calendar" style="width: 3rem; height: 3rem; color: var(--color-text-muted); margin: 0 auto 1rem; display: block;"></i>
            <p style="color: var(--color-text-secondary); margin: 0;">No logs found for this current ${period}</p>
        </div>`;
    lucide.createIcons();
    return;
  }

  const avgDuration =
    periodLogs.reduce((acc, l) => acc + l.duration, 0) / periodLogs.length;

  // Sort for best/worst
  const sorted = [...periodLogs].sort((a, b) => b.duration - a.duration);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  container.innerHTML = `
        <div class="card fade-in" style="margin-top: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <div>
                   <h3 style="font-size: 1.25rem; font-weight: 700;">📅 Sleep Summary</h3>
                   <p style="font-size: 0.875rem; color: var(--color-text-secondary);">Your ${period} sleep insights</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2" style="gap: 1rem; margin-bottom: 1.5rem;">
                <div style="background: var(--gradient-card); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid rgba(139, 92, 246, 0.15);">
                    <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 0.5rem;">Avg Sleep Duration</p>
                    <div style="display: flex; align-items: baseline; gap: 0.75rem;">
                        <h2 style="font-size: 2.5rem; font-weight: 800; color: var(--color-accent); margin: 0;">${avgDuration.toFixed(
                          1
                        )}</h2>
                        <span style="fontSize: 1rem; color: var(--color-text-secondary);">hours</span>
                    </div>
                </div>
                <!-- Placeholder for Quality Score if implemented fully -->
            </div>

             <div class="grid grid-cols-1 md:grid-cols-2" style="gap: 1rem;">
                <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%); padding: 1.25rem; border-radius: 0.75rem; border: 1px solid rgba(16, 185, 129, 0.2);">
                    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
                        <i data-lucide="award" style="width: 1.25rem; height: 1.25rem; color: #10b981;"></i>
                        <h4 style="font-size: 0.9375rem; font-weight: 600; color: var(--color-text-primary); margin: 0;">Best Sleep</h4>
                    </div>
                    <p style="font-size: 1.5rem; font-weight: 700; color: #10b981; margin: 0;">${
                      best.duration
                    }h</p>
                    <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin-top: 0.25rem;">${format(
                      parseISO(best.date),
                      "EEEE, MMM do"
                    )}</p>
                </div>
                <div style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.02) 100%); padding: 1.25rem; border-radius: 0.75rem; border: 1px solid rgba(239, 68, 68, 0.2);">
                    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
                        <i data-lucide="trending-down" style="width: 1.25rem; height: 1.25rem; color: #ef4444;"></i>
                        <h4 style="font-size: 0.9375rem; font-weight: 600; color: var(--color-text-primary); margin: 0;">Needs Improvement</h4>
                    </div>
                    <p style="font-size: 1.5rem; font-weight: 700; color: #ef4444; margin: 0;">${
                      worst.duration
                    }h</p>
                    <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin-top: 0.25rem;">${format(
                      parseISO(worst.date),
                      "EEEE, MMM do"
                    )}</p>
                </div>
             </div>
        </div>
    `;
  lucide.createIcons();
};

const renderViews = () => {
  // Hide all
  Object.values(elements.views).forEach((el) => el.classList.add("hidden"));

  // Show active
  const activeView = elements.views[state.activeTab];
  if (activeView) activeView.classList.remove("hidden");

  // Update Nav
  elements.navTabs.forEach((tab) => {
    if (tab.dataset.tab === state.activeTab) tab.classList.add("active");
    else tab.classList.remove("active");
  });

  // Specific Rendering
  if (state.activeTab === "dashboard") {
    renderStats();
    renderChart();
    renderHistory();
    renderRecommendations();
    renderSensorMetrics();
  } else if (state.activeTab === "weekly") {
    renderSummaryLogic(elements.views.weekly, "weekly");
  } else if (state.activeTab === "monthly") {
    renderSummaryLogic(elements.views.monthly, "monthly");
  }
};

// --- 5. EVENT HANDLERS ---

const addLog = (e) => {
  e.preventDefault();
  const dateVal = elements.form.date.value;
  const sleepT = elements.form.bedtime.value;
  const wakeT = elements.form.waketime.value;

  if (!dateVal || !sleepT || !wakeT) return;

  const sleepDate = new Date(`${dateVal}T${sleepT}`);
  let wakeDate = new Date(`${dateVal}T${wakeT}`);
  if (wakeDate < sleepDate) wakeDate.setDate(wakeDate.getDate() + 1);

  const durationMinutes = differenceInMinutes(wakeDate, sleepDate);
  const durationHours = parseFloat((durationMinutes / 60).toFixed(1));

  const sensorData = generateSensorData(durationHours);

  const newLog = {
    id: Date.now().toString(),
    date: dateVal,
    sleepTime: sleepDate.toISOString(),
    wakeTime: wakeDate.toISOString(),
    duration: durationHours,
    sensorData: sensorData,
  };

  state.logs.push(newLog);
  localStorage.setItem("sleepLogs", JSON.stringify(state.logs));

  // Reset form
  elements.form.bedtime.value = "";
  elements.form.waketime.value = "";
  checkFormValidity();

  renderViews();
};

const deleteLog = (id) => {
  state.logs = state.logs.filter((log) => log.id !== id);
  localStorage.setItem("sleepLogs", JSON.stringify(state.logs));
  renderViews();
};

const checkFormValidity = () => {
  const isValid =
    elements.form.date.value &&
    elements.form.bedtime.value &&
    elements.form.waketime.value;
  elements.form.btn.disabled = !isValid;
  elements.form.btn.style.opacity = isValid ? 1 : 0.5;
  elements.form.btn.style.cursor = isValid ? "pointer" : "not-allowed";
};

// Listeners
elements.themeToggle.addEventListener("click", toggleTheme);
elements.navTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    state.activeTab = tab.dataset.tab;
    renderViews();
  });
});
elements.form.el.addEventListener("submit", addLog);
elements.form.date.addEventListener("input", checkFormValidity);
elements.form.bedtime.addEventListener("input", checkFormValidity);
elements.form.waketime.addEventListener("input", checkFormValidity);

// --- 6. INITIALIZATION ---

const init = () => {
  applyTheme();
  // Set default date
  elements.form.date.value = format(new Date(), "yyyy-MM-dd");
  renderViews();
  lucide.createIcons();
};

// Start
init();
