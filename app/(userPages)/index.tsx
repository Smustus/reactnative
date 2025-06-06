import { Link, useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import logo from "../../assets/images/logo.jpg";
import SearchBar from "../components/SearchBar";

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
    <View style={styles.container}>
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
        <Image
          source={logo}
          style={{
            height: 150,
            width: 150,
          }}
        />
      </ScrollView>
      <SearchBar
        /*  onPress={() => router.push("/search")} */
        placeholder="Search for a list"
      />
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href="/onboarding" asChild>
        <TouchableOpacity>
          <Text style={styles.link}>Onboarding</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
