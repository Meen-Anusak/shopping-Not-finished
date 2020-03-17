var mongoose = require('mongoose');
var url = 'mongodb://localhost/m-shopping'

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

var ProductSchema = mongoose.Schema({
    namepd : {
        type : String
    },
    category:{
        type : String
    },
    price :{
        type : Number
    },
    image : {
        type : String
    },
    imgurl:{
        type : String
    },
    details : {
        type:String
    },
    Date : {
        type: Date,
        Default : Date.now()
    }
})

var Products = module.exports = mongoose.model('Product',ProductSchema);

module.exports.addProduct = function(newProduct,callback){
    newProduct.save(callback);
}