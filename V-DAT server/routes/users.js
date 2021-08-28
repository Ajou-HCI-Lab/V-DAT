var express = require('express');
var router = express.Router();
const db = require('./database/database');
var jwt = require('jsonwebtoken');

router.post('/login', function (req, res) {
  var user_ID = req.body.user_ID;
  var pw = req.body.pw;

  var sql = 'SELECT *  FROM users WHERE user_ID = ? AND pw = ?';

  db.pool.query(sql, [user_ID, pw], function (err, result) {
    if (err) {
      console.error(err);
      throw err;
    } else {
      if (result[0] !== undefined) {
        //login success
        let id = result[0].id; //db id
        jwt.sign(
            {
              id: id,
            },
            req.app.get('jwt-secret'),
            {
              expiresIn: '30d',
              issuer: 'ajou-hci-server',
              subject: 'userInfo',
            },
            function (err, token) {
              if (err) {
                console.error(err);
                throw err;
              } else {
                var responseData = {
                  success: 1,
                  token: token,
                };
                console.log(responseData)

                res.json(responseData);
              }
            }
        );
      } else {
        res.json({success: 0});
      }
    }
  });
});

router.post('/join',(req,res)=>{

  const {pw,email} = req.body.userInfo

  let searchSql = 'select id from users where user_ID = ?'
  let searchParam = [email]
  db.pool.query(searchSql,searchParam,(err,rows1)=>{
    console.log(err)
    if(rows1.length===0) {
      let sql = 'insert into users (user_ID, pw) VALUES (?,?)'
      let param = [email,pw]
      db.pool.query(sql,param,(err,rows) =>{
        console.log(err)
        if(rows.affectedRows ===1) res.json(1)
        else {
          console.error(err)
          res.json(0)
        }
      })
    }
    else res.json(-1)

  })




})

module.exports = router;
