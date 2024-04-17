
import axios from 'axios';
import { onMounted, ref, type Ref } from 'vue';

interface DataItem {
    id: number,
    name: string,
    price: number,
    created_at: number,
    user: string,
    status_name: string,
    status_color: string,
    contacts: {
        contact_name: string,
        contact_phone: string,
        contact_email: string
    }[]
}[]

export const useGetLeeds = (querySearch: Ref<string>) => {
    // const domen = 'http://localhost:3000';
    let domen = window.location.origin;

    const loading = ref(false)
    const data = ref<DataItem>()


    onMounted(async () => {
        await getLeads()

    })
    async function getLeads() {
        loading.value = true;
        try {
            let leads = await axios.get(
                `${domen}/api/leads`,
                {
                    params: {
                        query: querySearch.value,
                    }
                }
            );
            let res = leads.data;
            res.forEach((el: any, index: number) => {
                el.key = index
            });
            data.value = res;
        } catch (e) {
            console.log(e)
        }
        loading.value = false
    };


    return {
        getLeads,
        loading,
        data
    }
}