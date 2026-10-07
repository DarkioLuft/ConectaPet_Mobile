import { colors } from "@/constants/colors";
import { StyleSheet, Text, View } from "react-native";

interface SummaryRowProps {
    label: string;
    value?: string | null;
    children?: React.ReactNode;
}

export function SummaryRow({ label, value, children }: SummaryRowProps) {
    return (
        <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{label}</Text>
            {children ? (
                <View style={styles.summaryValueContainer}>{children}</View>
            ) : (
                <Text style={styles.summaryValue}>{value || '-'}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    summaryLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.neutral[600],
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.neutral[800],
    },
    summaryValueContainer: {
        flexDirection: 'row',
        gap: 6,
        flexWrap: 'wrap',
    }
});