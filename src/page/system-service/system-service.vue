<template>
    <el-tabs type="border-card" @tab-click="onClick">
        <el-tab-pane label="List View">List View</el-tab-pane>
        <el-tab-pane label="Thread View">Thread View</el-tab-pane>
        <el-tab-pane label="Advance Analysis">Advance Analysis</el-tab-pane>
    </el-tabs>
</template>

<script setup>
    function onClick(pane,ev){
        console.log(pane.paneName)
    }
</script>