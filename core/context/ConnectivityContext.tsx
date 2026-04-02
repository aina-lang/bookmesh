import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

interface ConnectivityContextType {
  isOffline: boolean;
}

const ConnectivityContext = createContext<ConnectivityContextType>({ isOffline: false });

export const ConnectivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const removeSubscription = NetInfo.addEventListener((state) => {
      const offline = state.isConnected === false;
      setIsOffline(offline);
    });

    return () => removeSubscription();
  }, []);

  return (
    <ConnectivityContext.Provider value={{ isOffline }}>
      {children}
    </ConnectivityContext.Provider>
  );
};

export const useConnectivity = () => useContext(ConnectivityContext);
