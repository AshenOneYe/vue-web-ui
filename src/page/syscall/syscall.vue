<template>
    <el-table v-if="hasData" :data="filterTableData" stripe style="width: 100%">
        <el-table-column prop="serviceName" label="ServiceName" />
        <el-table-column prop="methodName" label="MethodName" />
        <el-table-column prop="parameters" label="Parameters" />
        <el-table-column prop="callingUid" label="CallingUid" />
        <el-table-column prop="callingPid" label="CallingPid" />
        <el-table-column>
            <template #header>
                <el-input v-model="search" size="small" placeholder="Type to search" />
            </template>
            <template #default="scope">
                <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
                    Edit
                </el-button>
                <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-empty v-else>
        <el-button type="primary" v-on:click="btn">Reload</el-button>
    </el-empty>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref, computed } from 'vue'

const search = ref("")
const hasData = ref(false)
const tableData = ref([])

const filterTableData = computed(() =>
    tableData.value.filter(
        (data) =>
            !search.value ||
            data.serviceName.toLowerCase().includes(search.value.toLowerCase()) ||
            data.methodName.toLowerCase().includes(search.value.toLowerCase())
    )
)

function handleEdit(index, row) {
    ElMessage({
        message: 'index' + index,
        type: 'success',
    })
}

function handleDelete(index, row) {
    ElMessage.error("index" + index)
}

function loadData() {
    tableData.value = [
        {
            serviceName: 'ActivityManagerService',
            methodName: 'handleIncomingUser',
            parameters: null,
            callingUid: 10087,
            callingPid: 3330,
        },
        {
            serviceName: 'WifiManagerService',
            methodName: 'getBSSID',
            parameters: null,
            callingUid: 10088,
            callingPid: 3331,
        },
        {
            serviceName: 'TelephonyManagerService',
            methodName: 'getDeviceID',
            parameters: null,
            callingUid: 10089,
            callingPid: 3332,
        },
        {
            serviceName: 'ActivityManagerService',
            methodName: 'handleIncomingUser',
            parameters: null,
            callingUid: 10090,
            callingPid: 3333,
        },
        {
            serviceName: 'ActivityManagerService',
            methodName: 'handleIncomingUser',
            parameters: null,
            callingUid: 10091,
            callingPid: 3334,
        },
    ]
}

function btn() {
    console.log("loadData")
    loadData()
    hasData.value = tableData.value.length > 0
}
</script>