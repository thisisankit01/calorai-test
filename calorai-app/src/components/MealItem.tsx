// MealItem.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Meal } from "../types";

interface Props {
  meal: Meal;
  onEdit: (meal: Meal) => void;
  onDelete: (id: string) => void;
  readOnly?: boolean;
}

export const MealItem = ({
  meal,
  onEdit,
  onDelete,
  readOnly = false,
}: Props) => {
  if (!meal.meal_name) return null; // 🔧 fix blank card bug

  const handleDelete = () => {
    Alert.alert("Delete Meal", `Delete "${meal.meal_name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => onDelete(meal.id),
      },
    ]);
  };

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <Text style={styles.name}>{meal.meal_name}</Text>
        <Text style={styles.sub}>
          {meal.calories ? `${meal.calories} kcal` : "No calorie info"} •{" "}
          {new Date(meal.logged_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
      {!readOnly && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(meal)}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  left: { flex: 1 },
  name: { fontSize: 15, fontWeight: "700", color: "#0F172A" },
  sub: { fontSize: 13, color: "#94A3B8", marginTop: 3 },
  actions: { flexDirection: "row", gap: 8 },
  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  editText: { fontSize: 13, fontWeight: "600", color: "#4F46E5" },
  deleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#FEF2F2",
  },
  deleteText: { fontSize: 13, fontWeight: "600", color: "#EF4444" },
});
