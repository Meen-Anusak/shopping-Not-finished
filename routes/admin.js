var express = require('express');
var router = express();
var Product = require('../model/Model_Product');
const { check, validationResult } = require('express-validator');
var multer = require('multer');
var User = require('../model/Model_users');
var gm = require('gm').subClass({ imageMagick: true });

var substring = function (text, length) {
  return text.substring(0, length);
}
var formatNumber = function (num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}


var storage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, './public/images/');
  // },
  filename: function (req, file, cb) {
    cb(null, Date.now() + ".jpg");
  },
});

var upload = multer({
  storage: storage
}).single('image');

router.get('/', (req, res, next) => {
  Product.find((err, products) => {
    User.find((err, users) => {
      res.render('admin/admin.ejs', {
        products: products,
        users: users,
        substring: substring,
        formatNumber: formatNumber,
      })
    })
  })
})
router.get('/addproduct', (req, res, next) => {
  res.render('admin/addproduct')
})
router.post('/addproduct', upload, [
  check('namepd', 'กรุณาป้อนชื่อสินค้า').not().isEmpty(),
  check('category', 'กรุณาป้อนประเภทสินค้า').not().isEmpty(),
  check('price', 'กรุณาป้อนราคาสินค้า').not().isEmpty(),
  check('details', 'กรุณาป้อนรายระเอียดสินค้า').not().isEmpty(),
], (req, res, next) => {
  var result = validationResult(req);
  var errors = result.errors;
  if (!result.isEmpty()) {
    res.render('admin/addproduct', {
      errors: errors
    })
  } else {
    if (req.file) {
      var images = req.file.filename;
    } else {
      var images = "No Image";
    }
    var width = 1000;
    var heigth = 1000;
    gm(req.file.path)
      .resize(width, heigth, '^')
      .gravity('Center')
      .extent(width, heigth)
      .noProfile()
      .write('./public/images/product/' + req.file.filename + "", function (err) {
        if (err) {
          throw err
        }
      })

    var newProduct = new Product({
      namepd: req.body.namepd,
      category: req.body.category,
      price: req.body.price,
      image: images,
      imgurl: req.body.imgurl,
      details: req.body.details,

    })
    Product.addProduct(newProduct, function (err, data) {
      if (err) throw err;
    })
    res.redirect('/admin/addproduct');
  }
})

router.get('/products',(req,res,next)=>{
  Product.find((err,products)=>{
    User.find((err,users)=>{
      res.render('admin/showProducts.ejs',{
        products: products,
        users : users,
        formatNumber : formatNumber,
        substring : substring,
      })
    })
  })
})

module.exports = router;