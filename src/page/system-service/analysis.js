import { ref } from "vue"

const analysisMap = {
    "ActivityManagerService": {
        "checkPermission": params => params.toString().split(",")[0].split(".").pop()
    },
    "ActivityTaskManagerService": {
        "startActivity": params => {
            var act = params.split("act=")[1].split(" ")[0]
            switch (act) {
                case "android.intent.action.CALL":
                    var tel = params.split("dat=")[1].split(" ")[0]
                    return "拨打电话 " + tel
                case "android.intent.action.SEND":
                    return "分享"
                case "android.intent.action.WEB_SEARCH":
                    return "web搜索"
                case "android.intent.action.EDIT":
                    return "为制定的数据显示可编辑界面"
                case "android.app.action.ADD_DEVICE_ADMIN":
                    return "增加设备管理权限"
                case "android.intent.action.ATTACH_DATA":
                    return "将数据附加到其他位置"
                case "android.intent.action.DELETE":
                    return "删除给定的数据"
                case "android.intent.action.SEARCH":
                    return "搜索"
                case "android.intent.action.PICK":
                    return "从数据中选择一个项目并返回"
                case "android.intent.action.PICK_ACTIVITY":
                    return "选择一个Activity并返回被选择的Activity的类名"
                case "android.intent.action.SENDTO":
                    return "向 data 指定的接收者发送一个消息"
                case "android.intent.action.GET_CONTENT":
                    return "让用户选择数据并返回"
                case "android.intent.action.DIAL":
                    return "拨打数据中指定的电话号码"
                case "android.intent.action.INSERT":
                    return "向容器中插入一个项目"
                case "android.provider.Telephony.ACTION_CHANGE_DEFAULT":
                    return "请求用户改变默认的短信应用"
                default:
                    return params
            }
        },
        "startActivityAsUser": params => analysisMap["ActivityTaskManagerService"]["startActivity"](params),
    },
    "LocationManagerService": {
        "sendExtraCommand": params => params,
    },
    "AudioService": {
        "adjustStreamVolume": params => {
            switch (params.split(",")[0].split(":")[1]) {
                case "0":
                    return "通话"
                case "1":
                    return "系统"
                case "2":
                    return "铃声"
                case "3":
                    return "音乐播放即媒体音量"
                case "4":
                    return "警报"
            }
        },
        "getDevices": params => params,
        "playSoundEffect": params => {
            switch (params.split(":")[1]) {
                case "0":
                    return "点击按键音"
                case "5":
                    return "标准按键音"
                case "6":
                    return "空格按键音"
                case "7":
                    return "删除按键音"
                case "8":
                    return "返回按键音"
                case "9":
                    return "无效按键音"
                default:
                    return params
            }
        },
    },
    "BluethManagerService": {
        "getConnectedDevices": params => params,
        "getDevicesMatchingConnectionStates": params => params,
    },
    "SensorManagerService": {
        "getDefaultSensor": params => params,
        "getDefaultSensor": params => params,
        "registerListener": params => params,
    }
}

const result = ref([])

const analyze = {
    process: (item) => {
        var tag = item[0]
        var timeStamp = Math.round(eval(item[1]) / 1000)
        var callingPid = item[2]
        var serviceName = item[3]
        var methodName = item[4]
        var parameters = item[5]

        if (!(serviceName in analysisMap) || !(methodName in analysisMap[serviceName])) return undefined
        if (!parameters || parameters == "") return undefined
        result.value.push({
            tag: tag,
            timeStamp: timeStamp,
            callingPid: callingPid,
            serviceName: serviceName,
            methodName: methodName,
            // parameters: parameters
            info: analysisMap[serviceName][methodName](parameters)
        })
    },
    result: result
}

export default analyze