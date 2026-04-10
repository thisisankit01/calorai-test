export interface Meal {
  id: string
  user_id: string
  meal_name: string
  calories: number | null
  logged_at: string
}

export interface CreateMealInput {
  user_id: string
  meal_name: string
  calories: number | null
}

export interface UpdateMealInput {
  meal_name: string
  calories: number | null
}