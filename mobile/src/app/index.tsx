import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";

import api from "../../services/api";

type Adventure = {
  _id: string;
  title: string;
  location: string;
  category: string;
  description: string;
  imageUrl?: string;
  priority: "Low" | "Medium" | "High";
  completed: boolean;
  created_at?: string;
};

export default function HomeScreen() {
  const [adventures, setAdventures] = useState<Adventure[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadAdventures = useCallback(async (showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    }

    setError("");

    try {
      const response = await api.get<Adventure[]>("/experiences");
      setAdventures(response.data);
    } catch (requestError) {
      console.error("Unable to load adventures:", requestError);

      setError(
        "The adventures could not be loaded. Check your internet connection and try again.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAdventures();
    }, [loadAdventures]),
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadAdventures(false);
  };

  const completedCount = adventures.filter(
    (adventure) => adventure.completed,
  ).length;

  const renderAdventure = ({ item }: { item: Adventure }) => {
    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => router.navigate(`/adventure/${item._id}`)}
      >
        <View style={styles.cardTopRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              item.completed ? styles.completedBadge : styles.pendingBadge,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                item.completed ? styles.completedText : styles.pendingText,
              ]}
            >
              {item.completed ? "Completed" : "Still Exploring"}
            </Text>
          </View>
        </View>

        <Text style={styles.cardTitle}>{item.title}</Text>

        <Text style={styles.location}>{item.location}</Text>

        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>

        <View style={styles.cardFooter}>
          <Text style={styles.priority}>{item.priority} Priority</Text>

          <Text style={styles.viewText}>View Adventure →</Text>
        </View>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#d6a446" />
        <Text style={styles.loadingText}>
          Loading your Louisiana adventures...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={adventures}
        keyExtractor={(item) => item._id}
        renderItem={renderAdventure}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#d6a446"
            colors={["#d6a446"]}
          />
        }
        ListHeaderComponent={
          <>
            <View style={styles.hero}>
              <Text style={styles.eyebrow}>EXPLORE THE PELICAN STATE</Text>

              <Text style={styles.heroTitle}>
                Your Louisiana adventures, wherever you go.
              </Text>

              <Text style={styles.heroDescription}>
                Save places, festivals, food, history, and hidden gems you want
                to experience across Louisiana.
              </Text>

              <Pressable
                style={({ pressed }) => [
                  styles.addButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => router.navigate("/add")}
              >
                <Text style={styles.addButtonText}>+ Add Adventure</Text>
              </Pressable>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{adventures.length}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{completedCount}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {adventures.length - completedCount}
                </Text>
                <Text style={styles.statLabel}>Exploring</Text>
              </View>
            </View>

            <View style={styles.headingRow}>
              <View>
                <Text style={styles.sectionEyebrow}>YOUR BUCKET LIST</Text>

                <Text style={styles.sectionTitle}>Saved Adventures</Text>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.smallAddButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => router.navigate("/add")}
              >
                <Text style={styles.smallAddButtonText}>Add New</Text>
              </Pressable>
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>

                <Pressable
                  style={styles.retryButton}
                  onPress={() => loadAdventures()}
                >
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </Pressable>
              </View>
            ) : null}
          </>
        }
        ListEmptyComponent={
          !error ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Your bucket list is empty</Text>

              <Text style={styles.emptyDescription}>
                Add your first Louisiana adventure to begin building your list.
              </Text>

              <Pressable
                style={styles.addButton}
                onPress={() => router.navigate("/add")}
              >
                <Text style={styles.addButtonText}>Add First Adventure</Text>
              </Pressable>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#efe5d3",
  },

  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 24,
    backgroundColor: "#102f35",
  },

  loadingText: {
    color: "#f7ecd7",
    fontSize: 16,
    textAlign: "center",
  },

  listContent: {
    paddingBottom: 40,
  },

  hero: {
    margin: 16,
    padding: 26,
    borderRadius: 24,
    backgroundColor: "#123f3c",
    shadowColor: "#061b1b",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 8,
  },

  eyebrow: {
    marginBottom: 12,
    color: "#e2b550",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2.2,
  },

  heroTitle: {
    color: "#fff8e8",
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 38,
  },

  heroDescription: {
    marginTop: 14,
    marginBottom: 22,
    color: "#d8e3dd",
    fontSize: 16,
    lineHeight: 24,
  },

  addButton: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 22,
    borderRadius: 14,
    backgroundColor: "#d6a446",
  },

  addButtonText: {
    color: "#102f35",
    fontSize: 16,
    fontWeight: "900",
  },

  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  statsRow: {
    marginHorizontal: 16,
    marginBottom: 28,
    flexDirection: "row",
    gap: 10,
  },

  statCard: {
    flex: 1,
    minHeight: 96,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#d8c19a",
    borderRadius: 18,
    backgroundColor: "#fffaf0",
  },

  statNumber: {
    color: "#123f3c",
    fontSize: 30,
    fontWeight: "900",
  },

  statLabel: {
    marginTop: 3,
    color: "#6d746f",
    fontSize: 12,
    fontWeight: "700",
  },

  headingRow: {
    marginHorizontal: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
  },

  sectionEyebrow: {
    marginBottom: 4,
    color: "#a65a36",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.8,
  },

  sectionTitle: {
    color: "#102f35",
    fontSize: 27,
    fontWeight: "900",
  },

  smallAddButton: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: "#123f3c",
  },

  smallAddButtonText: {
    color: "#fff8e8",
    fontWeight: "800",
  },

  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#dfcfb4",
    borderRadius: 20,
    backgroundColor: "#fffaf0",
    shadowColor: "#1b332f",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },

  cardPressed: {
    opacity: 0.84,
    transform: [{ scale: 0.99 }],
  },

  cardTopRow: {
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  categoryBadge: {
    flexShrink: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "#e1ebe4",
  },

  categoryText: {
    color: "#315c4e",
    fontSize: 12,
    fontWeight: "800",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },

  completedBadge: {
    backgroundColor: "#d7eddc",
  },

  pendingBadge: {
    backgroundColor: "#fae7c5",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "900",
  },

  completedText: {
    color: "#276c42",
  },

  pendingText: {
    color: "#93601d",
  },

  cardTitle: {
    color: "#123f3c",
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 27,
  },

  location: {
    marginTop: 5,
    color: "#a65a36",
    fontSize: 15,
    fontWeight: "800",
  },

  description: {
    marginTop: 13,
    color: "#68706d",
    fontSize: 15,
    lineHeight: 23,
  },

  cardFooter: {
    marginTop: 20,
    paddingTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: "#eadfce",
  },

  priority: {
    color: "#66716b",
    fontSize: 12,
    fontWeight: "800",
  },

  viewText: {
    color: "#8f552b",
    fontSize: 13,
    fontWeight: "900",
  },

  errorBox: {
    marginHorizontal: 16,
    marginBottom: 18,
    padding: 18,
    borderLeftWidth: 5,
    borderLeftColor: "#a84d3e",
    borderRadius: 14,
    backgroundColor: "#f8dfd7",
  },

  errorText: {
    color: "#7f352d",
    fontSize: 14,
    lineHeight: 21,
  },

  retryButton: {
    marginTop: 12,
    alignSelf: "flex-start",
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 9,
    backgroundColor: "#7f352d",
  },

  retryButtonText: {
    color: "white",
    fontWeight: "800",
  },

  emptyCard: {
    marginHorizontal: 16,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dfcfb4",
    borderRadius: 20,
    backgroundColor: "#fffaf0",
  },

  emptyTitle: {
    color: "#123f3c",
    fontSize: 23,
    fontWeight: "900",
    textAlign: "center",
  },

  emptyDescription: {
    marginVertical: 14,
    color: "#68706d",
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
  },
});
