import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { HomeScreen } from "./src/screens/HomeScreen";
import { NotificationService } from "./src/services/notificationService";

const USER_ID = "8275453639";

export default function App() {
  useEffect(() => {
    const setupNotifications = async () => {
      const granted = await NotificationService.requestPermissions();
      if (granted) {
        await NotificationService.scheduleDailyReminder();
        await NotificationService.sendDailySummary(USER_ID);
      }
    };
    setupNotifications();
  }, []);

  return (
    <SafeAreaProvider>
      <HomeScreen />
    </SafeAreaProvider>
  );
}
