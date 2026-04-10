import { MetricCard } from "@/components/dashboard/MetricCard";
import { MealActivityChart } from "@/components/dashboard/MealActivityChart";
import { GroupSplitChart } from "@/components/dashboard/GroupSplitChart";
import { OnboardingFunnel } from "@/components/dashboard/OnboardingFunnel";
import {
  getTotalUsers,
  getMealsLoggedToday,
  getAvgCaloriesToday,
  getDailyMealActivity,
  getGroupSplit,
  getOnboardingFunnel,
} from "@/lib/analytics";

export const revalidate = 60;

export default async function DashboardPage() {
  const [
    totalUsers,
    mealsToday,
    avgCalories,
    dailyActivity,
    groupSplit,
    funnelSteps,
  ] = await Promise.all([
    getTotalUsers(),
    getMealsLoggedToday(),
    getAvgCaloriesToday(),
    getDailyMealActivity(),
    getGroupSplit(),
    getOnboardingFunnel(),
  ]);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white px-8 py-4 flex items-center justify-between">
        <div>
          <span className="text-lg font-extrabold text-slate-900">Calor</span>
          <span className="text-lg font-extrabold text-indigo-600">AI</span>
          <span className="text-slate-400 text-sm font-normal ml-2">
            Analytics
          </span>
        </div>
        <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100">
          Live data
        </span>
      </div>

      <div className="p-8 space-y-5">
        <div className="grid grid-cols-4 gap-4">
          <MetricCard
            label="Total users"
            value={totalUsers}
            sub="all time"
            color="purple"
          />
          <MetricCard
            label="Meals logged today"
            value={mealsToday}
            sub="across all users"
          />
          <MetricCard
            label="Onboarding completion"
            value={`${funnelSteps[3]?.pct ?? 0}%`}
            sub="test group"
            color="green"
          />
          <MetricCard
            label="Avg calories today"
            value={avgCalories.toLocaleString()}
            sub="kcal per user"
            color="amber"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <MealActivityChart data={dailyActivity} />
          </div>
          <GroupSplitChart
            control={groupSplit.control}
            test={groupSplit.test}
            controlCount={groupSplit.controlCount}
            testCount={groupSplit.testCount}
          />
        </div>

        <OnboardingFunnel steps={funnelSteps} />
      </div>
    </main>
  );
}
