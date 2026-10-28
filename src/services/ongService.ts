import { supabase } from "./supabase";

const ONG_TABLE_NAME = 'ongs'

export const ongService = {
    async getOngById(ongId: String) {
        const { data, error } = await supabase
            .from(ONG_TABLE_NAME)
            .select(`
        *,
          address:address_id (
            *,
            city:city_id ( 
                id, 
                name, 
                state:state_id ( 
                    id,
                    name,
                    abbreviation,
                    country:country_id (
                        id,
                        name,
                        abbreviation
                )   )   )
          )
      `)
            .eq('id', ongId)
            .single()

        if (error) throw new Error(`Erro ao obter dados da ONG: ${error.message}`)
        console.log(data)

        return data
    }
}