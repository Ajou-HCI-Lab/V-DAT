var express = require('express');
var router = express.Router();
const db = require('./database/database');

var net = require('net');


const ipaddr = '192.168.0.3';
const port = 5555;

// unity 와 통신을 진행하기 위한 코드이다.



var server = net.createServer(function (socket) {

    const sql = 'INSERT INTO temp (data) VALUES (?)';
    const sql2 = 'insert into 시간 테이블 이름 values (?);';
    console.log(socket.address().address + " connected");

    socket.setEncoding('utf-8');

    socket.on('data', function (data) {

        console.log('data: ' + data);
        if(data.length < 6){
            db.pool.query(sql2, data, function (err, result){})
            if(err){
                console.log(err)
            }
        }else{
            db.pool.query(sql, data, function (err, result) {
                if (err) {
                    console.log(err)
                }
            })

        }
    });

    socket.on('close', function () {
        console.log('close');
    });

    socket.write('welcome server');

});

server.on('error', function (error) {
    console.log('error :' + error);
});

server.listen(port, ipaddr, function () {
    console.log(port,ipaddr)
    server.on('connection', function () {
        console.log(`listening on 5555`);
    });
});


module.exports = router;

