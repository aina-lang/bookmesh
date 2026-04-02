import React, { useState, useEffect, useCallback } from 'react';
import {
  View, FlatList, StyleSheet, Text, TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Storage, PeerInfo } from '@/core/storage/storage';
import { Colors } from '@/constants/theme';
import { Wifi, QrCode, Users, Eye } from 'lucide-react-native';
import { Link, useRouter } from 'expo-router';


const C = Colors.dark;

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}min`;
  return `${Math.floor(m / 60)}h`;
}

export default function PeersScreen() {
  const [peers, setPeers] = useState<PeerInfo[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [connectedCount, setConnectedCount] = useState(0);



  const renderItem = ({ item }: { item: PeerInfo }) => {
    const isOnline = Date.now() - item.lastSeen < 60_000;
    return (
      <View style={styles.card}>
        <View style={[styles.icon, { backgroundColor: isOnline ? C.success + '22' : C.border }]}>
          <Wifi size={20} color={isOnline ? C.success : C.muted} />
        </View>
        <View style={styles.info}>
          <Text style={styles.peerId} numberOfLines={1}>
            {item.id.substring(0, 24)}…
          </Text>
          <Text style={styles.addr} numberOfLines={1}>
            {item.multiaddrs[0] ?? 'No address'}
          </Text>
          <View style={styles.row}>
            <View style={[styles.pill, { backgroundColor: isOnline ? C.success + '22' : C.border }]}>
              <Text style={{ color: isOnline ? C.success : C.muted, fontSize: 10, fontWeight: '700' }}>
                {isOnline ? '● EN LIGNE' : `Vu il y a ${timeAgo(item.lastSeen)}`}
              </Text>
            </View>
            {item.bookCount != null && (
              <Text style={styles.bookCount}>{item.bookCount} livres</Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* My node info */}
      <View style={styles.myNodeCard}>
        <View style={styles.myNodeLeft}>
          <View style={[styles.icon, { backgroundColor: C.tint + '22' }]}>
            <Users size={20} color={C.tint} />
          </View>
        
        </View>
       
      </View>

    
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  myNodeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 12,
    padding: 14,
    backgroundColor: C.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
  },
  myNodeLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  myNodeLabel: { color: C.muted, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  myNodeId: { color: C.text, fontSize: 12, fontWeight: '600', marginTop: 2, maxWidth: 150 },
  myIdBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: C.tint + '15',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.tint + '33',
  },
  myIdBtnText: { color: C.tint, fontSize: 11, fontWeight: '700' },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { color: C.muted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  scanHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: C.tint + '15',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  scanHeaderText: { color: C.tint, fontSize: 11, fontWeight: '700' },
  card: {
    flexDirection: 'row',
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
  },
  icon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  info: { flex: 1 },
  peerId: { color: C.text, fontSize: 13, fontWeight: '600' },
  addr: { color: C.muted, fontSize: 11, marginTop: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  pill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  bookCount: { color: C.muted, fontSize: 10 },
  empty: { marginTop: 80, alignItems: 'center', gap: 12 },
  emptyTitle: { color: C.text, fontSize: 17, fontWeight: 'bold' },
  emptySubtitle: { color: C.muted, fontSize: 13, textAlign: 'center', paddingHorizontal: 32 },
  connectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.tint,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  connectText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
