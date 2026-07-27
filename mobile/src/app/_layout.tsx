import { Stack, router, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AuthProvider, useAuth } from "../context/AuthContext";

function AppNavigator() {
  const { user, loading, logout } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (loading) {
      return;
    }

    const currentRoute = segments[0];
    const isAuthScreen =
      currentRoute === "login" || currentRoute === "register";

    if (!user && !isAuthScreen) {
      router.replace("/login");
    }

    if (user && isAuthScreen) {
      router.replace("/");
    }
  }, [loading, segments, user]);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#d6a446" />
        <Text style={styles.loadingText}>Loading Bayou Bucket List...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />

      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#102a43",
          },
          headerTintColor: "#f1d58a",
          headerTitleStyle: {
            fontWeight: "700",
          },
          contentStyle: {
            backgroundColor: "#f2eadb",
          },
        }}
      >
        <Stack.Screen
          name="login"
          options={{
            title: "Log In",
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="register"
          options={{
            title: "Create Account",
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="index"
          options={{
            title: "Bayou Bucket List",
            headerRight: () =>
              user ? (
                <Pressable onPress={handleLogout}>
                  <Text style={styles.logoutText}>Log Out</Text>
                </Pressable>
              ) : null,
          }}
        />

        <Stack.Screen
          name="add"
          options={{
            title: "Add Adventure",
          }}
        />

        <Stack.Screen
          name="adventure/[id]"
          options={{
            title: "Adventure Details",
          }}
        />

        <Stack.Screen
          name="adventure/edit/[id]"
          options={{
            title: "Edit Adventure",
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    backgroundColor: "#102f35",
  },

  loadingText: {
    color: "#fff8e8",
    fontSize: 16,
    fontWeight: "700",
  },

  logoutText: {
    color: "#f1d58a",
    fontWeight: "800",
  },
});
