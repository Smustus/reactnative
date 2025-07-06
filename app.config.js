export default {
  expo: {
    name: "Shopping App",
    slug: "reactnative",
    version: "1.0.0",
    runtimeVersion: {
      policy: "appVersion",
    },
    orientation: "portrait",
    icon: "./assets/images/logo.jpg",
    scheme: "reactnative",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/logo.jpg",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.anonymous.reactnative",
      runtimeVersion: {
        policy: "appVersion",
      },
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/logo.jpg",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      googleServicesFile:
        "$GOOGLE_SERVICES_JSON_BASE64" ?? "./google-services.json",
      package: "com.anonymous.reactnative",
      runtimeVersion: "1.0.0",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/logo.jpg",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/logo.jpg",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      "expo-build-properties",
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "71349e9c-11e8-4624-a804-a756bcff9221",
      },
    },
    updates: {
      url: "https://u.expo.dev/71349e9c-11e8-4624-a804-a756bcff9221",
      fallbackToCacheTimeout: 0,
    },
    owner: "smustus",
  },
};
