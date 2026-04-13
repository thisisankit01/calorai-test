export interface Meal {
  id: string
  user_id: string
  telegram_username?: string | null;
  meal_name: string
  calories: number | null
  logged_at: string
}

export interface CreateMealInput {
  user_id: string
  telegram_username?: string | null;
  meal_name: string
  calories: number | null
}

export interface UpdateMealInput {
  telegram_username?: string | null;
  meal_name: string
  calories: number | null
}