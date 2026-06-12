A single biometric readout pebble — icon chip, eyebrow label, big italic serif value + unit, and an optional clay progress bar that lifts on hover.

```jsx
<MetricTile
  label="Heart Rate" value={58} unit="BPM"
  icon={<i data-lucide="heart" />} iconColor="var(--status-danger)"
  progress={72}
/>
```

Props: `label`, `value`, `unit`, `icon`, `iconColor`, `progress` (0–100, omit to hide bar). Lay out in a responsive grid for the dashboard hero.
