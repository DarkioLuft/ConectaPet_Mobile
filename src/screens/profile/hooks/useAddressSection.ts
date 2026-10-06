import { addressService } from '@/services/addressService';
import { supabase } from '@/services/supabase';
import { handleError } from '@/utils/errorHandler';
import { AppToast } from '@/utils/toast';
import { useEffect, useState } from 'react';
import { AddressFormData } from '../types/profile.types';

interface UseAddressSectionProps {
    initialData: AddressFormData | null;
    userId: string | null;
    onSuccess: () => void;
}

export function useAddressSection({ initialData, userId, onSuccess }: UseAddressSectionProps) {
    const [addressData, setAddressData] = useState<AddressFormData>({
        addressId: null,
        postalCode: '',
        street: '',
        number: '',
        complement: null,
        district: '',
        location: null,
        cityId: null,
        cityName: '',
        stateId: null,
        stateName: '',
        stateAbbreviation: '',
        countryId: null, 
        countryName: '',
        countryAbbreviation: '',
    });
    const [savingAddress, setSavingAddress] = useState(false);
    const [loadingCep, setLoadingCep] = useState(false);

    useEffect(() => {
        if (initialData) setAddressData(initialData);
    }, [initialData]);

    // Função para lidar com a digitação do CEP e fazer o fetch automático
    const handleCepChange = async (text: string) => {
        const numericCep = text.replace(/\D/g, '');
        setAddressData((prev) => ({ ...prev, postalCode: text }));

        // Quando atingir 8 dígitos, busca na API
        if (numericCep.length === 8) {
            try {
                setLoadingCep(true);
                const data = await addressService.fetchAddressFromCep(numericCep);

                // Preenche o formulário automaticamente com os dados da API
                setAddressData((prev) => ({
                    ...prev,
                    street: data.logradouro,
                    complement: data.complemento,
                    district: data.bairro,
                    cityName: data.localidade,
                    stateAbbreviation: data.uf,
                    stateName: data.estado,
                }));
            } catch (error: any) {
                cleanInputs();
                handleError(error.message, 'Erro ao buscar CEP');
            } finally {
                setLoadingCep(false);
            }
        }
    };

    const saveAddress = async () => {
        if (!userId) return;

        // Validação básica antes de chamar a API
        if (!addressData.postalCode || !addressData.street || !addressData.cityName
            || !addressData.stateName || !addressData.district || !addressData.number) {
            AppToast.info('Preencha todos os campos obrigatórios');
            return;
        }

        try {
            setSavingAddress(true);

            // Salva o novo endereço
            const newAddressId = await addressService.saveNormalizedAddress(addressData);

            // Vincula o ID do endereço ao perfil do usuário atual
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ address_id: newAddressId, updated_at: new Date().toISOString() })
                .eq('id', userId);

            if (profileError) throw profileError;

            // Atualiza os dados globais da tela (barra de progresso)
            onSuccess();
            AppToast.success('Endereço atualizado com sucesso!');
        } catch (err: any) {
            handleError(err.message, 'Falha ao salvar endereço.');
        } finally {
            setSavingAddress(false);
        }
    };

    const cleanInputs = () => {
        setAddressData({
            addressId: null,
            postalCode: '',
            street: '',
            number: '',
            complement: null,
            district: '',
            location: '',
            cityId: null,
            cityName: '',
            stateId: null,
            stateName: '',
            stateAbbreviation: '',
            countryId: null,
            countryName: '',
            countryAbbreviation: '',
        });
    }

    // Atualização manual de outros campos do form
    const updateField = (field: keyof AddressFormData, value: string) => {
        setAddressData((prev) => ({ ...prev, [field]: value }));
    };

    return {
        addressData,
        savingAddress,
        loadingCep,
        handleCepChange,
        updateField,
        saveAddress
    };
}
