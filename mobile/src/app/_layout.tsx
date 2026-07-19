import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
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
          name="index"
          options={{
            title: "Bayou Bucket List",
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
