// 이 파일은 E4 band에서 통신을 진행하기 위한 기본적인 파일이다.


var EmpaticaE4 = function() {
    EmpaticaE4.getString = function (data) {
        return EmpaticaE4.conv(data, {out: "utf8"}).trim();
    }
};

var device_connect = "device_connect ";
var device_subscribe = "device_subscribe ";
var device_list = "device_list "
var server_status = "server_status ";
var ON = "ON";
var newline = " \n";

EmpaticaE4.prototype.onConnect = function(){
    console.log('Socket connected to', EmpaticaE4.ip,':',EmpaticaE4.port);
    var connCmd = device_connect + EmpaticaE4.deviceID + " \n";
    console.log(connCmd)
    var byteStream = EmpaticaE4.conv(connCmd, { in: 'binary' });
    EmpaticaE4.client.write(byteStream,'ascii');
};

EmpaticaE4.prototype.disconnect = function(){
    let connCmd = device_disconnect + EmpaticaE4.deviceID + "\n";
    let byteStream = EmpaticaE4.conv(connCmd, {in: 'binary'});
    EmpaticaE4.client.write(byteStream, 'ascii');
}



EmpaticaE4.prototype.connect = function(port, ip, deviceID, cb) {
    //sensor variables
    EmpaticaE4.E4_ACC		= "acc";					//3-axis accleration
    EmpaticaE4.E4_BVP 		= "bvp";					//Blood Volume Pulse
    EmpaticaE4.E4_GSR		= "gsr";					//Galvanic Skin Response
    EmpaticaE4.E4_TEMP		= "tmp";					//Skin Temperature
    EmpaticaE4.E4_IBI		= "ibi";					//Interbeat Interval
    EmpaticaE4.E4_BATT		= "bat";					//Device Battery
    EmpaticaE4.E4_TAG 		= "tag";					//Device Tag

    //connection data
    EmpaticaE4.port = port;								//port nummber
    EmpaticaE4.ip = ip;									//EmpaticaBLEserver ip address
    EmpaticaE4.deviceID = deviceID;						//Empatica E4 Device id..dispalyed in Empatica BLE Server after server connection with device
    EmpaticaE4.isConnected = false;

    //library imports
    EmpaticaE4.net = require('net');					//for sokets
    EmpaticaE4.conv = require('binstring');				//to convert string to byte stream
    EmpaticaE4.client = new EmpaticaE4.net.Socket();	//to make connection with server

    //make connection request to the server
    EmpaticaE4.client.connect(EmpaticaE4.port, EmpaticaE4.ip, this.onConnect);

    EmpaticaE4.client.on('data', cb);
};

EmpaticaE4.prototype.subscribe = function (sensor) {
    var cmd = device_subscribe+ sensor +' ON' + newline;
    console.log(cmd)
    var cmdBinary = EmpaticaE4.conv(cmd, { in:'binary' });
    EmpaticaE4.client.write(cmdBinary,'ascii');
}


EmpaticaE4.prototype.server = function () {
    var cmd = server_status + newline;
    var cmdBinary = EmpaticaE4.conv(cmd, {in: 'binary'});
    EmpaticaE4.client.write(cmdBinary,'ascii');
}

EmpaticaE4.prototype.unsubscribe = function (senser){
    var cmd = device_subscribe + senser + ' OFF' + newline;
    var cmdBinary = EmpaticaE4.conv(cmd, { in:'binary' });
    EmpaticaE4.client.write(cmdBinary,'ascii');
}

module.exports = EmpaticaE4;