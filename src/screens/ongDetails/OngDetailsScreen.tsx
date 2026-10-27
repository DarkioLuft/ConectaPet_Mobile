import { styles } from "@/constants/styles";
import { SafeAreaView } from 'react-native-safe-area-context';

interface OngDetailsScreenProps {
    ongId: String,
}

export function OngDetailsScreen({ ongId }: OngDetailsScreenProps) {
    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            
        </SafeAreaView>
    )
}