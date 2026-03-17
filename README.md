# CIALanguageLearner

A React Native language learning app built with Expo.

## Prerequisites

- **Node.js** v18 or higher: https://nodejs.org
- **Expo CLI**: Install globally with:
  ```bash
  npm install -g expo-cli
  ```
- **Expo Go app** (for testing on a physical device): Install from the App Store (iOS) or Google Play (Android).

## Setup

1. Navigate to the app directory:
   ```bash
   cd CIALanguageLearner
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the App

**Web browser (easiest, no setup required):**
```bash
npm run web
```

**iOS simulator (Mac only — requires Xcode):**
```bash
npm run ios
```

**Android emulator (requires Android Studio):**
```bash
npm run android
```

**Expo Go on your phone (scan QR code):**
```bash
npm start
```
Then open the Expo Go app and scan the QR code shown in the terminal.

## Troubleshooting

**Clear Metro bundler cache:**
```bash
npx expo start --clear
```

**Reinstall dependencies:**
```bash
rm -rf node_modules && npm install
```
