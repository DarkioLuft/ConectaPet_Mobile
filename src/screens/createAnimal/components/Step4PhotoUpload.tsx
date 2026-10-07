import { ImagePreviewContainer } from '@/components/ui/ImagePreviewContainer';
import { colors } from '@/constants/colors';
import {
  AGE_GROUP_LABELS,
  ENERGY_LABELS,
  SEX_LABELS,
  SIZE_LABELS,
  SPECIES_LABELS,
} from '@/constants/enums';
import { AnyAnimalForm } from '@/types/animal.types';
import { PhotoInterface } from '@/utils/photoUtils';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SummaryRow } from './SummaryRow';

interface Step4PhotoUploadProps {
  data: AnyAnimalForm;
  onTakePhoto: () => Promise<PhotoInterface | undefined>;
  onPickGallery: () => Promise<PhotoInterface | undefined>;
  onRemovePhoto: () => void;
  onUpdatePhoto: (photoData: PhotoInterface) => void;
}

export function Step4PhotoUpload({
  data,
  onTakePhoto,
  onPickGallery,
  onRemovePhoto,
  onUpdatePhoto
}: Step4PhotoUploadProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Imagem e Confirmação</Text>

      {/* Área de Preview da Foto */}
      <ImagePreviewContainer
        photoUri={data.photoUri || null}
        onTakePhoto={onTakePhoto}
        onPickGallery={onPickGallery}
        onRemovePhoto={onRemovePhoto}
        onUpdatePhoto={onUpdatePhoto}
      />

      {/* Card de Resumo dos Dados */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>Resumo do Cadastro</Text>
        </View>

        <View style={styles.divider} />

        <SummaryRow label="Nome"
          value={data.name}
        />
        <SummaryRow
          label="Espécie"
          value={data.species ? SPECIES_LABELS[data.species] : null}
        />
        <SummaryRow
          label="Sexo"
          value={data.sex ? SEX_LABELS[data.sex] : null}
        />
        <SummaryRow
          label="Porte"
          value={data.size ? SIZE_LABELS[data.size] : null}
        />
        <SummaryRow
          label="Faixa Etária"
          value={data.age_group ? AGE_GROUP_LABELS[data.age_group] : null}
        />
        <SummaryRow
          label="Nível de Energia"
          value={data.energy ? ENERGY_LABELS[data.energy] : null}
        />

        <SummaryRow
          label="Saúde"
          value={
            data.is_neutered ? data.is_vaccinated ? 'Castrado - Vacinado' : 'Castrado - Não Vacinado' :
              data.is_vaccinated ? 'Não Castrado - Vacinado' : 'Não Castrado - Não Vacinado'}
        />

        <SummaryRow
          label="Adaptação"
          value={
            data.apartment_friendly ? 'Aceita Apartamento' : 'Não Aceita Ap.'
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.neutral[800],
  },
  // Card de Resumo
  summaryCard: {
    marginTop: 24,
    padding: 18,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.neutral[800],
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral[200],
    marginVertical: 14,
  },
});