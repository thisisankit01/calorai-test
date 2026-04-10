"use client";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface LegendEntry {
  payload: {
    value: number;
    name: string;
  };
}

interface Props {
  control: number;
  test: number;
  controlCount: number;
  testCount: number;
}

export const GroupSplitChart = ({
  control,
  test,
  controlCount,
  testCount,
}: Props) => {
  const data = [
    { name: "Control", value: controlCount },
    { name: "Test", value: testCount },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <p className="text-sm font-bold text-slate-900">A/B group split</p>
      <p className="text-xs text-slate-400 mb-4">
        Control vs test distribution
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={70}
            dataKey="value"
            paddingAngle={3}
          >
            <Cell fill="#4F46E5" />
            <Cell fill="#10B981" />
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #E2E8F0",
              fontSize: 13,
            }}
          />
          <Legend
            formatter={(value, entry) => {
              const e = entry as unknown as LegendEntry;
              return `${value} — ${e.payload.value} users`;
            }}
            iconType="circle"
            iconSize={8}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
