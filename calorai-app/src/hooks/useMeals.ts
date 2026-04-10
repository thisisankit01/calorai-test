import { useState, useEffect, useCallback } from 'react'
import { MealService } from '../services/mealService'
import { supabase } from '../api/supabase'
import { Meal, CreateMealInput, UpdateMealInput } from '../types'

export const useMeals = (userId: string) => {
  const [meals, setMeals] = useState<Meal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadMeals = useCallback(async () => {
    try {
      const data = await MealService.fetchMeals(userId)
      setMeals(data)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    loadMeals()
    const channel = supabase
      .channel(`meals-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'meals', filter: `user_id=eq.${userId}` },
        () => loadMeals()
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [userId, loadMeals])

  const addMeal = async (input: CreateMealInput) => {
    await MealService.addMeal(input)
    await loadMeals();
  }

  const updateMeal = async (id: string, input: UpdateMealInput) => {
    setMeals(prev => prev.map(m => m.id === id ? { ...m, ...input } : m))
    try {
      await MealService.updateMeal(id, input)
    } catch (e) {
      await loadMeals()
    }
  }

  const deleteMeal = async (id: string) => {
    setMeals(prev => prev.filter(m => m.id !== id))
    try {
      await MealService.deleteMeal(id)
    } catch (e) {
      await loadMeals()
    }
  }

  return { meals, isLoading, addMeal, updateMeal, deleteMeal, refresh: loadMeals }
}