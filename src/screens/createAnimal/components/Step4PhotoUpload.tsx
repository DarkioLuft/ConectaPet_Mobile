// Etapa 4: Seleção da foto de capa (câmera ou galeria) e resumo final dos dados.

import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  AGE_GROUP_LABELS,
  ENERGY_LABELS,
  SEX_LABELS,
  SIZE_LABELS,
  SPECIES_LABELS,
} from '../../../constants/enums';
import { CreateAnimalFormData } from '../types/createAnimal.types';

interface Step4PhotoUploadProps {
  data: CreateAnimalFormData;
  onTakePhoto: () => void;
  onPickGallery: () => void;
  onRemovePhoto: () => void;
}

export function Step4PhotoUpload({
  data,
  onTakePhoto,
  onPickGallery,
  onRemovePhoto,
}: Step4PhotoUploadProps) {
  return (
    <View>
      <Text style={styles.sectionTitle}>Imagem de Capa</Text>

      <View style={styles.buttonsRow}>
        <TouchableOpacity
          onPress={onTakePhoto}
          activeOpacity={0.7}
          style={styles.actionButton}
        >
          <Text style={styles.actionButtonText}>Tirar Foto</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onPickGallery}
          activeOpacity={0.7}
          style={styles.actionButton}
        >
          <Text style={styles.actionButtonText}>Escolher da Galeria</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imagePreviewBox}>
        {data.photoUri ? (
          <Image
            source={{ uri: data.photoUri }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.emptyText}>Nenhuma imagem anexada</Text>
        )}
      </View>

      {data.photoUri && (
        <TouchableOpacity
          onPress={onRemovePhoto}
          activeOpacity={0.7}
          style={styles.removeButton}
        >
          <Text style={styles.removeButtonText}>Remover Imagem</Text>
        </TouchableOpacity>
      )}

      {/* Resumo dos Dados */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Resumo dos Dados</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Nome: </Text>
          <Text style={styles.summaryValue}>{data.name || '-'}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Espécie: </Text>
          <Text style={styles.summaryValue}>
            {data.species ? SPECIES_LABELS[data.species] : '-'}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Sexo: </Text>
          <Text style={styles.summaryValue}>
            {data.sex ? SEX_LABELS[data.sex] : '-'}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Porte: </Text>
          <Text style={styles.summaryValue}>
            {data.size ? SIZE_LABELS[data.size] : '-'}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Faixa Etária: </Text>
          <Text style={styles.summaryValue}>
            {data.age_group ? AGE_GROUP_LABELS[data.age_group] : '-'}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Energia: </Text>
          <Text style={styles.summaryValue}>
            {data.energy ? ENERGY_LABELS[data.energy] : '-'}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Castrado / Vacinado: </Text>
          <Text style={styles.summaryValue}>
            {data.is_neutered === null ? '-' : data.is_neutered ? 'Sim' : 'Não'} /{' '}
            {data.is_vaccinated === null ? '-' : data.is_vaccinated ? 'Sim' : 'Não'}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Apartamento: </Text>
          <Text style={styles.summaryValue}>
            {data.apartment_friendly === null ? '-' : data.apartment_friendly ? 'Sim' : 'Não'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  imagePreviewBox: {
    width: '100%',
    height: 180,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  removeButton: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  removeButtonText: {
    color: '#dc2626',
    fontWeight: '600',
    fontSize: 14,
  },
  summaryCard: {
    marginTop: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
  summaryValue: {
    fontSize: 14,
    color: '#374151',
  },
});