import { supabase } from '../api/supabase'
import { Meal, CreateMealInput, UpdateMealInput } from '../types'

export class MealService {
  static async fetchMeals(userId: string): Promise<Meal[]> {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', userId)
      .order('logged_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data || []
  }

  static async addMeal(input: CreateMealInput): Promise<void> {
    const { error } = await supabase.from('meals').insert([input])
    if (error) throw new Error(error.message)
  }

  static async updateMeal(id: string, input: UpdateMealInput): Promise<void> {
    const { error } = await supabase.from('meals').update(input).eq('id', id)
    if (error) throw new Error(error.message)
  }

  static async deleteMeal(id: string): Promise<void> {
    const { error } = await supabase.from('meals').delete().eq('id', id)
    if (error) throw new Error(error.message)
  }
}