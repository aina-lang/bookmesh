
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ModalProvider } from '@/core/context/ModalContext';
import { ConnectivityProvider } from '@/core/context/ConnectivityContext';
import { ConnectivityBanner } from '@/components/ConnectivityBanner';

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ConnectivityProvider>
      <ModalProvider>
        <StatusBar style="light" backgroundColor="#0d0f14" />
        <ConnectivityBanner />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          {/* ... other screens ... */}
          <Stack.Screen
            name="book/[id]"
            options={{
              headerShown: true,
              presentation: 'modal',
              headerStyle: { backgroundColor: '#0d0f14' },
              headerTintColor: '#f97316',
              headerTitle: '',
            }}
          />
          <Stack.Screen
            name="my-id"
            options={{
              headerShown: true,
              presentation: 'modal',
              headerStyle: { backgroundColor: '#0d0f14' },
              headerTintColor: '#f97316',
              headerTitle: 'Mon Profil Telegram',
            }}
          />
          <Stack.Screen
            name="scan-peer"
            options={{
              headerShown: true,
              presentation: 'modal',
              headerStyle: { backgroundColor: '#0d0f14' },
              headerTintColor: '#f97316',
              headerTitle: 'Scanner un Contact',
            }}
          />
        </Stack>
      </ModalProvider>
    </ConnectivityProvider>
  );
}
