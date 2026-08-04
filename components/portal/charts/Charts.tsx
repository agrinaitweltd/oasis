"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const OASIS = "#9498ef";
const PALETTE = ["#9498ef", "#34d399", "#fbbf24", "#38bdf8", "#fb7185", "#a78bfa"];

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-100 bg-white px-3 py-2 text-xs shadow-popover">
      {label && <p className="mb-1 font-semibold text-slate-700">{label}</p>}
      {payload.map((p: any) => (
        <p key={p.dataKey} className="text-slate-500">
          <span className="font-medium text-slate-800">{p.value.toLocaleString?.() ?? p.value}</span> {p.name}
        </p>
      ))}
    </div>
  );
}

export function TrendAreaChart({ data, dataKey = "value", xKey = "label" }: { data: any[]; dataKey?: string; xKey?: string }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="oasisFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={OASIS} stopOpacity={0.35} />
            <stop offset="100%" stopColor={OASIS} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#eef0f6" />
        <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} />
        <Area type="monotone" dataKey={dataKey} stroke={OASIS} strokeWidth={2.5} fill="url(#oasisFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ComparisonBarChart({ data, bars, xKey = "label" }: { data: any[]; bars: { key: string; color?: string }[]; xKey?: string }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#eef0f6" />
        <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f8f8fd" }} />
        {bars.map((b, i) => (
          <Bar key={b.key} dataKey={b.key} fill={b.color ?? PALETTE[i % PALETTE.length]} radius={[6, 6, 0, 0]} maxBarSize={28} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DonutChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3}>
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} stroke="none" />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export { PALETTE as chartPalette };
