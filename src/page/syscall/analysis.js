const analyzeResult = {
    fileOpenCount: {

    },
    cmdExecutedCount:{

    },
    connectCount:{

    }
}

// const memory = {

// }


const analysisMap = {
    "openat":item=>{
        var callingPid = item[2]

        var path = item[5]
        var ret = item[6]
        
        if(!path)return

        // if(!memory[callingPid])memory[callingPid] = {}
        // memory[callingPid][ret] = path

        analyzeResult.fileOpenCount[path] = analyzeResult.fileOpenCount[path] ? analyzeResult.fileOpenCount[path] + 1 : 1
    },
    // "dup":item=>"dup",
    // "dup3":item=>"dup3",
    "connect":item=>{
        var callingPid = item[2]
        var host = item[5]
        
        if(!host)return

        analyzeResult.connectCount[host] = analyzeResult.connectCount[host] ? analyzeResult.connectCount[host] + 1 : 1
    },
    // "bind":item=>"bind",
    "execve":item=>{
        var callingPid = item[2]
        var cmd = item[5]
        
        if(!cmd || cmd == "")return

        analyzeResult.cmdExecutedCount[cmd] = analyzeResult.cmdExecutedCount[cmd] ? analyzeResult.cmdExecutedCount[cmd] + 1 : 1
    },
    // "read":{

    // },
    // "readv":{

    // },
    // "pread64":{

    // },
    // "preadv":{

    // },
    // "write":{

    // },
    // "writev":{

    // },
    // "pwrite64":{

    // },
    // "pwritev":{

    // },
    // "recvmsg":item=>"recvmsg",
    // "recvfrom":item=>"recvfrom",
    // "sendmsg":item=>"sendmsg",
    // "sendto":item=>"sendto",
}

const analyze = {
    process : (item) =>{
        var syscall = item[3]
        if(!(syscall in analysisMap))return
        analysisMap[syscall](item)
    },
    analyzeResult : analyzeResult
}

export default analyze
