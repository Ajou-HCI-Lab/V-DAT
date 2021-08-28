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
var oldDevice = '';


const mysql = require('mysql');

router.get('/getName', function (req, res){
    const sql = "select name, thumbnail from vr;"
    db.pool.query(sql, function (err, result){
        if(err){
            console.log(err)
        }else{
            res.json(result)
        }
    })
})


router .post('/start', function (req, res){
    var connect = req.body.state;
    var deviceId = "F0CB11";
    var user = req.body.user;
    var logId = null;
    const sql = "insert into E4_band (device_name) values (?);"


    // for(let i =0; i<oldDevice.length; i++){
    //     if (deviceId == oldDevice[i].device_name ){
    //         break;
    //     }else{
    //         db.pool.query(sql, [deviceId], function (err, r){
    //             if(err) {
    //                 console.log(err)
    //             }
    //         })
    //     }
    // }

    if(connect == true){
        dev1.connect(e4port, serverip, deviceId, function (data) {
            var sensorData = EmpaticaE4.getString(data);
            let sql = "INSERT INTO E4Low (value) VALUES (?);";



            db.pool.query(sql,[sensorData],function (err,result){
                if(err){
                    console.log(err);
                }
            })

        })

        setTimeout(function () {
            dev1.subscribe(EmpaticaE4.E4_ACC);
            dev1.subscribe(EmpaticaE4.E4_BVP);
        }, 1500);
        setTimeout(function () {
            dev1.subscribe(EmpaticaE4.E4_TEMP);
            dev1.subscribe(EmpaticaE4.E4_GSR);
        }, 2000)

        setTimeout(function () {
            dev1.subscribe(EmpaticaE4.E4_IBI);
        }, 3500)
    }
    res.send("start Ok")
})

router.post('/end', function (req, res){
    var connect = req.body.state;

    console.log(connect)

    if(connect == false){
        setTimeout(function () {
            dev1.unsubscribe(EmpaticaE4.E4_ACC);
            dev1.unsubscribe(EmpaticaE4.E4_BVP);
        }, 1500);
        setTimeout(function () {
            dev1.unsubscribe(EmpaticaE4.E4_TEMP);
            dev1.unsubscribe(EmpaticaE4.E4_GSR);
        }, 2000)

        setTimeout(function () {
            dev1.unsubscribe(EmpaticaE4.E4_IBI);
        }, 3500)
    }

    res.send('End Ok');
})


module.exports = router;