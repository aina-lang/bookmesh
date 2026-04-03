import io, { Socket } from 'socket.io-client';

const SOCKET_URL = 'https://zarabook-api.onrender.com';

class SocketServiceClass {
  private socket: Socket | null = null;
  private listeners: Set<(data: any) => void> = new Set();
  private initialized = false;

  init() {
    if (this.initialized) return;
    this.initialized = true;

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.socket.on('connect', () => {
      console.log('[SocketService] Connecté au serveur API !');
    });

    this.socket.on('disconnect', () => {
      console.log('[SocketService] Déconnecté du serveur.');
    });

    this.socket.on('app_update_ready', (data) => {
      console.log('[SocketService] Nouvelle mise à jour OTA reçue via WebSocket !', data);
      this.listeners.forEach(listener => listener(data));
    });
  }

  subscribeToAppUpdates(callback: (data: any) => void) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.initialized = false;
  }
}

export const SocketService = new SocketServiceClass();
