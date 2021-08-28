var express = require('express');
var router = express.Router();
const db = require('./database/database');
const dbPromise = require('./database/databasePromise');
/* GET users listing. */


router.post('/getData', (req, res) => {
    let video_id=1
    let sql = 'select * from video where id = ?;' +
        'select timelines.id, time,timer,data,label from video left join timelines on video.id = timelines.video_id where video.id=? order by timelines.id'
    let param = [video_id,video_id]
    db.pool.query(sql, param, (err, rows) => {
        console.log(err)
        res.json(rows)
    })

})


module.exports = router;
