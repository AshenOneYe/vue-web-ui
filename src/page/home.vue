<template>
    <div class="common-layout" style="height: 100%">
        <el-container>
            <el-header :style="{ boxShadow: `var(--el-box-shadow)` }" style="background-color: #ecf5ff">
                <el-space wrap>
                    <h1>Beepdroid</h1>
                </el-space>
            </el-header>
            <el-container>
                <el-aside width="200px" :style="{ boxShadow: `var(--el-box-shadow)` }">
                    <el-menu :default-active="menu_index" @select="onSelect" :router="true">
                        <el-menu-item index="overview">
                            <el-icon>
                                <Histogram />
                            </el-icon>
                            <span>Overview</span>
                        </el-menu-item>
                        <el-menu-item index="system-service">
                            <el-icon>
                                <Setting />
                            </el-icon>
                            <span>System Service</span>
                        </el-menu-item>
                        <el-menu-item index="syscall">
                            <el-icon>
                                <Cpu />
                            </el-icon>
                            <span>Syscall</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-main >
                    <RouterView v-if="hasData" />
                    <el-empty v-else>
                        <el-upload :on-change="loadDataBase" :auto-upload="false">
                            <template #trigger>
                                <el-button type="primary">选择数据库</el-button>
                            </template>
                            <template #tip>
                                <div class="el-upload__tip text-red">请先加载数据库</div>
                            </template>
                        </el-upload>
                    </el-empty>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
  
<script setup>
import { Cpu, Setting, Histogram, DataBoard } from "@element-plus/icons-vue";
import { onMounted, ref } from "vue";
import initSqlJs from "sql.js";

const fr = new FileReader();
fr.onloadend = (evt) => {
    initSqlJs({
        locateFile: (file) => `sql-wasm.wasm`,
    }).then((SQL) => {
        try {
            window.db = new SQL.Database(new Uint8Array(evt.target.result));
            window.ServiceData = window.db.exec("select * from log order by timeStamp")[0]
            window.BpfData = window.db.exec("select * from bpf order by timeStamp")[0]
            hasData.value = true;
        } catch (e) {
            console.log(e);
        }
    });
};

const hasData = ref(false);
function loadDataBase(file, files) {
    fr.readAsArrayBuffer(file.raw);
}

const menu_index = ref("overview");
function onSelect(index, item) {
    localStorage.setItem("menu_index", index);
}

onMounted(() => {
    menu_index.value = localStorage.getItem("menu_index");
});
</script>