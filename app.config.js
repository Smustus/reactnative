const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

export default ({ config }) => ({
  ...config,

  name: getAppName(), //getAppName() "Shopping App"
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
    bundleIdentifier: getUniqueIdentifier(), //getUniqueIdentifier()
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
    package: getUniqueIdentifier(), //getUniqueIdentifier()
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
    [
      "expo-build-properties",
      {
        android: {
          googleServicesFile: "$GOOGLE_SERVICES_JSON_BASE64",
        },
      },
    ],
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
});

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "com.anonymous.reactnative.dev";
  }

  if (IS_PREVIEW) {
    return "com.anonymous.reactnative.preview";
  }

  return "com.anonymous.reactnative";
};

const getAppName = () => {
  if (IS_DEV) {
    return "Shopping App (Dev)";
  }

  if (IS_PREVIEW) {
    return "Shopping App (Preview)";
  }

  return "Shopping App";
};
