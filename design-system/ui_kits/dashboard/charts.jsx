/* Health Signal — lightweight SVG charts (Japandi styled) */

function hsBuildPath(points, smooth = true) {
  if (!points.length) return "";
  if (!smooth) return points.map((p, i) => (i ? "L" : "M") + p.x + " " + p.y).join(" ");
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1], p1 = points[i];
    const cx = (p0.x + p1.x) / 2;
    d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

/** Area chart with one or two series. series = [{ key, color, label }] */
function AreaChartMini({ data, series, height = 320 }) {
  const W = 760, H = height, padX = 28, padTop = 24, padBottom = 40;
  const keys = series.map((s) => s.key);
  const allVals = data.flatMap((d) => keys.map((k) => d[k]));
  const max = Math.max(...allVals) * 1.15;
  const min = 0;
  const x = (i) => padX + (i * (W - padX * 2)) / (data.length - 1);
  const y = (v) => padTop + (1 - (v - min) / (max - min)) * (H - padTop - padBottom);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", gap: 24, justifyContent: "center", marginBottom: 8 }}>
        {series.map((s) => (
          <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
            <span style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--text-muted)" }}>{s.label}</span>
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={height} preserveAspectRatio="xMidYMid meet">
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={s.color} stopOpacity={0.35} />
              <stop offset="95%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        {[0.25, 0.5, 0.75, 1].map((g, i) => (
          <line key={i} x1={padX} x2={W - padX} y1={padTop + g * (H - padTop - padBottom)} y2={padTop + g * (H - padTop - padBottom)}
            stroke="var(--border-hairline)" strokeDasharray="3 4" />
        ))}
        {series.map((s) => {
          const pts = data.map((d, i) => ({ x: x(i), y: y(d[s.key]) }));
          const line = hsBuildPath(pts);
          const area = `${line} L ${pts[pts.length - 1].x} ${H - padBottom} L ${pts[0].x} ${H - padBottom} Z`;
          return (
            <g key={s.key}>
              <path d={area} fill={`url(#grad-${s.key})`} />
              <path d={line} fill="none" stroke={s.color} strokeWidth={3.5} strokeLinecap="round" />
            </g>
          );
        })}
        {data.map((d, i) => (
          <text key={i} x={x(i)} y={H - 14} textAnchor="middle"
            fontSize="10" fontWeight="700" fill="var(--text-muted)" fontFamily="var(--font-mono)">
            {d.date.slice(5)}
          </text>
        ))}
      </svg>
    </div>
  );
}

/** Bar chart, single series */
function BarChartMini({ data, dataKey, color = "var(--color-primary)", height = 320 }) {
  const W = 760, H = height, padX = 28, padTop = 24, padBottom = 40;
  const max = Math.max(...data.map((d) => d[dataKey])) * 1.2;
  const bw = (W - padX * 2) / data.length * 0.5;
  const step = (W - padX * 2) / data.length;
  const y = (v) => padTop + (1 - v / max) * (H - padTop - padBottom);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={height} preserveAspectRatio="xMidYMid meet">
      {[0.25, 0.5, 0.75, 1].map((g, i) => (
        <line key={i} x1={padX} x2={W - padX} y1={padTop + g * (H - padTop - padBottom)} y2={padTop + g * (H - padTop - padBottom)}
          stroke="var(--border-hairline)" strokeDasharray="3 4" />
      ))}
      {data.map((d, i) => {
        const cx = padX + step * i + step / 2;
        const top = y(d[dataKey]);
        return (
          <g key={i}>
            <rect x={cx - bw / 2} y={top} width={bw} height={H - padBottom - top} rx={10} fill={color} opacity={0.85} />
            <text x={cx} y={H - 14} textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--text-muted)" fontFamily="var(--font-mono)">
              {d.date.slice(5)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

Object.assign(window, { AreaChartMini, BarChartMini });
