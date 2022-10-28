<template>
  <el-tabs type="border-card">
    <el-tab-pane label="List View">
      <el-table :data="filterTableData" stripe height="700" style="width: 100%" :table-layout="auto" @filter-change="filterHandler">
        <el-table-column type="index" :index="getIndex" />
        <el-table-column column-key="tag" prop="tag" label="Tag" :filters="_tagFilter"/>
        <el-table-column column-key="timeStamp" prop="timeStamp" label="TimeStamp" :filters="_timeStampFilter"/>
        <el-table-column column-key="callingPid" prop="callingPid" label="CallingPid" :filters="_callingPidFilter"/>
        <el-table-column column-key="service" prop="serviceName" label="ServiceName" :filters="_serviceFilter"/>
        <el-table-column prop="methodName" label="MethodName" />
        <el-table-column prop="parameters" label="Parameters" />
      </el-table>
      <el-pagination background :page-size="pageItemCount" layout="prev, pager, next" :total="itemTotal"
        v-model:current-page="currentPage" />
    </el-tab-pane>
    <el-tab-pane label="Analysis">Analysis</el-tab-pane>
  </el-tabs>
</template>

<script setup>
import { auto } from "@popperjs/core";
import { computed, ref } from "@vue/runtime-core";

const tableData = ref([])

const tagTypes = []
const timeStampTypes = []
const callingPidTypes = []
const serviceTypes = []
window.ServiceData.values.forEach(element => {
  tagTypes.push(eval(element[0]))
  timeStampTypes.push(Math.round(eval(element[1]) / 1000))
  callingPidTypes.push(element[2])
  serviceTypes.push(element[3])

  tableData.value.push({
    tag: eval(element[0]),
    timeStamp: Math.round(eval(element[1]) / 1000),
    callingPid: element[2],
    serviceName: element[3],
    methodName: element[4],
    parameters: element[5]
  })
});

function getFilter(types) {
    var ret = []
    Array.from(new Set(types)).sort().forEach((element) => {
        ret.push({ text: element, value: element })
    })
    return ref(ret)
}

const _tagFilter = getFilter(tagTypes)
const _timeStampFilter = getFilter(timeStampTypes)
const _callingPidFilter = getFilter(callingPidTypes)
const _serviceFilter = getFilter(serviceTypes)

const tagFilter = ref([])
const timeStampFilter = ref([])
const callingPidFilter = ref([])
const serviceFilter = ref([])

function filterHandler(value){
    if(value["tag"]){
        tagFilter.value = []
        value["tag"].forEach((i)=>{tagFilter.value.push(i)})
    }
    if(value["timeStamp"]){
        timeStampFilter.value = []
        value["timeStamp"].forEach((i)=>{timeStampFilter.value.push(i)})
    }
    if(value["callingPid"]){
        callingPidFilter.value = []
        value["callingPid"].forEach((i)=>{callingPidFilter.value.push(i)})
    }
    if(value["service"]){
        serviceFilter.value = []
        value["service"].forEach((i)=>{serviceFilter.value.push(i)})
    }
}

const currentPage = ref(1)
const pageItemCount = ref(50)
const itemTotal = ref(tableData.value.length)

const filterTableData = computed(() => {
  var ret = tableData.value.filter((element) => {
    if(tagFilter.value.length > 0 && !(tagFilter.value.some(i => i === element['tag'])))return false
        if(timeStampFilter.value.length > 0 && !(timeStampFilter.value.some(i => i === element['timeStamp'])))return false
        if(callingPidFilter.value.length > 0 && !(callingPidFilter.value.some(i => i === element['callingPid'])))return false
        if(serviceFilter.value.length > 0 && !(serviceFilter.value.some(i => i === element['serviceName'])))return false
    return true
  })
  itemTotal.value = ret.length
  return ret.slice((currentPage.value - 1) * pageItemCount.value, currentPage.value * pageItemCount.value)
})

const getIndex = (index) => ((currentPage.value - 1) * pageItemCount.value) + index + 1

</script>

