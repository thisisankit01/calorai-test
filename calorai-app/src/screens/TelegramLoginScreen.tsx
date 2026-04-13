import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../api/supabase";

const USER_ID_KEY = "telegram_user_id";

export const TelegramLoginScreen = ({
  onLogin,
}: {
  onLogin: (id: string) => void;
}) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const clean = username.trim().replace("@", "").toLowerCase();
    if (!clean) return Alert.alert("Enter your Telegram username");

    setLoading(true);

    const { data, error } = await supabase
      .from("user_groups")
      .select("user_id")
      .eq("telegram_username", clean)
      .limit(1)
      .single();

    setLoading(false);

    if (error || !data) {
      return Alert.alert(
        "Not found",
        "No account found for that username. Make sure you've used the Telegram bot first.",
      );
    }

    await AsyncStorage.setItem(USER_ID_KEY, data.user_id);
    onLogin(data.user_id);
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>CalorAI</Text>
      <Text style={styles.subtitle}>
        Enter your Telegram username to sync your meals
      </Text>
      <TextInput
        style={styles.input}
        placeholder="@yourusername"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity
        style={styles.btn}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    padding: 32,
    backgroundColor: "#F8FAFC",
  },
  title: { fontSize: 32, fontWeight: "800", color: "#0F172A", marginBottom: 8 },
  subtitle: { fontSize: 15, color: "#64748B", marginBottom: 32 },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  btn: {
    backgroundColor: "#4F46E5",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
