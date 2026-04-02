import React, { createContext, useContext, useEffect, useState } from 'react';
import { telegramService } from '@/services/telegramService';
import type { TelegramClient } from 'telegram';

interface TelegramContextType {
  client: TelegramClient | null;
  isConnected: boolean;
  init: () => Promise<void>;
}

const TelegramContext = createContext<TelegramContextType>({
  client: null,
  isConnected: false,
  init: async () => {},
});

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<TelegramClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const init = async () => {
    try {
      await telegramService.init();
      const c = telegramService.getClient();
      setClient(c);
      setIsConnected(await telegramService.isConnected());
    } catch (error) {
      console.error('[TelegramContext] Init error:', error);
    }
  };

  return (
    <TelegramContext.Provider value={{ client, isConnected, init }}>
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegram() {
  return useContext(TelegramContext);
}
