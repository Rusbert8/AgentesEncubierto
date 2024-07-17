// Rusbert Antonelly Sánchez Rosario (2022-0323)
import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Agregar Incidencia",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "document-text" : "document-text-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="incidencias"
        options={{
          title: "Listado de Incidencias",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "documents" : "documents-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="acercaDe"
        options={{
          title: "Acerca De",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person-circle" : "person-circle-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
