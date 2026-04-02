
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

SplashScreen.preventAutoHideAsync();

function Initializer({ onReady }: { onReady: () => void }) {

  useEffect(() => {
    async function setup() {
      try {
        onReady();
      } catch (e) {
        console.warn('[BookMesh] Initialization failed', e);
        onReady(); // Still ready to show UI
      } finally {
        SplashScreen.hideAsync();
      }
    }
    setup();
  }, []);

  return null;
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  return (
<>
      <Initializer onReady={() => setIsReady(true)} />
      {isReady && (
        <>
          <StatusBar style="light" backgroundColor="#0d0f14" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
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
            <Stack.Screen name="+not-found" />
          </Stack>
        </>
      )}
</>
  );


}
