<template>
    <el-row :gutter="20">
        <el-col :span="8">
            <div id="ServiceCount" style="width: 100%;height:400px;"></div>
        </el-col>
        <el-col :span="16">
            <div id="ServiceThread" style="width: 100%;height:400px;"></div>
        </el-col>
    </el-row>

    <el-row :gutter="20">
        <el-col :span="8">
            <div id="BpfCount" style="width: 100%;height:400px;"></div>
        </el-col>
        <el-col :span="16">
            <div id="BpfThread" style="width: 100%;height:400px;"></div>
        </el-col>
    </el-row>
</template>

<script setup>
import * as echarts from 'echarts';
import { onMounted } from 'vue';


onMounted(() => {
    var ServiceCountChart = echarts.init(document.getElementById('ServiceCount'));
    var ServiceThreadChart = echarts.init(document.getElementById('ServiceThread'));
    var BpfCountChart = echarts.init(document.getElementById('BpfCount'));
    var BpfThreadChart = echarts.init(document.getElementById('BpfThread'));

    window.onresize = () => {
        ServiceCountChart.resize()
        ServiceThreadChart.resize()
        BpfCountChart.resize()
        BpfThreadChart.resize()
    }

    var ServiceCountData = [["ServiceName", "Count"]]
    const res = window.db.exec("SELECT serviceName, count(*) FROM log GROUP BY serviceName order by count(*) desc");
    ServiceCountData = ServiceCountData.concat(res[0].values)

    // 绘制图表
    ServiceCountChart.setOption({
        title: { text: 'Service次数统计' },
        dataset: { source: ServiceCountData },
        tooltip: {},
        series: [{ type: 'pie' }]
    });


    var logThreads = []
    var logSeries = []
    window.db.exec("select callingPid from log group by callingPid order by callingPid asc")[0].values.forEach(element => {
        logThreads.push(element[0])
        logSeries.push({ type: 'line' })
    });
    logSeries.push({ type: 'line' })
    var logtmp = {}
    var logMinTime = undefined
    var logLastTime = undefined
    window.ServiceData.values.forEach(element => {
        var time = Math.round(element[1]/10000000)
        var callingPid = element[2]
        // var syscall = element[3]
        if(!logLastTime){
            logLastTime = time
            logMinTime = time
        }
        while(logLastTime < time){
            logLastTime++
            logtmp[logLastTime] = {}
            logThreads.forEach(thread => {
                logtmp[logLastTime][thread] = 0
            })
        }
        if(!logtmp[time]){
            logtmp[time] = {}
            logThreads.forEach(thread => {
                logtmp[time][thread] = 0
            })
        }
        logtmp[time][callingPid] += 1
    });

    var logDimensions = ['time'].concat(logThreads).concat(['total'])
    var logSourceData = []
    for(var time in logtmp){
        var _tmp = {'time':time-logMinTime,}
        var total = 0
        logThreads.forEach(thread => {
            _tmp[thread] = logtmp[time][thread]
            total += logtmp[time][thread]
        });
        _tmp['total'] = total
        logSourceData.push(_tmp)
    }


    ServiceThreadChart.setOption({
        title: { text: 'Service线程活跃图' },
        dataset: {
            dimensions: logDimensions,
            // dimensions: ['time'].concat(threads).concat(['total']),
            source: logSourceData
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {},
        tooltip: {},
        series: logSeries
    });


    var SyscallCountData = [["Syscall", "Count"]]
    const res2 = window.db.exec("SELECT syscall, count(*) FROM bpf GROUP BY syscall order by count(*) desc");
    SyscallCountData = SyscallCountData.concat(res2[0].values)

    BpfCountChart.setOption({
        title: { text: 'Syscall出现次数' },
        dataset: { source: SyscallCountData },
        tooltip: {},
        series: [{ type: 'pie' }]
    })

    var threads = []
    var series = []
    window.db.exec("select callingPid from bpf group by callingPid order by callingPid asc")[0].values.forEach(element => {
        threads.push(element[0])
        series.push({ type: 'line' })
    });
    series.push({ type: 'line' })
    var tmp = {}
    var minTime = undefined
    var lastTime = undefined
    window.BpfData.values.forEach(element => {
        var time = Math.round(element[1]/10000000)
        var callingPid = element[2]
        // var syscall = element[3]
        if(!lastTime){
            lastTime = time
            minTime = time
        }
        // while(lastTime < time){
        //     lastTime++
        //     tmp[lastTime] = {}
        //     threads.forEach(thread => {
        //         tmp[lastTime][thread] = 0
        //     })
        // }
        if(!tmp[time]){
            tmp[time] = {}
            threads.forEach(thread => {
                tmp[time][thread] = 0
            })
        }
        tmp[time][callingPid] += 1
    });

    var dimensions = ['time'].concat(threads).concat(['total'])
    var sourceData = []
    for(var time in tmp){
        var _tmp = {'time':time-minTime,}
        var total = 0
        threads.forEach(thread => {
            _tmp[thread] = tmp[time][thread]
            total += tmp[time][thread]
        });
        _tmp['total'] = total
        sourceData.push(_tmp)
    }


    BpfThreadChart.setOption({
        title: { text: 'Syscall线程活跃图' },
        dataset: {
            dimensions: dimensions,
            // dimensions: ['time'].concat(threads).concat(['total']),
            source: sourceData
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {},
        tooltip: {},
        series: series
    })

})

</script>