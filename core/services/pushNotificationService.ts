import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const API_URL = 'https://zarabook-api.onrender.com/notifications';

class PushNotificationService {
  async registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.warn('Failed to get push token for push notification!');
        return;
      }
      
      try {
        const projectId = Constants.expoConfig?.extra?.eas?.projectId || Constants.easConfig?.projectId;
        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        console.log('[PushNotificationService] Token:', token);
        
        if (token) {
          await this.saveTokenToServer(token);
        }
      } catch (e) {
        console.error('[PushNotificationService] Error getting token:', e);
      }
    } else {
      console.warn('Must use physical device for Push Notifications');
    }

    return token;
  }

  private async saveTokenToServer(token: string) {
    try {
      const response = await fetch(`${API_URL}/tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      console.log('[PushNotificationService] Server response:', data);
    } catch (e) {
      console.error('[PushNotificationService] Error saving token to server:', e);
    }
  }
}

export const pushNotificationService = new PushNotificationService();
