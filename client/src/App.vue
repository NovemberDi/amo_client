<template>
  <a-table :columns="columns" :data-source="data" class="components-table-demo-nested">

    <template #expandedRowRender>
      <a-list size="large" bordered :data-source="dataI">
        <template #renderItem="{ item }">
          <a-list-item>{{ item }}</a-list-item>
        </template>
      </a-list>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import axios from 'axios';
import { onMounted } from 'vue';

let domen = 'localhost:3000'
let querySearch = ''

const columns = [
  { title: 'Название', dataIndex: 'name', key: 'name' },
  { title: 'Бюджет', dataIndex: 'platform', key: 'platform' },
  { title: 'Статус', dataIndex: 'version', key: 'version' },
  { title: 'Ответственный', dataIndex: 'creator', key: 'creator' },
  { title: 'Дата создания', dataIndex: 'createdAt', key: 'createdAt' },

];

interface DataItem2 {
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



let data: DataItem2[] = [];

onMounted(async() => {
  await getLeads()
})
async function getLeads(){
      // this.loading = true;
      try{
      let leads = await axios.get(
                `${domen}/api/leads`,
                {
                  params: {
                    query: querySearch, 
                  }
                }
              );
      data = leads.data;       
    } catch(e){
      console.log(e)
    }
    // this.loading = false    
     } 


interface DataItem {
  key: number;
  name: string;
  platform: string;
  version: string;
  upgradeNum: number;
  creator: string;
  createdAt: string;
}

// const data: DataItem2[] = [];
// for (let i = 0; i < 5; ++i) {
//   data.push({
//     key: i,
//     name: `Screem ${i + 1}`,
//     platform: 'iOS',
//     version: '10.3.4.5654',
//     upgradeNum: 500,
//     creator: 'Jack',
//     createdAt: '2014-12-24 23:12:00',
//   });
// }


const dataI: string[] = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',

];




</script>
<!-- watch:{
  querySearch(value:string){
    if (value.length < 4 && value.length != 0) {
      this.alert = true
    } else {
      this.alert = false
    }
  }
},
created() {
    this.search = debounce(this.search, 800);
    this.domen = window.location.origin;
},
mounted(){
  this.getLeads()
} -->