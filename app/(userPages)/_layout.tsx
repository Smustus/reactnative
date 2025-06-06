import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const TabIcon = ({ focused, size, color, name }: TabIconProps) => {
  return (
    <Ionicons
      name={focused ? name : `${name}-outline`}
      size={size}
      color={color}
    />
  );
};

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        tabBarItemStyle: {
          padding: 5,
        },
        tabBarStyle: {
          backgroundColor: "#ffffff",
        },
        /* tabBarActiveTintColor: "#e91e63", */
        /* tabBarInactiveTintColor: "#999", */
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused, size, color }) => (
            <TabIcon focused={focused} size={size} color={color} name="home" />
          ),
        }}
      />
      <Tabs.Screen
        name="lists/[list]"
        options={{
          title: "Lists",
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon focused={focused} size={size} color={color} name="list" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon
              focused={focused}
              size={size}
              color={color}
              name="person"
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;

const styles = StyleSheet.create({});
