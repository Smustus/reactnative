import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PurchaseList = () => {
  const { list } = useLocalSearchParams<{ list: string }>();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen options={{ title: list.toUpperCase() }} />
      <View style={styles.container}>
        <Text>PurchaseList</Text>
        <Text>{list}</Text>
      </View>
    </SafeAreaView>
  );
};

export default PurchaseList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
