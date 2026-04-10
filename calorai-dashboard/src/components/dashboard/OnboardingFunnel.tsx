interface Step {
  label: string;
  count: number;
  pct: number;
}

const colors = [
  "bg-indigo-600",
  "bg-indigo-500",
  "bg-indigo-400",
  "bg-indigo-300",
];

export const OnboardingFunnel = ({ steps }: { steps: Step[] }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <p className="text-sm font-bold text-slate-900">
        Onboarding funnel — test group
      </p>
      <p className="text-xs text-slate-400 mb-5">Step completion rate</p>
      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-3">
            <span className="text-sm text-slate-700 font-medium w-32 shrink-0">
              {step.label}
            </span>
            <div className="flex-1 bg-slate-100 rounded-lg h-7 overflow-hidden">
              <div
                className={`h-full ${colors[i]} rounded-lg flex items-center px-3 transition-all`}
                style={{ width: `${Math.max(step.pct, 5)}%` }}
              >
                <span className="text-xs font-bold text-white">
                  {step.count} users
                </span>
              </div>
            </div>
            <span className="text-sm font-bold text-slate-900 w-10 text-right">
              {step.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
