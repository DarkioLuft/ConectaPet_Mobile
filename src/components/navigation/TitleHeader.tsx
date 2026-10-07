import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TitleHeaderProps {
    title: string,
    showButtonBack?: boolean,
    icon?: string,
    onPressBackButton: () => void
}

export function TitleHeader({ title, showButtonBack = true, icon, onPressBackButton }: TitleHeaderProps) {
    return (
        <View style={styles.header}>
            {showButtonBack && (
                <TouchableOpacity
                    style={styles.icon}
                    onPress={() => onPressBackButton()}
                >
                    <Ionicons name='arrow-back' size={20} color={colors.white} style={styles.icon} />
                </TouchableOpacity>
            )}
            {icon && (
                <Ionicons name={icon as any} size={24} color={colors.white} style={styles.icon} />
            )}

            <Text style={styles.title}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: colors.primary[600],
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        flexDirection: 'row',
        alignItems: 'center'
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.white,
        letterSpacing: -0.5,
    }
});