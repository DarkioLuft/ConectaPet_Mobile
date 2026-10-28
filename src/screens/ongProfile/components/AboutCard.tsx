import { colors } from "@/constants/colors";
import { styles } from "@/constants/styles";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function AboutCard({ about }: { about: string }) {
    const [expanded, setExpanded] = useState(false);

    if (!about) return null;

    const isLargeText = about.length >= 150;

    return (
        <View style={localStyles.section}>
            <Text style={localStyles.sectionTitle}>Quem Somos</Text>
            <View style={[styles.card, styles.shadow]}>
                <Text style={localStyles.text} numberOfLines={expanded ? undefined : 10}>
                    {about}
                </Text>
                {isLargeText && (
                    <TouchableOpacity
                        style={localStyles.readMoreButton}
                        onPress={() => setExpanded(!expanded)}
                        activeOpacity={0.7}
                    >
                        <Text style={localStyles.readMoreText}>
                            {expanded ? 'Ver menos' : 'Ler mais...'}
                        </Text>
                    </TouchableOpacity>
                )}

            </View>
        </View>
    );
}

const localStyles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
        gap: 24,
    },
    section: {
        gap: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.neutral[800],
    },
    text: {
        fontSize: 14,
        color: colors.neutral[600],
        lineHeight: 22
    },
    readMoreButton: {
        marginTop: 8,
        alignSelf: 'flex-start',
    },
    readMoreText: {
        color: colors.primary[500],
        fontWeight: '700',
        fontSize: 14,
    }
});