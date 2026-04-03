import React, { createContext, useContext, useState, useCallback } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from 'react-native-reanimated';
import { useTheme } from '@/core/context/ThemeContext';
import { CheckCircle, AlertCircle, Info, Trash2, X } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

type ModalType = 'success' | 'error' | 'info' | 'confirm' | 'delete';

interface ModalOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  type?: ModalType;
}

interface ModalContextType {
  showModal: (options: ModalOptions) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<ModalOptions | null>(null);
  const { colors, isDark } = useTheme();

  const showModal = useCallback((opts: ModalOptions) => {
    setOptions(opts);
    setVisible(true);
  }, []);

  const hideModal = useCallback(() => {
    setVisible(false);
  }, []);

  const handleConfirm = () => {
    options?.onConfirm?.();
    hideModal();
  };

  const handleCancel = () => {
    options?.onCancel?.();
    hideModal();
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <Modal
        transparent
        visible={visible}
        animationType="none"
        onRequestClose={hideModal}
      >
        <View style={styles.overlay}>
          {Platform.OS === 'ios' ? (
            <BlurView intensity={20} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
          ) : (
            <Animated.View 
              entering={FadeIn} 
              exiting={FadeOut} 
              style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)' }]} 
            />
          )}
          
          {options && (
            <Animated.View 
              entering={ZoomIn.springify()} 
              exiting={ZoomOut}
              style={[
                styles.modalContainer, 
                { 
                  backgroundColor: colors.card, 
                  borderColor: colors.border,
                  shadowOpacity: isDark ? 0.5 : 0.1,
                }
              ]}
            >
              <View style={styles.header}>
                <ModalIcon type={options.type || 'info'} colors={colors} />
                <TouchableOpacity onPress={hideModal} style={styles.closeBtn}>
                  <X size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.title, { color: colors.text }]}>{options.title}</Text>
              <Text style={[styles.message, { color: colors.textDim }]}>{options.message}</Text>

              <View style={styles.footer}>
                {(options.type === 'confirm' || options.type === 'delete' || options.onCancel) && (
                  <TouchableOpacity 
                    style={[styles.btn, styles.cancelBtn, { borderColor: colors.border }]} 
                    onPress={handleCancel}
                  >
                    <Text style={[styles.cancelBtnText, { color: colors.text }]}>{options.cancelText || 'Annuler'}</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  style={[
                    styles.btn, 
                    options.type === 'delete' ? styles.deleteBtn : styles.confirmBtn,
                    { backgroundColor: options.type === 'delete' ? colors.error : colors.primary }
                  ]} 
                  onPress={handleConfirm}
                >
                  <Text style={styles.confirmBtnText}>
                    {options.confirmText || (options.type === 'delete' ? 'Supprimer' : 'OK')}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        </View>
      </Modal>
    </ModalContext.Provider>
  );
};

const ModalIcon = ({ type, colors }: { type: ModalType, colors: any }) => {
  switch (type) {
    case 'success': return <CheckCircle size={40} color={colors.success} />;
    case 'error': return <AlertCircle size={40} color={colors.error} />;
    case 'delete': return <Trash2 size={40} color={colors.error} />;
    case 'confirm': return <Info size={40} color={colors.primary} />;
    default: return <Info size={40} color={colors.primary} />;
  }
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within a ModalProvider');
  return context;
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    right: -10,
    top: -10,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 30,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  btn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtn: {
    // Background via dynamic style
  },
  deleteBtn: {
    // Background via dynamic style
  },
  cancelBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
