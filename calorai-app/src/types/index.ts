export interface Meal {
  id: string;
  user_id: string;
  meal_name: string;
  calories: number | null;
  logged_at: string;
}

export type CreateMealInput = Omit<Meal, 'id' | 'logged_at'>;
export type UpdateMealInput = Partial<Omit<Meal, 'user_id'>>;