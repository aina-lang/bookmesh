import React, { useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useTelegram } from '@/core/TelegramContext';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Camera, RefreshCw } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

const C = Colors.dark;

export default function ConnectScreen() {
  const { isConnected } = useTelegram();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [statusType, setStatusType] = useState<'success' | 'error' | 'info'>('info');

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);
    setStatus('Analyse du code...');
    setStatusType('info');
    
    // Placeholder for Telegram contact adding logic
    setTimeout(() => {
      setStatus('Lien détecté : ' + data);
      setStatusType('success');
      setTimeout(() => {
        setScanned(false);
        setStatus('');
      }, 3000);
    }, 1500);
  };

  if (!permission) return <View style={styles.center}><ActivityIndicator color={C.tint} /></View>;

  if (!permission.granted) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.centeredContent}>
          <Camera size={64} color={C.muted} style={{ marginBottom: 20 }} />
          <ThemedText style={styles.textCenter}>Permission caméra requise pour scanner des contacts.</ThemedText>
          <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
            <Text style={styles.buttonText}>Autoriser la caméra</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={{ backgroundColor: C.background }}>
      <ThemedView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Camera size={24} color={C.tint} />
            <ThemedText type="defaultSemiBold" style={{ marginLeft: 10, color: C.text }}>Scanner un Contact</ThemedText>
          </View>
          
          <View style={styles.cameraWrapper}>
            <CameraView 
              style={styles.camera} 
              facing="back"
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            />
            {scanned && (
              <View style={styles.scanningOverlay}>
                <RefreshCw size={40} color="#fff" />
              </View>
            )}
          </View>
          
          <ThemedText style={styles.hintText}>Scannez le QR Code Telegram d'un ami pour partager vos livres.</ThemedText>
        </View>

        {!isConnected && (
          <View style={styles.warningBox}>
            <ThemedText style={{ color: '#f97316', textAlign: 'center' }}>Connectez-vous à Telegram dans l'onglet Profil pour utiliser cette fonctionnalité.</ThemedText>
          </View>
        )}

        {status ? (
          <View style={[styles.statusBanner, statusType === 'success' ? styles.successStatus : styles.infoStatus]}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        ) : null}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 20, backgroundColor: C.background },
  scrollContent: { paddingVertical: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  centeredContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  card: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginBottom: 20 },
  cameraWrapper: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: C.tint,
    marginBottom: 20,
  },
  camera: { flex: 1 },
  scanningOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  hintText: { fontSize: 14, textAlign: 'center', color: C.muted, lineHeight: 20 },
  primaryButton: { backgroundColor: C.tint, paddingHorizontal: 30, paddingVertical: 15, borderRadius: 12, marginTop: 24 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  textCenter: { textAlign: 'center', color: C.text },
  statusBanner: { padding: 16, borderRadius: 12, marginTop: 10 },
  statusText: { color: '#fff', fontWeight: '600', textAlign: 'center' },
  infoStatus: { backgroundColor: C.tint },
  successStatus: { backgroundColor: '#4CAF50' },
  warningBox: { padding: 16, backgroundColor: 'rgba(249, 115, 22, 0.1)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(249, 115, 22, 0.2)' },
});

