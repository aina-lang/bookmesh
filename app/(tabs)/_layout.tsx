import { useTheme } from '@/core/context/ThemeContext';
import { DownloadStore } from '@/core/store/downloadStore';
import { BlurView } from 'expo-blur';
import { Tabs, useRouter } from 'expo-router';
import { Globe, Plus, Library } from 'lucide-react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, StyleSheet, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useModal } from '@/core/context/ModalContext';
import { useTranslation } from '@/core/i18n/I18nContext';
import { UploadStore } from '@/core/store/uploadStore';
import { Upload } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSequence,
  Easing,
  interpolate
} from 'react-native-reanimated';

const ORANGE = '#f97316';
const BAR_BOTTOM = 16;
const BAR_HEIGHT = 64;
// FAB est centré horizontalement, positionné au-dessus de la tab bar
const FAB_SIZE = 70;
const FAB_BOTTOM = BAR_BOTTOM + 30;

/* ─── Badge ─── */
function DownloadBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    DownloadStore.init();
    const update = () =>
      setCount(DownloadStore.getAll().filter(d => d.status === 'downloading' || d.status === 'pending').length);
    update();
    return DownloadStore.subscribe(update);
  }, []);

  if (count === 0) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count}</Text>
    </View>
  );
}

/* ─── Tab Icon ─── */
function TabIcon({ focused, icon, label, color }: { focused: boolean; icon: React.ReactNode; label: string; color: string }) {
  return (
    <View style={styles.tabIconWrapper}>
      {icon}
      <Text style={[styles.tabLabel, { color: focused ? ORANGE : color }]}>
        {label}
      </Text>
    </View>
  );
}

/* ─── FAB ─── */
function FAB({ onDefaultPress }: { onDefaultPress: () => void }) {
  const { colors, theme } = useTheme();
  const router = useRouter();
  
  const [isUploading, setIsUploading] = useState(UploadStore.getIsUploading());
  const [progress, setProgress] = useState(UploadStore.getProgress());

  useEffect(() => {
    return UploadStore.subscribe(() => {
      setIsUploading(UploadStore.getIsUploading());
      setProgress(UploadStore.getProgress());
    });
  }, []);

  const waveAnim = useSharedValue(0);

  useEffect(() => {
    if (isUploading) {
      waveAnim.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      waveAnim.value = 0;
    }
  }, [isUploading]);

  const animatedWaveStyle = useAnimatedStyle(() => {
    const translateY = interpolate(progress, [0, 1], [FAB_SIZE, 0]);
    return {
      top: translateY,
      opacity: isUploading ? 1 : 0,
    };
  });

  const handlePress = () => {
    if (isUploading) {
      const params = UploadStore.getParams();
      if (params) {
        router.push({
          pathname: '/upload-form',
          params
        });
      }
    } else {
      onDefaultPress();
    }
  };

  const FABContent = ({ color, showSpinner }: { color: string; showSpinner: boolean }) => (
    <View style={{ alignItems: 'center', justifyContent: 'center', height: FAB_SIZE, width: FAB_SIZE }}>
      {showSpinner ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <>
          <Upload size={22} color={color} strokeWidth={2.5} />
          <Text style={{ color, fontSize: 10, fontWeight: '900', marginTop: 1 }}>
            {Math.round(progress * 100)}%
          </Text>
        </>
      )}
    </View>
  );

  const animatedWavePulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: interpolate(waveAnim.value, [0, 1], [1, 2.5]) }],
      opacity: interpolate(waveAnim.value, [0, 0.5, 1], [0, 0.4, 0]),
    };
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.85}
      style={[styles.fab, { backgroundColor: isUploading ? colors.card : ORANGE, overflow: 'hidden' }]}
    >
      {/* Wave Pulse */}
      {isUploading && (
        <Animated.View 
          style={[
            {
              position: 'absolute',
              width: FAB_SIZE,
              height: FAB_SIZE,
              borderRadius: FAB_SIZE / 2,
              backgroundColor: ORANGE,
            },
            animatedWavePulseStyle
          ]}
        />
      )}
      
      {isUploading ? (
        <View style={{ width: FAB_SIZE, height: FAB_SIZE, borderRadius: FAB_SIZE / 2, overflow: 'hidden' }}>
          {/* Base Layer: Orange Text */}
          <FABContent color={ORANGE} showSpinner={progress >= 1} />

          {/* Progress Layer: White Text, Clipped by Wave */}
          <Animated.View 
            style={[
              {
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: ORANGE,
                overflow: 'hidden',
              },
              animatedWaveStyle
            ]}
          >
            {/* We offset this back to keep it centered in the FAB */}
            <View style={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0,
              width: FAB_SIZE,
              height: FAB_SIZE 
            }}>
               <FABContent color="#fff" showSpinner={progress >= 1} />
            </View>
          </Animated.View>
        </View>
      ) : (
        <Plus size={26} color="#fff" strokeWidth={2.5} />
      )}
    </TouchableOpacity>
  );
}

/* ─── Layout ─── */
export default function TabLayout() {
  const { isDark, colors } = useTheme();
  const { showModal } = useModal();
  const { t } = useTranslation();
  const router = useRouter();

  const importBook = useCallback(async () => {
    try {
      const allowedTypes = [
        'application/pdf',
        'application/epub+zip',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ];

      const result = await DocumentPicker.getDocumentAsync({ 
        type: allowedTypes, 
        copyToCacheDirectory: true 
      });

      if (!result.canceled && result.assets?.length > 0) {
        const file = result.assets[0];
        const extension = file.name.split('.').pop()?.toLowerCase();
        const validExtensions = ['pdf', 'epub', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];

        if (extension && validExtensions.includes(extension)) {
          router.push({ 
            pathname: '/upload-form', 
            params: { uri: file.uri, name: file.name, size: file.size ? file.size.toString() : '0' } 
          });
        } else {
          showModal({ 
            type: 'error', 
            title: t('upload.errorTitle'), 
            message: t('upload.invalidFileType') || 'Seuls les fichiers PDF, EPUB et Office sont acceptés.' 
          });
        }
      }
    } catch {
      showModal({ type: 'error', title: t('upload.importErrorTitle'), message: t('upload.importError') });
    }
  }, [router, showModal, t]);

  const barBg = isDark ? 'rgba(18,18,28,0.97)' : 'rgba(255,255,255,0.97)';

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: ORANGE,
          tabBarInactiveTintColor: colors.textDim,
          tabBarStyle: {
            position: 'absolute',
            bottom: BAR_BOTTOM,
            left: 16,
            right: 16,
            height: BAR_HEIGHT,
            borderRadius: 20,
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.12,
                shadowRadius: 16,
              },
            }),
          },
          tabBarBackground: () => (
            <View style={[ styles.barBg, { backgroundColor: barBg }]}>
              <BlurView intensity={60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
            </View>
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                focused={focused} color={color} label={t('tabs.explorer')}
                icon={<Globe size={20} color={focused ? ORANGE : color} strokeWidth={focused ? 2.5 : 2} />}
              />
            ),
          }}
        />

        {/* Onglet upload masqué — remplacé par le FAB */}
        <Tabs.Screen name="upload" options={{ href: null }} />

        <Tabs.Screen
          name="downloads"
          options={{
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                focused={focused} color={color} label={t('tabs.library')}
                icon={
                  <View>
                    <Library size={20} color={focused ? ORANGE : color} strokeWidth={focused ? 2.5 : 2} />
                    <DownloadBadge />
                  </View>
                }
              />
            ),
          }}
        />
      </Tabs>

      {/* FAB centré au-dessus de la tab bar */}
      <FAB onDefaultPress={importBook} />
    </View>
  );
}

const styles = StyleSheet.create({
  barBg: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(128,128,128,0.15)',
    width: '90%',
    height: '100%',
    marginHorizontal:"auto",
 elevation: 10,
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.12,
                shadowRadius: 16,
              },
            }),
  },
  tabIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingTop: 20,
    overflow: 'visible',
    width:100
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
    textAlign: 'center',
    flexShrink: 0,
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -6,
    backgroundColor: ORANGE,
    borderRadius: 8,
    minWidth: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#fff',
  },
  fab: {
    position: 'absolute',
    bottom: FAB_BOTTOM,
    alignSelf: 'center',
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: ORANGE,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.45,
        shadowRadius: 12,
      },
      android: { elevation: 10 },
    }),
  },
});