import { animalService } from '@/services/animalService';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface FormState {
  name: string;
  species: 'dog' | 'cat' | 'other' | null;
  sex: 'male' | 'female' | null;
  size: 'small' | 'medium' | 'large' | null;
  age_group: 'puppy' | 'young' | 'adult' | 'senior' | null;
  age_years?: number;
  weight_kg?: number;
  color?: string;
  description?: string;
  is_vaccinated: boolean | null;
  is_neutered: boolean | null;
  is_dewormed: boolean | null;
  has_microchip: boolean | null;
  energy: 'low' | 'medium' | 'high' | null;
  good_with_kids: boolean | null;
  good_with_dogs: boolean | null;
  good_with_cats: boolean | null;
  apartment_friendly: boolean | null;
  special_needs: boolean | null;
  special_needs_desc?: string;
  localImageUri?: string;
}

const initialFormState: FormState = {
  name: '',
  species: null,
  sex: null,
  size: null,
  age_group: null,
  age_years: undefined,
  weight_kg: undefined,
  color: '',
  description: '',
  is_vaccinated: null,
  is_neutered: null,
  is_dewormed: null,
  has_microchip: null,
  energy: null,
  good_with_kids: null,
  good_with_dogs: null,
  good_with_cats: null,
  apartment_friendly: null,
  special_needs: null,
  special_needs_desc: '',
  localImageUri: undefined,
};

export function CreateAnimalScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormState>(initialFormState);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  // Abertura da Câmera
  async function handleTakePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão Negada', 'É necessário autorizar o uso da câmera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      updateField('localImageUri', result.assets[0].uri);
    }
  }

  // Abertura da Galeria
  async function handlePickGallery() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão Negada', 'É necessário autorizar o acesso à galeria de fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      updateField('localImageUri', result.assets[0].uri);
    }
  }

  function handleNextStep() {
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        Alert.alert('Campo Obrigatório', 'Informe o nome do pet.');
        return;
      }
      if (!formData.species) {
        Alert.alert('Campo Obrigatório', 'Selecione a espécie.');
        return;
      }
      if (!formData.sex) {
        Alert.alert('Campo Obrigatório', 'Selecione o sexo.');
        return;
      }
      if (!formData.size) {
        Alert.alert('Campo Obrigatório', 'Selecione o porte do animal.');
        return;
      }
      if (!formData.age_group) {
        Alert.alert('Campo Obrigatório', 'Selecione a faixa etária.');
        return;
      }
    }

    if (currentStep === 2) {
      if (
        formData.is_vaccinated === null ||
        formData.is_neutered === null ||
        formData.is_dewormed === null ||
        formData.has_microchip === null
      ) {
        Alert.alert('Campos Obrigatórios', 'Responda a todas as perguntas de controle sanitário.');
        return;
      }
    }

    if (currentStep === 3) {
      if (!formData.energy) {
        Alert.alert('Campo Obrigatório', 'Selecione o nível de energia.');
        return;
      }
      if (
        formData.good_with_kids === null ||
        formData.good_with_dogs === null ||
        formData.good_with_cats === null ||
        formData.apartment_friendly === null ||
        formData.special_needs === null
      ) {
        Alert.alert('Campos Obrigatórios', 'Responda a todas as opções de convivência.');
        return;
      }
      if (formData.special_needs && !formData.special_needs_desc?.trim()) {
        Alert.alert('Campo Obrigatório', 'Descreva as necessidades especiais do pet.');
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 4));
  }

  function handlePrevStep() {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }

  async function handleSubmit() {
    try {
      setLoading(true);
      let uploadedCoverUrl: string | undefined = undefined;

      // Realiza o upload da imagem selecionada para o Storage se houver arquivo local
      if (formData.localImageUri) {
        uploadedCoverUrl = await animalService.uploadAnimalPhoto(
          formData.localImageUri,
          formData.name.trim()
        );
      }

      await animalService.createAnimal({
        name: formData.name.trim(),
        species: formData.species!,
        sex: formData.sex!,
        size: formData.size!,
        age_group: formData.age_group!,
        age_years: formData.age_years,
        weight_kg: formData.weight_kg,
        color: formData.color?.trim() || undefined,
        description: formData.description?.trim() || undefined,
        is_vaccinated: formData.is_vaccinated!,
        is_neutered: formData.is_neutered!,
        is_dewormed: formData.is_dewormed!,
        has_microchip: formData.has_microchip!,
        energy: formData.energy!,
        good_with_kids: formData.good_with_kids!,
        good_with_dogs: formData.good_with_dogs!,
        good_with_cats: formData.good_with_cats!,
        apartment_friendly: formData.apartment_friendly!,
        special_needs: formData.special_needs!,
        special_needs_desc: formData.special_needs ? formData.special_needs_desc?.trim() : undefined,
        cover_photo_url: uploadedCoverUrl,
      });

      Alert.alert('Sucesso', 'Animal cadastrado com sucesso no sistema.');
      setFormData(initialFormState);
      setCurrentStep(1);
    } catch (err: any) {
      console.log(err);
      Alert.alert('Erro ao Salvar', err.message || 'Falha ao registrar o pet.');
    } finally {
      setLoading(false);
    }
  }

  const BinaryChoice = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: boolean | null;
    onChange: (val: boolean) => void;
  }) => (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <View style={styles.toggleButtons}>
        <TouchableOpacity
          onPress={() => onChange(true)}
          style={[styles.toggleBtn, value === true && styles.toggleBtnActive]}
        >
          <Text style={[styles.toggleBtnText, value === true && styles.toggleBtnTextActive]}>
            Sim
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onChange(false)}
          style={[styles.toggleBtn, value === false && styles.toggleBtnActive]}
        >
          <Text style={[styles.toggleBtnText, value === false && styles.toggleBtnTextActive]}>
            Não
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: '#ffffff', marginBottom: 70 }}
    >
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Barra de Progresso */}
        <View style={styles.progressContainer}>
          <View style={styles.stepLabelsRow}>
            <Text style={styles.stepIndicatorText}>ETAPA {currentStep} DE 4</Text>
            <Text style={styles.stepCategoryText}>
              {currentStep === 1 && 'Identificação'}
              {currentStep === 2 && 'Características e Saúde'}
              {currentStep === 3 && 'Preferências de Convivência'}
              {currentStep === 4 && 'Imagem e Confirmação'}
            </Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${(currentStep / 4) * 100}%` }]} />
          </View>
        </View>

        {/* ETAPA 1: Identificação */}
        {currentStep === 1 && (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Identificação Básica</Text>

            <Text style={styles.label}>Nome do Pet *</Text>
            <TextInput
              value={formData.name}
              onChangeText={(text) => updateField('name', text)}
              style={styles.input}
            />

            <Text style={styles.label}>Espécie *</Text>
            <View style={styles.row}>
              {[
                { label: 'Cachorro', val: 'dog' },
                { label: 'Gato', val: 'cat' },
                { label: 'Outro', val: 'other' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.val}
                  onPress={() => updateField('species', item.val as any)}
                  style={[styles.squareBtn, formData.species === item.val && styles.squareBtnActive]}
                >
                  <Text
                    style={[
                      styles.squareBtnText,
                      formData.species === item.val && styles.squareBtnTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Sexo *</Text>
            <View style={styles.row}>
              {[
                { label: 'Macho', val: 'male' },
                { label: 'Fêmea', val: 'female' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.val}
                  onPress={() => updateField('sex', item.val as any)}
                  style={[styles.squareBtn, formData.sex === item.val && styles.squareBtnActive]}
                >
                  <Text
                    style={[
                      styles.squareBtnText,
                      formData.sex === item.val && styles.squareBtnTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Porte do Animal *</Text>
            <View style={styles.row}>
              {[
                { label: 'Pequeno', val: 'small' },
                { label: 'Médio', val: 'medium' },
                { label: 'Grande', val: 'large' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.val}
                  onPress={() => updateField('size', item.val as any)}
                  style={[styles.squareBtn, formData.size === item.val && styles.squareBtnActive]}
                >
                  <Text
                    style={[
                      styles.squareBtnText,
                      formData.size === item.val && styles.squareBtnTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Faixa Etária *</Text>
            <View style={styles.grid2x2}>
              {[
                { label: 'Filhote', val: 'puppy' },
                { label: 'Jovem', val: 'young' },
                { label: 'Adulto', val: 'adult' },
                { label: 'Idoso', val: 'senior' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.val}
                  onPress={() => updateField('age_group', item.val as any)}
                  style={[
                    styles.gridItemBtn,
                    formData.age_group === item.val && styles.squareBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.squareBtnText,
                      formData.age_group === item.val && styles.squareBtnTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Linha com Idade e Peso */}
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.label}>Idade em anos (opcional)</Text>
                <TextInput
                  value={formData.age_years !== undefined ? String(formData.age_years) : ''}
                  onChangeText={(val) =>
                    updateField('age_years', val ? parseFloat(val.replace(',', '.')) : undefined)
                  }
                  keyboardType="numeric"
                  style={styles.input}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Peso em kg (opcional)</Text>
                <TextInput
                  value={formData.weight_kg !== undefined ? String(formData.weight_kg) : ''}
                  onChangeText={(val) =>
                    updateField('weight_kg', val ? parseFloat(val.replace(',', '.')) : undefined)
                  }
                  keyboardType="numeric"
                  style={styles.input}
                />
              </View>
            </View>

            <Text style={styles.label}>Cor / Pelagem (opcional)</Text>
            <TextInput
              value={formData.color}
              onChangeText={(val) => updateField('color', val)}
              style={styles.input}
            />
          </View>
        )}

        {/* ETAPA 2: Descrição e Características */}
        {currentStep === 2 && (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Histórico e Saúde</Text>

            <Text style={styles.label}>Descrição do Animal (opcional)</Text>
            <TextInput
              value={formData.description}
              onChangeText={(text) => updateField('description', text)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={[styles.input, styles.textArea]}
            />

            <Text style={[styles.subSectionTitle, { marginTop: 16 }]}>Controle Sanitário *</Text>
            <BinaryChoice
              label="Vacinado"
              value={formData.is_vaccinated}
              onChange={(val) => updateField('is_vaccinated', val)}
            />
            <BinaryChoice
              label="Castrado"
              value={formData.is_neutered}
              onChange={(val) => updateField('is_neutered', val)}
            />
            <BinaryChoice
              label="Desparasitado"
              value={formData.is_dewormed}
              onChange={(val) => updateField('is_dewormed', val)}
            />
            <BinaryChoice
              label="Possui microchip"
              value={formData.has_microchip}
              onChange={(val) => updateField('has_microchip', val)}
            />
          </View>
        )}

        {/* ETAPA 3: Preferências */}
        {currentStep === 3 && (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Nível de Energia *</Text>
            <View style={styles.row}>
              {[
                { label: 'Calmo', val: 'low' },
                { label: 'Moderado', val: 'medium' },
                { label: 'Ativo', val: 'high' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.val}
                  onPress={() => updateField('energy', item.val as any)}
                  style={[styles.squareBtn, formData.energy === item.val && styles.squareBtnActive]}
                >
                  <Text
                    style={[
                      styles.squareBtnText,
                      formData.energy === item.val && styles.squareBtnTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.subSectionTitle, { marginTop: 20 }]}>Sociabilidade e Espaço *</Text>
            <BinaryChoice
              label="Bom com crianças"
              value={formData.good_with_kids}
              onChange={(val) => updateField('good_with_kids', val)}
            />
            <BinaryChoice
              label="Bom com outros cachorros"
              value={formData.good_with_dogs}
              onChange={(val) => updateField('good_with_dogs', val)}
            />
            <BinaryChoice
              label="Bom com gatos"
              value={formData.good_with_cats}
              onChange={(val) => updateField('good_with_cats', val)}
            />
            <BinaryChoice
              label="Adequado para apartamento"
              value={formData.apartment_friendly}
              onChange={(val) => updateField('apartment_friendly', val)}
            />

            <Text style={[styles.subSectionTitle, { marginTop: 20 }]}>Cuidados Especiais *</Text>
            <BinaryChoice
              label="Possui necessidades especiais"
              value={formData.special_needs}
              onChange={(val) => updateField('special_needs', val)}
            />

            {formData.special_needs && (
              <View style={{ marginTop: 12 }}>
                <Text style={styles.label}>Descrição das Necessidades Especiais *</Text>
                <TextInput
                  value={formData.special_needs_desc}
                  onChangeText={(val) => updateField('special_needs_desc', val)}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  style={[styles.input, styles.textArea]}
                />
              </View>
            )}
          </View>
        )}

        {/* ETAPA 4: Imagem e Confirmação */}
        {currentStep === 4 && (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Imagem de Capa</Text>

            {/* Botões de Ação de Foto */}
            <View style={styles.row}>
              <TouchableOpacity
                onPress={handleTakePhoto}
                style={styles.imageActionBtn}
              >
                <Text style={styles.imageActionBtnText}>Tirar Foto</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handlePickGallery}
                style={styles.imageActionBtn}
              >
                <Text style={styles.imageActionBtnText}>Escolher da Galeria</Text>
              </TouchableOpacity>
            </View>

            {/* Preview da Imagem */}
            <View style={styles.previewContainer}>
              {formData.localImageUri ? (
                <View style={{ width: '100%', alignItems: 'center' }}>
                  <Image
                    source={{ uri: formData.localImageUri }}
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() => updateField('localImageUri', undefined)}
                    style={styles.removeImageBtn}
                  >
                    <Text style={styles.removeImageBtnText}>Remover Imagem</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.emptyPreviewBox}>
                  <Text style={styles.emptyPreviewText}>Nenhuma imagem anexada</Text>
                </View>
              )}
            </View>

            <Text style={[styles.subSectionTitle, { marginTop: 20 }]}>Resumo dos Dados</Text>
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Nome: </Text>
                {formData.name}
              </Text>
              <Text style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Espécie: </Text>
                {formData.species === 'dog' ? 'Cachorro' : formData.species === 'cat' ? 'Gato' : 'Outro'}
              </Text>
              <Text style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Sexo: </Text>
                {formData.sex === 'male' ? 'Macho' : 'Fêmea'}
              </Text>
              <Text style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Porte: </Text>
                {formData.size === 'small' ? 'Pequeno' : formData.size === 'medium' ? 'Médio' : 'Grande'}
              </Text>
              <Text style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Faixa Etária: </Text>
                {formData.age_group === 'puppy'
                  ? 'Filhote'
                  : formData.age_group === 'young'
                  ? 'Jovem'
                  : formData.age_group === 'adult'
                  ? 'Adulto'
                  : 'Idoso'}
              </Text>
              {formData.age_years !== undefined && (
                <Text style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Idade: </Text>
                  {formData.age_years} ano(s)
                </Text>
              )}
              {formData.weight_kg !== undefined && (
                <Text style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Peso: </Text>
                  {formData.weight_kg} kg
                </Text>
              )}
              <Text style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Energia: </Text>
                {formData.energy === 'low' ? 'Calmo' : formData.energy === 'medium' ? 'Moderado' : 'Ativo'}
              </Text>
              <Text style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Castrado / Vacinado: </Text>
                {formData.is_neutered ? 'Sim' : 'Não'} / {formData.is_vaccinated ? 'Sim' : 'Não'}
              </Text>
              <Text style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Apartamento: </Text>
                {formData.apartment_friendly ? 'Sim' : 'Não'}
              </Text>
              {formData.special_needs && (
                <Text style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Necessidades Especiais: </Text>
                  {formData.special_needs_desc}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Rodapé de Navegação */}
        <View style={styles.actionsRow}>
          {currentStep > 1 && (
            <TouchableOpacity
              onPress={handlePrevStep}
              disabled={loading}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>
          )}

          {currentStep < 4 ? (
            <TouchableOpacity
              onPress={handleNextStep}
              style={[styles.nextButton, currentStep === 1 && { flex: 1 }]}
            >
              <Text style={styles.nextButtonText}>Próxima Etapa</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              style={styles.confirmButton}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.confirmButtonText}>Finalizar Cadastro</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    backgroundColor: '#ffffff',
  },
  progressContainer: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 16,
  },
  stepLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  stepIndicatorText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803d',
    letterSpacing: 0.5,
  },
  stepCategoryText: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '700',
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#16a34a',
  },
  formSection: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 20,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#0f172a',
    marginBottom: 16,
  },
  textArea: {
    height: 90,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  grid2x2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  gridItemBtn: {
    width: '48%',
    paddingVertical: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareBtnActive: {
    backgroundColor: '#16a34a',
    borderColor: '#15803d',
  },
  squareBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  squareBtnTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  toggleLabel: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
    flex: 1,
  },
  toggleButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  toggleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
  },
  toggleBtnActive: {
    backgroundColor: '#16a34a',
    borderColor: '#15803d',
  },
  toggleBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  toggleBtnTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  imageActionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageActionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  previewContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    padding: 12,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: 4,
    backgroundColor: '#e2e8f0',
  },
  removeImageBtn: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  removeImageBtnText: {
    color: '#dc2626',
    fontWeight: '600',
    fontSize: 13,
  },
  emptyPreviewBox: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyPreviewText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  summaryContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    gap: 8,
  },
  summaryRow: {
    fontSize: 14,
    color: '#1e293b',
    lineHeight: 20,
  },
  summaryLabel: {
    fontWeight: '700',
    color: '#334155',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  backButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  nextButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 4,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  confirmButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 4,
    backgroundColor: '#15803d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
});