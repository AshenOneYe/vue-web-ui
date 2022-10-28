<template >
    <el-tabs type="border-card">
        <el-tab-pane label="List View">
            <el-table :data="filterTableData" stripe height="700" style="width: 100%" @filter-change="filterHandler">
                <el-table-column type="index" width="60" :index="getIndex" />
                <el-table-column column-key="tag" prop="tag" label="Tag" width="480" :filters="_tagFilter"/>
                <el-table-column column-key="timeStamp" prop="timeStamp" label="TimeStamp" width="150" :filters="_timeStampFilter"/>
                <el-table-column column-key="callingPid" prop="callingPid" label="CallingPid" width="120" :filters="_callingPidFilter"/>
                <el-table-column column-key="syscall" prop="syscall" label="Syscall" width="120" :filters="_syscallFilter"/>
                <el-table-column prop="parameters" label="Parameters"/>
                <el-table-column prop="str" label="ExtraInfo" width="100" />
                <el-table-column prop="ret" label="ReturnValue" width="130" />
            </el-table>
            <el-pagination background :page-size="pageItemCount" layout="prev, pager, next" :total="itemTotal"
                v-model:current-page="currentPage" />
        </el-tab-pane>
        <el-tab-pane label="Analysis">
            Analysis
        </el-tab-pane>
    </el-tabs>
</template>



<script setup>
import { computed, ref } from "@vue/runtime-core";

const tableData = ref([])

const tagTypes = []
const timeStampTypes = []
const callingPidTypes = []
const syscallTypes = []
window.BpfData.values.forEach(element => {
    tagTypes.push(eval(element[0]))
    timeStampTypes.push(Math.round(eval(element[1]) / 10000000))
    callingPidTypes.push(element[2])
    syscallTypes.push(element[3])

    tableData.value.push({
        tag: eval(element[0]),
        timeStamp: Math.round(eval(element[1]) / 10000000),
        callingPid: element[2],
        syscall: element[3],
        parameters: element[4],
        str: element[5] == undefined ? "/" : element[5],
        ret: element[6]
    })
});

function getFilter(types) {
    var ret = []
    new Set(types).forEach((element) => {
        ret.push({ text: element, value: element })
    })
    return ref(ret)
}

const _tagFilter = getFilter(tagTypes)
const _timeStampFilter = getFilter(timeStampTypes)
const _callingPidFilter = getFilter(callingPidTypes)
const _syscallFilter = getFilter(syscallTypes)

const tagFilter = ref([])
const timeStampFilter = ref([])
const callingPidFilter = ref([])
const syscallFilter = ref([])

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
    if(value["syscall"]){
        syscallFilter.value = []
        value["syscall"].forEach((i)=>{syscallFilter.value.push(i)})
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
        if(syscallFilter.value.length > 0 && !(syscallFilter.value.some(i => i === element['syscall'])))return false
        return true
    })

    itemTotal.value = ret.length
    return ret.slice((currentPage.value - 1) * pageItemCount.value, currentPage.value * pageItemCount.value)
})

const getIndex = (index) => ((currentPage.value - 1) * pageItemCount.value) + index + 1

</script>