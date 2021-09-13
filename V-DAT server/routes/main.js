var express = require('express');
var router = express.Router();
const db = require('./database/database');
const axios = require('axios');
let fs = require('fs');
const dbPromise = require('./database/databasePromise');
/* GET users listing. */

const getAnal = () => {
    try {
        return axios.get('http://192.168.35.9:80/hello');
    } catch (error) {
        console.log(error)
    }

};

const getReturn = () => {
    const r = getAnal()
        .then(response => {
            console.log(response.data)
        })
        .catch(error => {
            console.log(error)
        })
};

router.post('/getData', (req, res) => {

    const sql = "select * from E4Low;";
    const date = new Date();


    getReturn();


    // db.pool.query(sql, function(err, result){
    //     if(err){
    //         console.log(err);
    //     }else {
    //
    //         const json_array = result;
    //         let csv_string = '';
    //         const titles = Object.keys(result[0]);
    //
    //         titles.forEach((title, index)=>{ csv_string += (index !== titles.length-1 ? `${title},` : `${title}\r\n`); });
    //         json_array.forEach((content, index)=> {
    //
    //             let row = ''; // 각 인덱스에 해당하는 '내용'을 담을 행
    //
    //             for (let title in content) {
    //                 row += (row === '' ? `${content[title]}` : `,${content[title]}`);
    //             }
    //
    //             csv_string += (index !== json_array.length-1 ? `${row}\r\n`: `${row}`);
    //
    //         })
    //
    //         fs.writeFileSync('1.csv', csv_string);
    //
    //         res.setHeader("Content-disposition", "attachment; filename="+ date.getTime() +'.csv');
    //         res.set('Content-Type', 'text/csv');
    //         fs.createReadStream('./1.csv')
    //             .pipe(res)
    //             .on('finish', ()=>{
    //             console.log('download complete')
    //         })
    //     }
    // })


    res.send('hello')


})

module.exports = router;
