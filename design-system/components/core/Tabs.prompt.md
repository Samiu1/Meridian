The floating pill navigation from the dashboard — a raised rail whose active segment sinks to an inset clay-labelled well.

```jsx
const items = [
  { value: "overview", label: "Home", icon: <i data-lucide="layout-dashboard" /> },
  { value: "analysis", label: "Analysis", icon: <i data-lucide="search" /> },
];
<Tabs items={items} value={tab} onChange={setTab} />
```

Place `position: fixed` centered at the bottom for the product look, or inline as a segmented control. Icons are Lucide nodes.
