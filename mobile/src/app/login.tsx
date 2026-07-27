import axios from "axios";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();

  const [email, setEmail] = useState("finaltest97532@example.com");
  const [password, setPassword] = useState("Password123!");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await login(email, password);
      router.replace("/");
    } catch (requestError) {
      console.error("Login failed:", requestError);

      if (axios.isAxiosError(requestError)) {
        setError(
          requestError.response?.data?.message ??
            "Login failed. Please check your information.",
        );
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.eyebrow}>BAYOU BUCKET LIST</Text>

          <Text style={styles.title}>Welcome back</Text>

          <Text style={styles.description}>
            Log in to view and manage your Louisiana adventures.
          </Text>

          <Text style={styles.label}>Email</Text>

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#89908d"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Password</Text>

          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor="#89908d"
            secureTextEntry
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressed,
              submitting && styles.disabled,
            ]}
            onPress={handleLogin}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#102f35" />
            ) : (
              <Text style={styles.primaryButtonText}>Log In</Text>
            )}
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.pressed,
            ]}
            onPress={() => router.push("/register")}
          >
            <Text style={styles.secondaryButtonText}>Create a new account</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#102f35",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  card: {
    padding: 26,
    borderRadius: 24,
    backgroundColor: "#fffaf0",
  },

  eyebrow: {
    marginBottom: 10,
    color: "#a65a36",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
  },

  title: {
    color: "#123f3c",
    fontSize: 32,
    fontWeight: "900",
  },

  description: {
    marginTop: 10,
    marginBottom: 24,
    color: "#68706d",
    fontSize: 16,
    lineHeight: 23,
  },

  label: {
    marginBottom: 7,
    color: "#123f3c",
    fontWeight: "800",
  },

  input: {
    minHeight: 52,
    marginBottom: 17,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#d8c19a",
    borderRadius: 12,
    color: "#102f35",
    backgroundColor: "#ffffff",
    fontSize: 16,
  },

  error: {
    marginBottom: 16,
    color: "#9a3029",
    fontWeight: "700",
  },

  primaryButton: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: "#d6a446",
  },

  primaryButtonText: {
    color: "#102f35",
    fontSize: 16,
    fontWeight: "900",
  },

  secondaryButton: {
    minHeight: 48,
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    color: "#8f552b",
    fontSize: 15,
    fontWeight: "800",
  },

  pressed: {
    opacity: 0.78,
  },

  disabled: {
    opacity: 0.65,
  },
});
