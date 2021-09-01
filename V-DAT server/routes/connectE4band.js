var express = require('express');
var router = express.Router();
const axios = require('axios');
const db = require('./database/database');

var EmpaticaE4 = require('./E4_Band/E4_client');
var dev1 = new EmpaticaE4();
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
var date = moment().format('YYYY-MM-DD HH:mm:ss');


var serverip = '210.107.197.101';
const e4port = 28000;



router.post('/start', function (req, res){
    let connect = req.body.state;
    let deviceId = req.body.deviceId;
    let serverIp = req.body.serverIp;
    let e4Port = req.body.e4Port;
    let sensors = req.body.sensor;


    const sql = "insert into E4_band (device_name) values (?);";

    sList = [EmpaticaE4.E4_ACC, EmpaticaE4.E4_BVP, EmpaticaE4.E4_TEMP, EmpaticaE4.E4_GSR, EmpaticaE4.E4_IBI]

    let selectS = null;
    
    if(connect == true){
        dev1.connect(e4Port, serverIp, deviceId, function (data) {
            var sensorData = EmpaticaE4.getString(data);
            let sql = "INSERT INTO E4Low (value) VALUES (?);";
            
            
            
            db.pool.query(sql,[sensorData],function (err,result){
                if(err){
                    console.log(err);
                }
            })
            
        })

        sensors.forEach(element => {
            selectS = sList[element];
            setTimeout(function () {
                dev1.subscribe(selectS);
            }, 500);
        });

        // setTimeout(function () {
        //     dev1.subscribe(EmpaticaE4.E4_ACC);
        //     dev1.subscribe(EmpaticaE4.E4_BVP);
        // }, 1500);
        // setTimeout(function () {
        //     dev1.subscribe(EmpaticaE4.E4_TEMP);
        //     dev1.subscribe(EmpaticaE4.E4_GSR);
        // }, 2000)

        // setTimeout(function () {
        //     dev1.subscribe(EmpaticaE4.E4_IBI);
        // }, 3500)
    }
    res.send("start Ok")
})

router.post('/end', function (req, res){
    var connect = req.body.state;

    dev1.disconnect()     

    // if(connect == false){
    //     setTimeout(function () {
    //         dev1.unsubscribe(EmpaticaE4.E4_ACC);
    //         dev1.unsubscribe(EmpaticaE4.E4_BVP);
    //     }, 1500);
    //     setTimeout(function () {
    //         dev1.unsubscribe(EmpaticaE4.E4_TEMP);
    //         dev1.unsubscribe(EmpaticaE4.E4_GSR);
    //     }, 2000)

    //     setTimeout(function () {
    //         dev1.unsubscribe(EmpaticaE4.E4_IBI);
    //     }, 3500)
    // }

    res.send('End Ok');
})


module.exports = router;