import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useTelegram } from '@/core/TelegramContext';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Smartphone, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

const C = Colors.dark;

export default function MyIdScreen() {
  const { isConnected, init } = useTelegram();

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.container}>
      <ThemedView style={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Smartphone size={24} color={C.tint} />
            <ThemedText type="defaultSemiBold" style={{ marginLeft: 10, color: C.text }}>
              Statut du Réseau BookMesh
            </ThemedText>
          </View>
          
          <View style={styles.centerFlow}>
            {isConnected ? (
              <>
                <View style={styles.successBadge}>
                  <CheckCircle size={48} color={Colors.light.tint} />
                </View>
                <ThemedText type="subtitle" style={{ color: C.text, marginBottom: 10 }}>Connecté</ThemedText>
                <ThemedText style={styles.hintText}>Le stockage cloud Telegram est actif en arrière-plan.</ThemedText>
              </>
            ) : (
              <>
                <View style={styles.errorBadge}>
                  <AlertCircle size={48} color={C.muted} />
                </View>
                <ThemedText type="subtitle" style={{ color: C.text, marginBottom: 10 }}>Connexion en cours...</ThemedText>
                <ThemedText style={styles.hintText}>Le Bot tente de se connecter au stockage Telegram.</ThemedText>
                <ActivityIndicator size="large" color={C.tint} style={{ marginTop: 20 }} />
                
                <TouchableOpacity style={styles.retryBtn} onPress={init}>
                  <RefreshCw size={16} color={C.text} />
                  <Text style={{ color: C.text, fontWeight: '600' }}>Réessayer</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Détails Techniques</Text>
          <Text style={styles.addressText}>Type: Bot Authentication (MTProto)</Text>
          <Text style={styles.addressText}>Status: {isConnected ? 'Online' : 'Offline'}</Text>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  scrollContent: { paddingVertical: 20 },
  content: { flex: 1, padding: 16, gap: 20 },
  card: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: C.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  hintText: {
    fontSize: 14,
    textAlign: 'center',
    color: C.muted,
    lineHeight: 20,
    marginBottom: 10,
  },
  centerFlow: { alignItems: 'center', width: '100%', paddingVertical: 20 },
  successBadge: { marginBottom: 20 },
  errorBadge: { marginBottom: 20, opacity: 0.5 },
  retryBtn: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    opacity: 0.7,
    padding: 10,
  },
  infoBox: {
    padding: 16,
    backgroundColor: C.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
  },
  infoTitle: { color: C.muted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 8 },
  addressText: { color: C.muted, fontSize: 12, fontFamily: 'monospace', marginBottom: 4 },
});
