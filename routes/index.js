var express = require('express');
var router = express.Router();
var Product = require('../model/Model_Product');
var User = require('../model/Model_users');



var formatNumber = function (num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
/* GET home page. */
router.get('/', function (req, res, next) {
  Product.find((err, products) => {
    User.find((err, users) => {
      res.render('index', {
        products: products,
        users: users,
        formatNumber: formatNumber,
      })
    })
  })
});

module.exports = router;
