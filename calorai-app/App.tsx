import React, { useState, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HomeScreen } from "./src/screens/HomeScreen";
import { TelegramLoginScreen } from "./src/screens/TelegramLoginScreen";
import { NotificationService } from "./src/services/notificationService";

const USER_ID_KEY = "telegram_user_id";

export default function App() {
  const [userId, setUserId] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if already logged in
    AsyncStorage.getItem(USER_ID_KEY).then((id) => {
      if (id) setUserId(id);
      setChecking(false);
    });
  }, []);

  useEffect(() => {
    if (!userId) return;
    NotificationService.requestPermissions().then((granted) => {
      if (granted) {
        NotificationService.scheduleDailyReminder();
        NotificationService.sendDailySummary(userId);
      }
    });
  }, [userId]);

  if (checking) return null;

  return (
    <SafeAreaProvider>
      {userId ? (
        <HomeScreen userId={userId} />
      ) : (
        <TelegramLoginScreen onLogin={setUserId} />
      )}
    </SafeAreaProvider>
  );
}
