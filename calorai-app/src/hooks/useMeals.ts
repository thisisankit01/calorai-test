import { useState, useEffect, useCallback } from 'react'
import { MealService } from '../services/mealService'
import { supabase } from '../api/supabase'
import { Meal, CreateMealInput, UpdateMealInput } from '../types'

function applyRealtimeChange(prev: Meal[], payload: any): Meal[] {
  const { eventType, new: newRow, old: oldRow } = payload

  switch (eventType) {
    case 'INSERT':
      if (prev.some(m => m.id === newRow.id)) return prev
      return [newRow as Meal, ...prev]

    case 'UPDATE':
      return prev.map(m =>
        m.id === newRow.id ? (newRow as Meal) : m
      )

    case 'DELETE':
      return prev.filter(m => m.id !== oldRow.id)

    default:
      return prev
  }
}

export const useMeals = (userId: string) => {
  const [meals, setMeals] = useState<Meal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [realtimeStatus, setRealtimeStatus] = useState<string>('CONNECTING')

  const loadMeals = useCallback(async () => {
    try {
      const data = await MealService.fetchMeals(userId)
      setMeals(data)
    } catch (e) {
      console.error('[useMeals] loadMeals error:', e)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (!userId) return

    loadMeals()

    const channel = supabase
      .channel(`meals-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meals',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('[useMeals] Realtime payload:', JSON.stringify(payload)) // 👈
          setMeals(prev => applyRealtimeChange(prev, payload))
        }
      )
      .subscribe((status, err) => {
        console.log('[useMeals] Realtime status:', status)
        setRealtimeStatus(status)

        if (status === 'CHANNEL_ERROR') {
          console.error('[useMeals] Realtime channel error:', err)
        }
        if (status === 'TIMED_OUT') {
          console.warn('[useMeals] Realtime timed out — retrying...')
          channel.subscribe() // retry
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, loadMeals])

  // ➕ CREATE
  const addMeal = async (input: CreateMealInput) => {
    try {
      await MealService.addMeal(input)
      // realtime INSERT event will update state automatically
    } catch (e) {
      console.error('[useMeals] addMeal error:', e)
    }
  }

  // ✏️ UPDATE (optimistic)
  const updateMeal = async (id: string, input: UpdateMealInput) => {
    // save snapshot for rollback
    const snapshot = meals

    setMeals(prev =>
      prev.map(m => (m.id === id ? { ...m, ...input } : m))
    )

    try {
      await MealService.updateMeal(id, input)
      // realtime UPDATE event will reconcile final state
    } catch (e) {
      console.error('[useMeals] updateMeal error:', e)
      setMeals(snapshot) // rollback to snapshot instead of refetch
    }
  }

  // ❌ DELETE (optimistic)
  const deleteMeal = async (id: string) => {
    // save snapshot for rollback
    const snapshot = meals

    setMeals(prev => prev.filter(m => m.id !== id))

    try {
      await MealService.deleteMeal(id)
      // realtime DELETE event will confirm
    } catch (e) {
      console.error('[useMeals] deleteMeal error:', e)
      setMeals(snapshot) // rollback to snapshot instead of refetch
    }
  }

  return {
    meals,
    isLoading,
    realtimeStatus, // expose so UI can show "live" indicator
    addMeal,
    updateMeal,
    deleteMeal,
    refresh: loadMeals,
  }
}