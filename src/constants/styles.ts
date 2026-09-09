import { borderRadius } from "./borderRadius";
import { colors } from "./colors";
import { spacing } from "./spacing";

export const styles = {
    container: { flex: 1, backgroundColor: colors.background },
    content: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
    shadow: { shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
    card: { backgroundColor: colors.surface, borderRadius: borderRadius.xxl, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.03)', } as const,
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 16 } as const,
    selectorRow: { flexDirection: 'row', gap: 12, marginBottom: 20 } as const,
    inputLabel: { fontSize: 13, color: colors.textLight, marginBottom: 6, textTransform: 'uppercase' } as const,
    inputRow: { flexDirection: 'row', gap: 8, marginTop: 8 } as const,
    inputGroup: { paddingVertical: 4 } as const,
    placeholder: { fontSize: 16, color: colors.placeholder, paddingVertical: 6 } as const,
    divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.05)', marginVertical: borderRadius.md - borderRadius.sm } as const,
    title: { fontSize: 32, fontWeight: 'bold', color: colors.primary, marginBottom: spacing.lg } as const,
};