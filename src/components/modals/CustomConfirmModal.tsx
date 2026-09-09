import { borderRadius } from '@/constants/borderRadius';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Tipagem das opções
export interface AppConfirmModalOptions {
        title: string;
        message: string;
        onConfirm: () => void | Promise<void>;
        confirmText?: string;
        cancelText?: string;
        isDestructive?: boolean;
}

// Referência global
export const confirmModalRef = React.createRef<any>();

export const AppConfirm = {
        show: (options: AppConfirmModalOptions) => confirmModalRef.current?.show(options),
        hide: () => confirmModalRef.current?.hide(),
};

export const ConfirmModal = forwardRef((_, ref) => {
        const [config, setConfig] = useState<AppConfirmModalOptions | null>(null);
        const [isLoading, setIsLoading] = useState(false);

        // Expõe a função de show/hide para a referência global
        useImperativeHandle(ref, () => ({
                show: (options: AppConfirmModalOptions) => setConfig(options),
                hide: () => setConfig(null),
        }));

        const handleConfirm = async () => {
                if (!config) return;
                setIsLoading(true);
                try {
                        await config.onConfirm(); // Aguarda a ação terminar
                } finally {
                        setIsLoading(false);
                        setConfig(null);
                }
        };

        if (!config) return null;

        return (
                <Modal visible={true} transparent={true} animationType="fade" onRequestClose={() => setConfig(null)}>
                        <View style={styles.overlay}>
                                <View style={styles.alertBox}>
                                        <Text style={styles.title}>{config.title}</Text>
                                        <Text style={styles.message}>{config.message}</Text>

                                        <View style={styles.buttonRow}>
                                                <TouchableOpacity
                                                        style={[styles.button, styles.cancelButton]}
                                                        onPress={() => setConfig(null)}
                                                        disabled={isLoading}
                                                >
                                                        <Text style={styles.cancelButtonText}>{config.cancelText || 'Cancelar'}</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                        style={[
                                                                styles.button,
                                                                config.isDestructive ? styles.destructiveButton : styles.confirmButton
                                                        ]}
                                                        onPress={handleConfirm}
                                                        disabled={isLoading}
                                                >
                                                        {isLoading ? (
                                                                <ActivityIndicator color={colors.surface} size="small" />
                                                        ) : (
                                                                <Text style={styles.confirmButtonText}>{config.confirmText || 'Sim'}</Text>
                                                        )}
                                                </TouchableOpacity>
                                        </View>
                                </View>
                        </View>
                </Modal>
        );
});

const styles = StyleSheet.create({
        overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
        alertBox: { width: '100%', backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.lg, elevation: 5 },
        title: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: spacing.sm },
        message: { fontSize: 16, color: colors.textLight, marginBottom: spacing.lg, lineHeight: 22 },
        buttonRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.md },
        button: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: borderRadius.md, minWidth: 120, alignItems: 'center' },
        cancelButton: { backgroundColor: 'transparent' },
        cancelButtonText: { color: colors.textLight, fontSize: 16, fontWeight: '600' },
        confirmButton: { backgroundColor: colors.primary },
        destructiveButton: { backgroundColor: colors.danger },
        confirmButtonText: { color: colors.surface, fontSize: 16, fontWeight: 'bold' },
});