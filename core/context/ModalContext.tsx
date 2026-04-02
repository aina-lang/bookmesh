import React, { createContext, useContext, useState, useCallback } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { CheckCircle, AlertCircle, Info, Trash2, X } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

const C = Colors.dark;

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

  const showModal = useCallback((opts: ModalOptions) => {
    setOptions(opts);
    setVisible(true);
  }, []);

  const hideModal = useCallback(() => {
    setVisible(false);
    // Don't clear options immediately to allow exit animation
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
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          ) : (
            <Animated.View 
              entering={FadeIn} 
              exiting={FadeOut} 
              style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.7)' }]} 
            />
          )}
          
          {options && (
            <Animated.View 
              entering={ZoomIn.springify()} 
              exiting={ZoomOut}
              style={styles.modalContainer}
            >
              <View style={styles.header}>
                <ModalIcon type={options.type || 'info'} />
                <TouchableOpacity onPress={hideModal} style={styles.closeBtn}>
                  <X size={20} color={C.muted} />
                </TouchableOpacity>
              </View>

              <Text style={styles.title}>{options.title}</Text>
              <Text style={styles.message}>{options.message}</Text>

              <View style={styles.footer}>
                {(options.type === 'confirm' || options.type === 'delete' || options.onCancel) && (
                  <TouchableOpacity 
                    style={[styles.btn, styles.cancelBtn]} 
                    onPress={handleCancel}
                  >
                    <Text style={styles.cancelBtnText}>{options.cancelText || 'Annuler'}</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  style={[
                    styles.btn, 
                    options.type === 'delete' ? styles.deleteBtn : styles.confirmBtn
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

const ModalIcon = ({ type }: { type: ModalType }) => {
  switch (type) {
    case 'success': return <CheckCircle size={40} color={C.success} />;
    case 'error': return <AlertCircle size={40} color={C.error} />;
    case 'delete': return <Trash2 size={40} color={C.error} />;
    case 'confirm': return <Info size={40} color={C.tint} />;
    default: return <Info size={40} color={C.tint} />;
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
    backgroundColor: C.card,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
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
    color: C.text,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    color: C.muted,
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
    backgroundColor: C.tint,
  },
  deleteBtn: {
    backgroundColor: C.error,
  },
  cancelBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: C.border,
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelBtnText: {
    color: C.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
