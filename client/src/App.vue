<template>
  <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }">
    <a-typography-text strong :style="{ fontSize: 18 + 'px' }">Тестовое задание</a-typography-text>
    <a-input placeholder="Найти" style="width: 300px" v-model:value="querySearch" @input="search">
      <template #prefix>
        <WarningOutlined v-show="alert" :style="{ color: '#ff7700', marginLeft: -35 + 'px' }" />
      </template>
      <template #suffix>
        <SearchOutlined style="color: rgba(0, 0, 0, 0.45)" />
      </template>
    </a-input>
  </div>
  <a-spin :spinning="loading">
    <a-table :scroll="{ x: 1000 }" :columns="columns" :data-source="data" :defaultExpandAllRows="true"
      class="components-table-demo-nested">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status_name'">
          <div
            :style="{ backgroundColor: record.status_color, borderRadius: 4 + 'px', display: 'flex', justifyContent: 'center', alignItems: 'center' }">
            {{ record.status_name }}
          </div>
        </template>
        <template v-if="column.key === 'created_at'">
          {{ formatDate(record.created_at) }}
        </template>
      </template>
      <template #expandedRowRender="content">
        <a-list size="large" bordered :data-source="content.record.contacts">
          <template #renderItem="{ item }">
            <a-list-item>
              <UserOutlined :style="{ fontSize: 20 + 'px', color: '#078ceb', marginRight: 14 + 'px' }" />
              {{ item.contact_name }}
              <a :href="`tel:${item.contact_phone}`">
                <PhoneOutlined :style="{ marginRight: 6 + 'px', marginLeft: 6 + 'px' }" />
              </a>
              <a :href="`mailto:${item.contact_email}`">
                <MailOutlined />
              </a>
            </a-list-item>
          </template>
        </a-list>
      </template>
    </a-table>
  </a-spin>

</template>
<script lang="ts" setup>

import { ref, watch } from 'vue';
import debounce from 'lodash.debounce'
import { PhoneOutlined, UserOutlined, MailOutlined, SearchOutlined, WarningOutlined } from '@ant-design/icons-vue';

import { useGetLeeds } from '@/composables/useGetLeeds'

const querySearch = ref('');
const alert = ref(false);

const { getLeads, loading, data } = useGetLeeds(querySearch)

const search = debounce(() => {
  if (alert.value) return
  getLeads()
}, 800)

const columns = [
  { title: 'Название', dataIndex: 'name', key: 'name' },
  { title: 'Бюджет', dataIndex: 'price', key: 'price' },
  { title: 'Статус', dataIndex: 'status_name', key: 'status_name' },
  { title: 'Ответственный', dataIndex: 'user', key: 'user' },
  { title: 'Дата создания', dataIndex: 'created_at', key: 'created_at' },

];

function formatDate<String>(date: number) {
  let dateNew = new Date(date)
  return dateNew.toLocaleDateString() + ' ' + dateNew.toLocaleTimeString().slice(0, 5)
}


watch(querySearch, (value: String) => {
  if (value.length < 4 && value.length != 0) {
    alert.value = true
  } else {
    alert.value = false
  }
})

</script>
