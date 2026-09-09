import { borderRadius } from '@/constants/borderRadius';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { styles } from '@/constants/styles';
import { StyleSheet, Text, View } from 'react-native';
import { BaseToastProps, ToastConfig } from 'react-native-toast-message';

export const toastConfig: ToastConfig = {
        success: ({ text1, text2 }: BaseToastProps) => (
                <View style={[stylesLocal.toastContainer, stylesLocal.successBorder]}>
                        <View style={stylesLocal.content}>
                                {text1 && <Text style={stylesLocal.title}>{text1}</Text>}
                                {text2 && <Text style={stylesLocal.description}>{text2}</Text>}
                        </View>
                </View>
        ),
        error: ({ text1, text2 }: BaseToastProps) => (
                <View style={[stylesLocal.toastContainer, stylesLocal.errorBorder, styles.shadow]}>
                        <View style={stylesLocal.content}>
                                {text1 && <Text style={stylesLocal.title}>{text1}</Text>}
                                {text2 && <Text style={stylesLocal.description}>{text2}</Text>}
                        </View>
                </View>
        ),
        info: ({ text1, text2 }: BaseToastProps) => (
                <View style={[stylesLocal.toastContainer, stylesLocal.infoBorder]}>
                        <View style={stylesLocal.content}>
                                {text1 && <Text style={stylesLocal.title}>{text1}</Text>}
                                {text2 && <Text style={stylesLocal.description}>{text2}</Text>}
                        </View>
                </View>
        ),
};

const stylesLocal = StyleSheet.create({
        toastContainer: {
                width: '90%',
                backgroundColor: colors.surface,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                borderLeftWidth: 5,
        },

        successBorder: { borderLeftColor: colors.success },
        errorBorder: { borderLeftColor: colors.danger },
        infoBorder: { borderLeftColor: colors.info },

        content: { justifyContent: 'center' },
        title: {
                fontSize: 15,
                fontWeight: 'bold',
                color: colors.text
        },
        description: {
                fontSize: 13,
                color: colors.textLight,
                marginTop: 2
        },
});