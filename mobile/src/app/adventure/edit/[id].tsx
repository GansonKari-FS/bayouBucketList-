import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import api from "../../../../services/api";

export default function EditAdventureScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadAdventure = async () => {
      try {
        const response = await api.get(`/experiences/${id}`);
        const adventure = response.data;

        setTitle(adventure.title ?? "");
        setLocation(adventure.location ?? "");
        setCategory(adventure.category ?? "");
        setDescription(adventure.description ?? "");
        setPriority(adventure.priority ?? "Medium");
        setCompleted(Boolean(adventure.completed));
      } catch (error) {
        console.error("Unable to load adventure:", error);
        Alert.alert("Error", "The adventure could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    loadAdventure();
  }, [id]);

  const handleUpdate = async () => {
    if (!title.trim() || !location.trim() || !category.trim()) {
      Alert.alert(
        "Missing information",
        "Please enter a title, location, and category."
      );
      return;
    }

    try {
      setSaving(true);

      await api.patch(`/experiences/${id}`, {
        title: title.trim(),
        location: location.trim(),
        category: category.trim(),
        description: description.trim(),
        priority,
        completed,
      });

      Alert.alert("Adventure updated", "Your changes were saved.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Unable to update adventure:", error);
      Alert.alert("Error", "The adventure could not be updated.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#d6a446" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>UPDATE DESTINATION</Text>
        <Text style={styles.title}>Edit Adventure</Text>

        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Adventure title"
        />

        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Location"
        />

        <TextInput
          style={styles.input}
          value={category}
          onChangeText={setCategory}
          placeholder="Category"
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
          multiline
          textAlignVertical="top"
        />

        <Text style={styles.label}>Priority</Text>

        <View style={styles.priorityRow}>
          {["Low", "Medium", "High"].map((item) => (
            <Pressable
              key={item}
              style={[
                styles.priorityButton,
                priority === item && styles.priorityButtonActive,
              ]}
              onPress={() => setPriority(item)}
            >
              <Text
                style={[
                  styles.priorityText,
                  priority === item && styles.priorityTextActive,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.label}>Completed</Text>
          <Switch value={completed} onValueChange={setCompleted} />
        </View>

        <Pressable
          style={[styles.saveButton, saving && styles.disabledButton]}
          onPress={handleUpdate}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? "Saving..." : "Save Changes"}
          </Text>
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
    padding: 20,
    paddingBottom: 45,
  },
  eyebrow: {
    color: "#a65a36",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
  },
  title: {
    marginTop: 8,
    marginBottom: 24,
    color: "#123f3c",
    fontSize: 32,
    fontWeight: "900",
  },
  input: {
    minHeight: 52,
    marginBottom: 15,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#d7c5a5",
    borderRadius: 14,
    backgroundColor: "#fffaf0",
    fontSize: 16,
  },
  textArea: {
    minHeight: 130,
    paddingTop: 15,
  },
  label: {
    color: "#123f3c",
    fontSize: 16,
    fontWeight: "800",
  },
  priorityRow: {
    marginTop: 10,
    marginBottom: 22,
    flexDirection: "row",
    gap: 10,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#bfae91",
    borderRadius: 12,
    backgroundColor: "#fffaf0",
  },
  priorityButtonActive: {
    backgroundColor: "#123f3c",
  },
  priorityText: {
    color: "#53625d",
    fontWeight: "800",
  },
  priorityTextActive: {
    color: "#fff8e8",
  },
  switchRow: {
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  saveButton: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#d6a446",
  },
  saveButtonText: {
    color: "#102f35",
    fontSize: 16,
    fontWeight: "900",
  },
  disabledButton: {
    opacity: 0.6,
  },
});