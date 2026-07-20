import { useState } from "react";
import {
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
import { router } from "expo-router";

import api from "../../services/api";

export default function AddAdventureScreen() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !location.trim() || !category.trim()) {
      Alert.alert(
        "Missing information",
        "Please enter a title, location, and category.",
      );
      return;
    }

    try {
      setSaving(true);

      await api.post("/experiences", {
        title: title.trim(),
        location: location.trim(),
        category: category.trim(),
        description: description.trim(),
        priority,
        completed,
      });

      Alert.alert("Adventure added", "Your adventure was saved.", [
        {
          text: "OK",
          onPress: () => router.replace("/"),
        },
      ]);
    } catch (error) {
      console.error("Unable to add adventure:", error);
      Alert.alert(
        "Unable to save",
        "The adventure could not be added. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>NEW DESTINATION</Text>
        <Text style={styles.title}>Add an Adventure</Text>

        <TextInput
          style={styles.input}
          placeholder="Adventure title"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
        />

        <TextInput
          style={styles.input}
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
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
          <Text style={styles.label}>Already completed?</Text>
          <Switch value={completed} onValueChange={setCompleted} />
        </View>

        <Pressable
          style={[styles.saveButton, saving && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? "Saving..." : "Save Adventure"}
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
