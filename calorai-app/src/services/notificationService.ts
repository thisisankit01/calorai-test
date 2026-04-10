import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'
import { MealService } from './mealService'
import { NotificationBehavior } from 'expo-notifications'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  } as NotificationBehavior),
})

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    } as NotificationBehavior),
  })
}

export class NotificationService {
  static async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      console.log('Must use physical device for notifications')
      return false
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permission denied')
      return false
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
      })
    }

    return true
  }

  static async scheduleDailyReminder(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync()

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Time to log your meals!',
        body: "Don't forget to track what you ate today.",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 20,
        minute: 0,
      },
    })
    

    console.log('Daily reminder scheduled for 8:00 PM')
  }

  static async sendDailySummary(userId: string): Promise<void> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const meals = await MealService.fetchMeals(userId)
    const todaysMeals = meals.filter(
      (m) => new Date(m.logged_at) >= today
    )

    const totalCalories = todaysMeals.reduce(
      (sum, m) => sum + (m.calories || 0), 0
    )

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Daily Summary',
        body: `Today you logged ${todaysMeals.length} meals totaling ${totalCalories} kcal.`,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 21,
        minute: 0,
      },
    })

    console.log('Daily summary scheduled for 9:00 PM')
  }
}