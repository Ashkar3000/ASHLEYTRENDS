var db=require('../configure/connection')
var collection=require('../configure/collections')
var objectid=require('mongodb').ObjectId

module.exports = {

    addProduct:(product)=>{
        return new Promise((resolve,reject)=>{

            let proObj ={
                name : product.name,
                category :product.category,
                brand : product.brand,
                description:product.description,
                price : parseInt(product.price),
                discount :parseInt(product.discount),
                offerprice:parseInt(product.offerprice),
                stocks : parseInt(product.stocks),
                image:product.imagefileName,
                product_date: new Date().getDate()+"-"+(new Date().getMonth() + 1)+"-"+new Date().getFullYear(),
                product_time:new Date().getHours()+":"+new Date().getMinutes(),
                month:new Date().getFullYear()+"-"+Number(new Date().getMonth()+1),
                year:new Date().getFullYear(),
                time:new Date().getTime()
            }
            db.get().collection('product').insertOne(proObj).then(() => {
                resolve()
        })
        })     
        
    },
    
    getAllProductsshop:()=>{
        return new Promise (async(resolve,reject)=>{
            let products=await db.get().collection(collection.PRODUCT_COLLECTION)
            .find()
            .sort({time:-1})
            .toArray()
            resolve(products)
        })
    },

    getAllProducts:()=>{
        return new Promise (async(resolve,reject)=>{
            let products=await db.get().collection(collection.PRODUCT_COLLECTION)
            .find()
            .sort({time:-1})
            .limit(8)
            .toArray()
            resolve(products)
        })
    },

    deleteProduct:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:objectid(proId)}).then((response) => {
                resolve(response)
            })
        })
    },
    getProductDetails:(prodId)=>{
        return new Promise((resolve,reject)=>{
          db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectid(prodId)}).then((product) => {
            resolve(product) 
          })
        })
    },
    updateProduct:(prodId,proDetails)=>{
        return new Promise((resolve,reject)=>{
            if (proDetails.imagefileName.length>0) {
                
                db.get().collection(collection.PRODUCT_COLLECTION)
                .updateOne(
                    {_id:objectid(prodId)},
                    {
                    $set:{
                       name:proDetails.name,
                       category : proDetails.category,
                       brand:proDetails.brand,
                       description:proDetails.description,
                       price: parseInt(proDetails.price),
                       discount :parseInt(proDetails.discount),
                       offerprice:parseInt(proDetails.offerprice),
                       stocks:parseInt(proDetails.stocks),
                       image:proDetails.imagefileName,
                       product_date: new Date().getDate()+"-"+(new Date().getMonth() + 1)+"-"+new Date().getFullYear(),
                       product_time:new Date().getHours()+":"+new Date().getMinutes(),
                       month:new Date().getFullYear()+"-"+Number(new Date().getMonth()+1),
                       year:new Date().getFullYear(),
                       time:new Date().getTime()
                    }
                }
                )
                .then((response) => {
                    resolve(response)
                })
            } else {
                db.get().collection(collection.PRODUCT_COLLECTION)
                .updateOne(
                    {_id:objectid(prodId)},
                    {
                    $set:{
                       name:proDetails.name,
                       category:proDetails.category,
                       brand:proDetails.brand,
                       description:proDetails.description,
                       price:parseInt(proDetails.price),
                       discount :parseInt(proDetails.discount),
                       offerprice:parseInt(proDetails.offerprice),
                       stocks:parseInt(proDetails.stocks),
                       product_date: new Date().getDate()+"-"+(new Date().getMonth() + 1)+"-"+new Date().getFullYear(),
                       product_time:new Date().getHours()+":"+new Date().getMinutes(),
                       month:new Date().getFullYear()+"-"+Number(new Date().getMonth()+1),
                       year:new Date().getFullYear(),
                       time:new Date().getTime() 
                    }
                }
                )
                .then((response) => {
                    resolve(response)
                })
            }
        })
    }
}
