import pymysql
from flask import Flask
import json

app = Flask(__name__)  # 初始化app
conn = pymysql.connect(
    host="10.177.83.229", port=3306, user="root", passwd="zzz123456.", db="log"
)
cur = conn.cursor()


@app.route("/")  # test
def index():
    return "Hello, World!"


@app.route("/tables")  # 获取数据库名
def get_tables():
    tables = []
    cur.execute("show tables;")
    for c in cur:
        tables.append(c[0])
    return json.dumps(tables)


@app.route("/data/<string:table_name>")
@app.route("/data/<string:table_name>/<int:page>")
def get_data_from_tables(table_name, page=0):
    tables = []
    cur.execute("show tables;")
    for c in cur:
        tables.append(c[0])
    if table_name not in tables:
        return "No such table"
    cur.execute("SELECT * FROM `" + table_name + "` LIMIT " + str(page * 50) + ",50;")
    data = []
    for r in cur:
        data.append(r)
    return json.dumps(data)


@app.route("/statistic/<string:table_name>")
def statistic(table_name):
    tables = []
    cur.execute("show tables;")
    for c in cur:
        tables.append(c[0])
    if table_name not in tables:
        return "No such table"
    cur.execute("SELECT * FROM `" + table_name + "`;")
    data = []
    time_min = -1
    time_max = -1
    threads = []
    for r in cur:
        data.append(r)
        if int(r[0]) > time_max or time_max < 0:
            time_max = int(r[0])
        if int(r[0]) < time_min or time_min < 0:
            time_min = int(r[0])
        if r[1] not in threads:
            threads.append(r[1])
    interval = (time_max - time_min) // 16
    figure = {"timeline": {}, "type_counts": {}, "threads": {}}
    for i in range(17):
        figure["timeline"][time_min + interval * i] = 0
        print(time_min + interval * i)
    for i in threads:
        figure["threads"][i] = {"timeline": {}, "type_counts": {}}
        for j in range(17):
            figure["threads"][i]["timeline"][int(time_min + int(interval * j))] = 0
    for i in data:
        if i[2] in figure["type_counts"]:
            figure["type_counts"][i[2]] += 1
        else:
            figure["type_counts"][i[2]] = 1
        if i[2] in figure["threads"][i[1]]["type_counts"]:
            figure["threads"][i[1]]["type_counts"][i[2]] += 1
        else:
            figure["threads"][i[1]]["type_counts"][i[2]] = 1
        print(int((int(i[0]) - time_min) / interval))
        figure["timeline"][
            time_min + interval * ((int(i[0]) - time_min) // interval)
        ] += 1
        figure["threads"][i[1]]["timeline"][
            time_min + interval * ((int(i[0]) - time_min) // interval)
        ] += 1
    return json.dumps(figure)


@app.route("/analysis/bpf/<string:table_name>")
def analysis_bpf(table_name):
    data = {}
    tables = []
    cur.execute("show tables;")
    for c in cur:
        tables.append(c[0])
    if table_name not in tables:
        return "No such table"
    if " BPF" not in table_name:
        return "Wrong table"
    return json.dumps(data)


@app.route("/analysis/api/<string:table_name>")
def analysis_api(table_name):
    data = {}
    tables = []
    cur.execute("show tables;")
    for c in cur:
        tables.append(c[0])
    if table_name not in tables:
        return "No such table"
    if " Log" not in table_name:
        return "Wrong table"
    return json.dumps(data)


if __name__ == "__main__":
    app.run("0.0.0.0", 8888)  # 运行app


# serviceName #methodName #parameters #callingUid #callingPid
