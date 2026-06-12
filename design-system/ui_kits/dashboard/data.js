/* Health Signal — demo dataset (mirrors web/src/lib/mockData.ts) */
window.HS_DATA = {
  metrics: [
    { date: "2024-05-14", resting_heart_rate: 63, avg_stress: 38, sleep_score: 72, body_battery_drain: 31, body_battery_charge: 80, readiness_score: 78, active_calories: 550 },
    { date: "2024-05-15", resting_heart_rate: 59, avg_stress: 25, sleep_score: 85, body_battery_drain: 22, body_battery_charge: 92, readiness_score: 90, active_calories: 350 },
    { date: "2024-05-16", resting_heart_rate: 61, avg_stress: 30, sleep_score: 80, body_battery_drain: 55, body_battery_charge: 88, readiness_score: 85, active_calories: 400 },
    { date: "2024-05-17", resting_heart_rate: 65, avg_stress: 45, sleep_score: 68, body_battery_drain: 22, body_battery_charge: 70, readiness_score: 72, active_calories: 800 },
    { date: "2024-05-18", resting_heart_rate: 60, avg_stress: 28, sleep_score: 82, body_battery_drain: 50, body_battery_charge: 90, readiness_score: 88, active_calories: 520 },
    { date: "2024-05-19", resting_heart_rate: 62, avg_stress: 35, sleep_score: 75, body_battery_drain: 60, body_battery_charge: 85, readiness_score: 82, active_calories: 600 },
    { date: "2024-05-20", resting_heart_rate: 58, avg_stress: 22, sleep_score: 88, body_battery_drain: 45, body_battery_charge: 95, readiness_score: 92, active_calories: 450 },
  ],
  insight: {
    date: "2024-05-20",
    health_score: 94,
    summary: "Your body is currently in an optimal state of recovery and readiness. The synergy between your sleep architecture and cardiovascular response suggests peak performance capacity.",
    synthesis_report: "The Recovery Architect notes a +15% improvement in Body Battery charge efficiency. The Cardio Guardian reports a stable Resting Heart Rate of 58 BPM, well within the optimal range for your demographic. The Sleep Navigator identified a significant increase in deep sleep duration, contributing to higher cognitive readiness.",
    recommendations: [
      "High-intensity interval training (HIIT)",
      "Complex clean carb loading — sweet potato or quinoa",
      "15-minute guided meditation for CNS maintenance",
    ],
    expert_insights: [
      {
        expert: "Cardio Guardian", icon: "activity", accent: "var(--color-primary)",
        analysis: "Heart rate variability shows high parasympathetic activity. Your cardiovascular system is primed for high-intensity exertion if desired.",
        recommendations: ["Vigorous intensity workout recommended", "Focus on explosive power today"],
      },
      {
        expert: "Sleep Navigator", icon: "moon", accent: "var(--color-secondary)",
        analysis: "Deep sleep phase duration was 2.5 hours — 40% above your 30-day average, indicating superior physical repair.",
        recommendations: ["Maintain current 10 PM wind-down routine", "Continue using magnesium before bed"],
      },
      {
        expert: "Metabolic Sage", icon: "leaf", accent: "var(--color-accent)",
        analysis: "Metabolic rate is trending high. Glycogen stores are depleted despite low active calories, suggesting high basal efficiency.",
        recommendations: ["Increase complex carb intake by 50g", "Prioritize protein at dinner"],
      },
    ],
  },
};
