<template>
    <div class="common-layout" style="height:100%">
        <el-container>
            <el-header :style="{boxShadow: `var(--el-box-shadow)`}" style="background-color:   #ecf5ff;">
                <el-space wrap><h1>Beefdroid</h1></el-space>
            </el-header>
            <el-container >
                <el-aside width="200px" :style="{boxShadow: `var(--el-box-shadow)`}">
                    <el-menu :default-active="menu_index" @select="onSelect" router="true">
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
                <el-main>
                    <RouterView />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
  
<script setup>
import { Cpu, Setting, Histogram } from '@element-plus/icons-vue';
import { onMounted, ref } from 'vue';

const menu_index = ref("overview")
function onSelect(index, item) {
    localStorage.setItem("menu_index", index)
}

onMounted(() => {
    menu_index.value = localStorage.getItem("menu_index")
})
</script>