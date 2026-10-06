import { AddressFormData } from "@/screens/profile/types/profile.types";
import { supabase } from "./supabase";

const DEFAULT_COUNTRY_ID = '7cf8c585-2eb9-4caf-944a-528630a2fc13'; // ID do país padrão (Brasil) na tabela countries

export interface ViaCepResponse {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string; // Cidade
    uf: string; // Abreviação do Estado
    estado: string; // Nome do estado
    erro?: boolean;
}

export const addressService = {
    // Busca os dados no ViaCEP
    async fetchAddressFromCep(cep: string): Promise<ViaCepResponse> {
        const cleanCep = clearCep(cep);
        if (cleanCep.length !== 8) {
            throw new Error('CEP inválido. O CEP deve conter 8 dígitos.');
        }

        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();

        if (data.erro) {
            throw new Error('CEP não encontrado.');
        }

        return data;
    },

    async fetchAddressByUserId(userId: string) {
        const { data, error } = await supabase
            .from('user_complete_address_view')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) throw new Error(error.message);

        return data || null;
    },

    async getStateByName(stateName: string) {
        const { data: state } = await supabase
            .from('states')
            .select('id')
            .eq('name', stateName)
            .eq('country_id', DEFAULT_COUNTRY_ID)
            .maybeSingle();

        return state || null;
    },

    async getCityByNameAndState(cityName: string, stateId: string) {
        const { data: city } = await supabase
            .from('cities')
            .select('id')
            .eq('name', cityName)
            .eq('state_id', stateId)
            .maybeSingle();

        return city || null;
    },

    // Salva o endereço normalizado (Estado -> Cidade -> Endereço)
    async saveNormalizedAddress(addressData: AddressFormData): Promise<string> {
        // Insere o estado se não existir e retorna o id criado
        let state = await this.getStateByName(addressData.stateName);
        if (!state && addressData.stateId) {
            const { data: stateData, error: stateError } = await supabase
                .from('states')
                .insert({
                    name: addressData.stateName,
                    abbreviation: addressData.stateAbbreviation,
                    country_id: DEFAULT_COUNTRY_ID
                })
                .select('id')
                .single();

            state = stateData;
            if (stateError) throw new Error(`Erro ao salvar estado: ${stateError?.message}`);
        }

        if(!state) throw new Error('Estado não encontrado ou criado.');

        // Insere a cidade se não existir e retorna o id criado
        let city = await this.getCityByNameAndState(addressData.cityName, state?.id);
        if (!city && state) {
            const { data: cityData, error: cityError } = await supabase
                .from('cities')
                .insert(
                    { name: addressData.cityName, state_id: state.id }
                )
                .select('id')
                .single();

            city = cityData;
            if (cityError) throw new Error(`Erro ao salvar cidade: ${cityError?.message}`);
        }

        if (!city) throw new Error('Cidade não encontrada ou criada.');

        // Inserir o Endereço com a referência da cidade
        const { data: newAddr, error: addrError } = await supabase
            .from('addresses')
            .insert({
                postal_code: clearCep(addressData.postalCode),
                street: addressData.street.trim(),
                number: addressData.number ? Number(addressData.number) : null,
                complement: addressData.complement?.trim() || null,
                district: addressData.district?.trim() || null,
                city_id: city.id, // Chave estrangeira para a cidade
            })
            .select('id')
            .single();

        if (addrError) throw new Error(`Erro ao salvar endereço: ${addrError.message}`);

        // Retorna o ID do endereço finalizado para ser vinculado ao perfil do usuário
        return newAddr.id;
    },
};

const clearCep = (cep: string) => cep.replace(/\D/g, '');