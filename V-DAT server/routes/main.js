var express = require('express');
var router = express.Router();
const db = require('./database/database');
const dbPromise = require('./database/databasePromise');
/* GET users listing. */


router.post('/getData', (req, res) => {
    
    const sql = "select * from e4Acc " +
                "INTO OUTFILE '~/e4Acc.csv' " +
                "FIELDS TERMINATED BY ',' " + 
                "LINES TERMINATED BY '\n';";

    db.pool.query(sql, function(err, res){
        try{
            console.log(err);
        }catch{
            console.log(res);
        }
    })

    res.send('Done');
})

module.exports = router;
