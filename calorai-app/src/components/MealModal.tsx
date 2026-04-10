import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Meal } from "../types";

interface Props {
  visible: boolean;
  meal?: Meal | null;
  onClose: () => void;
  onSave: (meal_name: string, calories: number | null) => void;
}

export const MealModal = ({ visible, meal, onClose, onSave }: Props) => {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");

  useEffect(() => {
    if (meal) {
      setName(meal.meal_name);
      setCalories(meal.calories?.toString() || "");
    } else {
      setName("");
      setCalories("");
    }
  }, [meal, visible]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim(), calories ? parseInt(calories) : null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.sheet}>
          <Text style={styles.title}>{meal ? "Edit Meal" : "Log Meal"}</Text>

          <Text style={styles.label}>Meal name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Chicken Rice"
            value={name}
            onChangeText={setName}
            autoFocus
          />

          <Text style={styles.label}>Calories (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 450"
            value={calories}
            onChangeText={setCalories}
            keyboardType="numeric"
          />

          <View style={styles.row}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveText}>{meal ? "Update" : "Log"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 20,
  },
  label: { fontSize: 13, color: "#64748B", marginBottom: 6, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    marginBottom: 16,
    color: "#0F172A",
  },
  row: { flexDirection: "row", gap: 12, marginTop: 8 },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  cancelText: { fontWeight: "600", color: "#64748B" },
  saveBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#4F46E5",
    alignItems: "center",
  },
  saveText: { fontWeight: "700", color: "#fff" },
});
