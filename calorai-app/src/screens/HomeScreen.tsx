import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMeals } from "../hooks/useMeals";
import { MealItem } from "../components/MealItem";
import { MealModal } from "../components/MealModal";
import { Meal } from "../types";

const USER_ID = "8275453639";

export const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const { meals, isLoading, addMeal, updateMeal, deleteMeal } =
    useMeals(USER_ID);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);

  const totalCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0);

  const handleAdd = () => {
    setEditingMeal(null);
    setModalVisible(true);
  };

  const handleEdit = (meal: Meal) => {
    setEditingMeal(meal);
    setModalVisible(true);
  };

  const handleSave = async (meal_name: string, calories: number | null) => {
    if (editingMeal) {
      await updateMeal(editingMeal.id, { meal_name, calories });
    } else {
      await addMeal({ user_id: USER_ID, meal_name, calories });
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>CalorAI</Text>
          <Text style={styles.subtitle}>Your meal tracker</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeNum}>{totalCalories}</Text>
          <Text style={styles.badgeLabel}>kcal today</Text>
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#4F46E5" style={styles.center} />
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MealItem meal={item} onEdit={handleEdit} onDelete={deleteMeal} />
          )}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No meals logged yet.</Text>
              <Text style={styles.emptySubText}>
                Tap + to add your first meal!
              </Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 24 }]}
        onPress={handleAdd}
      >
        <Text style={styles.fabText}>+ Add Meal</Text>
      </TouchableOpacity>

      <MealModal
        visible={modalVisible}
        meal={editingMeal}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  title: { fontSize: 26, fontWeight: "800", color: "#0F172A" },
  subtitle: { fontSize: 13, color: "#94A3B8", marginTop: 2 },
  badge: { alignItems: "center" },
  badgeNum: { fontSize: 22, fontWeight: "800", color: "#4F46E5" },
  badgeLabel: { fontSize: 11, color: "#94A3B8", fontWeight: "600" },
  list: { padding: 20 },
  center: { flex: 1 },
  empty: { marginTop: 80, alignItems: "center" },
  emptyText: { fontSize: 17, fontWeight: "700", color: "#0F172A" },
  emptySubText: { fontSize: 14, color: "#94A3B8", marginTop: 6 },
  fab: {
    position: "absolute",
    alignSelf: "center",
    backgroundColor: "#4F46E5",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
