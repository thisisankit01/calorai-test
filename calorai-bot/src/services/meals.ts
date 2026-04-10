import { supabase } from '../supabase'
import { CreateMealInput, Meal, UpdateMealInput } from '../types'

export const mealService = {
  async logMeal(input: CreateMealInput): Promise<Meal | null> {
    const { data, error } = await supabase
      .from('meals')
      .insert(input)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  async getTodaysMeals(user_id: string): Promise<Meal[]> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', user_id)
      .gte('logged_at', today.toISOString())
      .order('logged_at', { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
  },

  async getRecentMeals(user_id: string, limit = 10): Promise<Meal[]> {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', user_id)
      .order('logged_at', { ascending: false })
      .limit(limit)

    if (error) throw new Error(error.message)
    return data || []
  },

  async getMealById(id: string): Promise<Meal | null> {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  async updateMeal(id: string, input: UpdateMealInput): Promise<Meal | null> {
    const { data, error } = await supabase
      .from('meals')
      .update(input)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  async deleteMeal(id: string): Promise<void> {
    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)
  },
}