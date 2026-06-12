A single-icon neumorphic control for settings, sync, and toolbar actions; raised pebble at rest, inset when `active`.

```jsx
<IconButton ariaLabel="Settings" icon={<i data-lucide="settings" />} shape="rounded" />
```

Shapes: `rounded`, `circle`. Sizes: `sm`, `md`, `lg`. Variants tint the icon: `muted`, `primary`, `secondary`, `sage`. Pass `active` for a toggled (pressed-in) state. Always set `ariaLabel`.
