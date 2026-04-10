interface Props {
  label: string;
  value: string | number;
  sub: string;
  color?: "purple" | "green" | "amber" | "default";
}

const colors = {
  purple: "text-indigo-600",
  green: "text-emerald-500",
  amber: "text-amber-500",
  default: "text-slate-900",
};

export const MetricCard = ({ label, value, sub, color = "default" }: Props) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
        {label}
      </p>
      <p className={`text-3xl font-extrabold ${colors[color]}`}>{value}</p>
      <p className="text-xs text-slate-400 mt-1">{sub}</p>
    </div>
  );
};
