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
      res.render('showProducts', {
        products: products,
        users: users,
        formatNumber: formatNumber,
      })
    })
  })
});
router.get('/show/:id',(req,res,next)=>{
  Product.findById(req.params.id,(err,products) => {
    User.find((err, users) => {
      res.render('admin/detail', {
        products: products,
        users: users,
        formatNumber: formatNumber,
      })
    })
  })
});

router.post('/cart/', function(req, res, next) {
  var product_id = req.body.product_id;
  req.session.cart = req.session.cart || {};
  var cart = req.session.cart; //ตะกร้าสินค้า
  Product.find({
    _id: product_id
  }, {}, function(err, product) {
    if (cart[product_id]) {
      cart[product_id].qty++;
    } else {
      product.forEach(function(item) {
        cart[product_id] = {
          item: item._id,
          title: item.name,
          price: item.price,
          qty: 1
        }
      });
    }
    console.log(cart);
    res.redirect('/product')
  });
});
router.get('/cart/',(req,res,next)=>{
  var cart = req.session.cart;
  var Distplaycart = {items:[],total:0};
  var total = 0;

  for(item in cart){
    Distplaycart.items.push(cart[item]);
    total += (cart[item].qty * cart[item].price);
  }
  Distplaycart.total = total;
  Product.find((err, products) => {
    User.find((err, users) => {
      res.render('cart', {
        products: products,
        users: users,
        formatNumber: formatNumber,
        cart : Distplaycart
      })
    })
  })
});
 


module.exports = router;
