import { useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../../assets/images/logo.jpg";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    color: "blue",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    padding: 10,
  },
});

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/*       <View style={styles.container}> */}
      <ScrollView
        style={{
          flex: 1,
          width: "100%",
        }}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text>Login</Text>
        </TouchableOpacity>

        {/*   <ScrollView
        style={{
          flex: 1,
          flexDirection: "column",
          width: "100%",
        }}
        contentContainerStyle={{
          justifyContent: "flex-start",
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      > */}
        <Image
          source={logo}
          style={{
            height: 150,
            width: 150,
          }}
        />
        <Text>Edit app/index.tsx to edit this screen.</Text>
      </ScrollView>

      {/*   </View> */}
    </SafeAreaView>
  );
}
