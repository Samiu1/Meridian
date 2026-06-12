A neumorphic clay action button — uppercase Raleway-900 label, raised pebble that sinks on press; use for any primary or secondary action.

```jsx
<Button variant="primary" size="md" iconLeft={<i data-lucide="activity" />}>
  Connect Garmin
</Button>
```

Variants: `primary` (clay label), `secondary` (taupe), `sage` (green accent), `ghost` (no shadow, muted), `solid` (filled clay, light label).
Sizes: `sm`, `md`, `lg`. Props: `fullWidth`, `disabled`, `iconLeft`, `iconRight`.
Icons are passed as nodes — pair with Lucide (`<i data-lucide="…">`, then `lucide.createIcons()`).
