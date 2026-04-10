"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Props {
  data: { day: string; count: number }[];
}

export const MealActivityChart = ({ data }: Props) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <p className="text-sm font-bold text-slate-900">Daily meal activity</p>
      <p className="text-xs text-slate-400 mb-4">
        Meals logged per day — last 7 days
      </p>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} barSize={28}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#F1F5F9"
            vertical={false}
          />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12, fill: "#94A3B8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#94A3B8" }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #E2E8F0",
              fontSize: 13,
            }}
          />
          <Bar
            dataKey="count"
            fill="#4F46E5"
            radius={[5, 5, 0, 0]}
            name="Meals"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
