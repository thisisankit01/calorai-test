import { supabase } from './supabase'

export async function getTotalUsers() {
  const { count } = await supabase
    .from('user_groups')
    .select('*', { count: 'exact', head: true })
  return count || 0
}

export async function getMealsLoggedToday() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const { count } = await supabase
    .from('meals')
    .select('*', { count: 'exact', head: true })
    .gte('logged_at', today.toISOString())
  return count || 0
}

export async function getAvgCaloriesToday() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const { data } = await supabase
    .from('meals')
    .select('calories')
    .gte('logged_at', today.toISOString())
  if (!data || data.length === 0) return 0
  const total = data.reduce((sum, m) => sum + (m.calories || 0), 0)
  return Math.round(total / data.length)
}

export async function getDailyMealActivity() {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    d.setHours(0, 0, 0, 0)
    return d
  })

  const { data } = await supabase
    .from('meals')
    .select('logged_at')
    .gte('logged_at', days[0].toISOString())

  return days.map((day) => {
    const next = new Date(day)
    next.setDate(next.getDate() + 1)
    const count = (data || []).filter((m) => {
      const d = new Date(m.logged_at)
      return d >= day && d < next
    }).length
    return {
      day: day.toLocaleDateString('en', { weekday: 'short' }),
      count,
    }
  })
}

export async function getGroupSplit() {
  const { data } = await supabase
    .from('user_groups')
    .select('group_name')

  const control = (data || []).filter((u) => u.group_name === 'control').length
  const test = (data || []).filter((u) => u.group_name === 'test').length
  const total = control + test || 1

  return {
    control: Math.round((control / total) * 100),
    test: Math.round((test / total) * 100),
    controlCount: control,
    testCount: test,
  }
}

export async function getOnboardingFunnel() {
  const getCount = async (event: string) => {
    const { count } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('event_name', event)
      .eq('group_name', 'test')
    return count || 0
  }

  const started = await getCount('group_assigned')
  const step1 = await getCount('onboarding_step_1_completed')
  const step2 = await getCount('onboarding_step_2_completed')
  const completed = await getCount('onboarding_completed')
  const base = started || 1

  return [
    { label: 'Bot started', count: started, pct: 100 },
    { label: 'Step 1 — name', count: step1, pct: Math.round((step1 / base) * 100) },
    { label: 'Step 2 — goal', count: step2, pct: Math.round((step2 / base) * 100) },
    { label: 'Step 3 — done', count: completed, pct: Math.round((completed / base) * 100) },
  ]
}