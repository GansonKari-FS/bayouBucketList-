import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import api from "../../../services/api";

type Adventure = {
  _id: string;
  title: string;
  location: string;
  category: string;
  description: string;
  priority: string;
  completed: boolean;
};

export default function AdventureDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [adventure, setAdventure] = useState<Adventure | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAdventure = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<Adventure>(`/experiences/${id}`);
      setAdventure(response.data);
    } catch (error) {
      console.error("Unable to load adventure:", error);
      Alert.alert("Error", "This adventure could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      loadAdventure();
    }, [loadAdventure]),
  );

  const toggleCompleted = async () => {
    if (!adventure) return;

    try {
      const response = await api.patch<Adventure>(
        `/experiences/${adventure._id}`,
        {
          completed: !adventure.completed,
        },
      );

      setAdventure(response.data);
    } catch (error) {
      console.error("Unable to update adventure:", error);
      Alert.alert("Error", "The adventure could not be updated.");
    }
  };

  const deleteAdventure = () => {
    if (!adventure) return;

    Alert.alert("Delete adventure?", "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/experiences/${adventure._id}`);
            router.replace("/");
          } catch (error) {
            console.error("Unable to delete adventure:", error);
            Alert.alert("Error", "The adventure could not be deleted.");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#d6a446" />
      </SafeAreaView>
    );
  }

  if (!adventure) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <Text>Adventure not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.category}>{adventure.category}</Text>
        <Text style={styles.title}>{adventure.title}</Text>
        <Text style={styles.location}>{adventure.location}</Text>

        <View
          style={[
            styles.statusBadge,
            adventure.completed ? styles.completedBadge : styles.pendingBadge,
          ]}
        >
          <Text style={styles.statusText}>
            {adventure.completed ? "Completed" : "Still Exploring"}
          </Text>
        </View>

        <Text style={styles.description}>{adventure.description}</Text>

        <Text style={styles.priority}>Priority: {adventure.priority}</Text>

        <Pressable style={styles.primaryButton} onPress={toggleCompleted}>
          <Text style={styles.primaryButtonText}>
            {adventure.completed
              ? "Mark as Not Completed"
              : "Mark as Completed"}
          </Text>
        </Pressable>

        <Pressable
          style={styles.editButton}
          onPress={() => router.push(`/adventure/edit/${adventure._id}`)}
        >
          <Text style={styles.editButtonText}>Edit Adventure</Text>
        </Pressable>

        <Pressable style={styles.deleteButton} onPress={deleteAdventure}>
          <Text style={styles.deleteButtonText}>Delete Adventure</Text>
        </Pressable>
      </ScrollView>
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
    backgroundColor: "#efe5d3",
  },
  container: {
    padding: 22,
    paddingBottom: 40,
  },
  category: {
    color: "#a65a36",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  title: {
    marginTop: 10,
    color: "#123f3c",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40,
  },
  location: {
    marginTop: 8,
    color: "#9b5d33",
    fontSize: 17,
    fontWeight: "800",
  },
  statusBadge: {
    alignSelf: "flex-start",
    marginTop: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  completedBadge: {
    backgroundColor: "#d7eddc",
  },
  pendingBadge: {
    backgroundColor: "#fae7c5",
  },
  statusText: {
    color: "#314c43",
    fontWeight: "900",
  },
  description: {
    marginTop: 24,
    color: "#5f6965",
    fontSize: 16,
    lineHeight: 26,
  },
  priority: {
    marginTop: 18,
    marginBottom: 25,
    color: "#123f3c",
    fontSize: 15,
    fontWeight: "800",
  },
  primaryButton: {
    minHeight: 52,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#d6a446",
  },
  primaryButtonText: {
    color: "#102f35",
    fontWeight: "900",
  },
  editButton: {
    minHeight: 52,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#123f3c",
  },
  editButtonText: {
    color: "#fff8e8",
    fontWeight: "900",
  },
  deleteButton: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#9a4539",
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "900",
  },
});
