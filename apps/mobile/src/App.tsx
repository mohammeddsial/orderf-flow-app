import React, { useEffect, useState, useRef } from 'react';
import { View, ActivityIndicator, AppState } from 'react-native';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { ThemeProvider } from './theme/provider';
import { RootNavigator } from './navigation/RootNavigator';
import { bootstrapFromApi } from './api/client';

export default function App() {
  const [ready, setReady] = useState(false);
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // Use a ref to prevent multiple simultaneous bootstrap calls
  const bootstrapping = useRef(false);

  const loadData = async () => {
    if (bootstrapping.current) return;
    bootstrapping.current = true;
    try {
      await bootstrapFromApi();
    } finally {
      bootstrapping.current = false;
      setReady(true);
    }
  };

  // Initial bootstrap
  useEffect(() => {
    loadData();
  }, []);

  // Re‑fetch when the app comes to the foreground (e.g., after tenant switch)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && ready) {
        // Only refetch if already ready (avoids double‑fetch on first mount)
        loadData();
      }
    });
    return () => subscription.remove();
  }, [ready]);

  if (!ready || !fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
}