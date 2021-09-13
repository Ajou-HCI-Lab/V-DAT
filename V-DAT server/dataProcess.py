# -*- coding: utf-8 -*-
import time
from flask import Flask  # 서버 구현을 위한 Flask 객체 import
from flask_restx import Api, Resource  # Api 구현을 위한 Api 객체 import
from flask_cors import CORS
import pymysql
import pandas as pd
from sqlalchemy import create_engine

pymysql.install_as_MySQLdb()


app = Flask(__name__)  # Flask 객체 선언, 파라미터로 어플리케이션 패키지의 이름을 넣어줌.
api = Api(app)  # Flask 객체에 Api 객체 등록
app.config['JSON_AS_ASCII'] = False

CORS(app, resources={r'/*': {'origins': '*'}})


def db_connect():
    result = pymysql.connect(
        user='root',
        passwd='sh080911',
        host='localhost',
        db='v_dat',
        charset='utf8'
    )
    return result


def convert_unixtime(date_time):
    """Convert datetime to unixtime"""
    import datetime
    unixtime = datetime.datetime.strptime(date_time,
                                          '%Y-%m-%d %H:%M:%S').timestamp()
    return unixtime


def get_average(hz, data):
    temp = 0
    average = []
    for i in range(1, int(len(data) / hz) + 1):
        sum = 0
        count = hz * i
        for j in range(temp, count):
            value = data[j][2]
            try:
                sum += float(value)
            except:
                continue
        average.append(sum / hz)
        temp += hz
    return average


def data_extraction(data):
    data_GMT = float(data[1])
    tm = time.localtime(float(data[1]))
    data_KST = time.strftime('%Y-%m-%d %I:%M:%S %p', tm)
    value = data[2]

    return data_GMT, data_KST, value


def acc_extraction(data):
    data_GMT = float(data[1])
    tm = time.localtime(float(data[1]))
    data_KST = time.strftime('%Y-%m-%d %I:%M:%S %p', tm)
    x, y, z = data[2:]

    return data_GMT, data_KST, x, y, z

@api.route('/hello')  # 데코레이터 이용, '/hello' 경로에 클래스 등록
class HelloWorld(Resource):
    def get(self):  # GET 요청시 리턴 값에 해당 하는 dict를 JSON 형태로 반환
        return {"hello": "world!"}


# 이 class는 EDA 결과를 저장하는 APi 이다.
@api.route('/eda')
class makeEDA(Resource):
    def get(self):

        engin = create_engine(
            "mysql+mysqldb://root:sh080911@localhost:3306/v_dat",
            encoding='utf-8')

        db = db_connect()
        cursor = db.cursor(pymysql.cursors.DictCursor)
        sql1 = 'SELECT value FROM E4Low;'
        cursor.execute(sql1)
        result = cursor.fetchall()
        result = pd.DataFrame(result)

        idx = result[(result['value'] == 'R device_connect OK') | (result['value'] == 'R device_subscribe bvp OK') |
                     (result['value'] == 'R device_subscribe tmp OK') | (
            result['value'] == 'R device_subscribe gsr OK') |
            (result['value'] == 'R device_subscribe ibi OK') | (
            result['value'] == 'R device_subscribe acc OK')].index
        result = result.drop(idx)
        result = result.reset_index(drop=True)

        df = pd.DataFrame()
        for i in range(len(result)):
            pre_df = pd.DataFrame(result['value'].loc[i].split('\n'))
            df = pd.concat([df, pre_df])

        df = df.reset_index(drop=True)
        df.columns = ['data']

        temp = []
        error = []
        for i in range(len(df)):
            try:
                temp.append(float(df.loc[i]['data'].split(' ')[1]))
            except:
                error.append(i)

        a = list(range(0, len(df)))
        df['index'] = a
        for i in range(len(error)):
            d = error[i]
            idx = df[(df['index'] == d)].index
            df = df.drop(idx)

        df['time'] = temp
        df = df.drop(['index'], axis=1)
        df = df.reset_index(drop=True)

        database = df.values.tolist()  # type : list
        E4_Acc, E4_Bvp, E4_Eda, E4_Ibi, E4_Temp, E4_Hr = [], [], [
        ], [], [], []  # structure : data_GMT, date_KST, value

        for i in range(len(database)):
            data = database[i][0].split(" ")
            if len(data) > 2:
                if data[0] == 'E4_Acc':
                    data_GMT, data_KST, x, y, z = acc_extraction(data)
                    E4_Acc.append([data_GMT, data_KST, x, y, z])
                elif data[0] == 'E4_Bvp':
                    data_GMT, data_KST, value = data_extraction(data)
                    E4_Bvp.append([data_GMT, data_KST, value])
                elif data[0] == 'E4_Gsr':
                    data_GMT, data_KST, value = data_extraction(data)
                    E4_Eda.append([data_GMT, data_KST, value])
                elif data[0] == 'E4_Ibi':
                    data_GMT, data_KST, value = data_extraction(data)
                    E4_Ibi.append([data_GMT, data_KST, value])
                elif data[0] == 'E4_Temperature':
                    data_GMT, data_KST, value = data_extraction(data)
                    E4_Temp.append([data_GMT, data_KST, value])
                elif data[0] == 'E4_Hr':
                    data_GMT, data_KST, value = data_extraction(data)
                    E4_Hr.append([data_GMT, data_KST, value])

    #         E4_Bvp_avg = get_average(16, E4_Bvp)
    #         E4_Ibi_avg = get_average(16, E4_Ibi)

        accColumn = ['unixTime', 'krTime', 'x', 'y', 'z']
        column = ['unixTime', 'krTime', 'value']

        e4Acc = pd.DataFrame(E4_Acc, columns=accColumn)
        e4Bvp = pd.DataFrame(E4_Bvp, columns=column)
        e4Eda = pd.DataFrame(E4_Eda, columns=column)
        e4Temp = pd.DataFrame(E4_Temp, columns=column)
        e4Ibi = pd.DataFrame(E4_Ibi, columns=column)
        e4Hr = pd.DataFrame(E4_Hr, columns=column)

        e4Acc.to_sql(name="e4Acc", con=engin, if_exists='replace', index=False)
        e4Bvp.to_sql(name="e4Bvp", con=engin, if_exists='replace', index=False)
        e4Eda.to_sql(name="e4Eda", con=engin, if_exists='replace', index=False)
        e4Temp.to_sql(name="e4Temp", con=engin,
                      if_exists='replace', index=False)
        e4Ibi.to_sql(name="e4Ibi", con=engin, if_exists='replace', index=False)
        e4Hr.to_sql(name="e4Hr", con=engin, if_exists='replace', index=False)

        return "Done"


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=80)
