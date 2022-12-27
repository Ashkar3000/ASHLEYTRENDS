var db = require("../configure/connection");
var collection = require("../configure/collections")
require("dotenv").config()
var objectid = require("mongodb").ObjectId;

const Razorpay = require('razorpay');

var instance = new Razorpay({
  key_id:process.env.KEY_ID ,
  key_secret:process.env.KEY_SECRET
});

module.exports={
    generaterRazorpay:(orderId,total)=>{
        return new Promise((resolve,reject)=>{
            var options = {
                amount: total*100,
                currency: "INR",
                receipt: ""+orderId
               
            };
            instance.orders.create(options,function(err,order){
                resolve(order)
            }) 
        })
    },
    verifyPayment:(details)=>{
        return new Promise((resolve,reject)=>{
            const crypto =require('crypto')
            let hmac = crypto.createHmac('sha256','8AU78e0AsPw9DII8H0BLfPpr')

            hmac.update(details['payment[razorpay_order_id]']+'|'+details['payment[razorpay_payment_id]'])
            hmac=hmac.digest('hex')
            if (hmac==details['payment[razorpay_signature]']) {
                resolve()
            }else{
                reject()
            }
        })
    },
    changePaymentStatus:(orderId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ORDER_COLLECTIONS)
            .updateOne({_id:objectid(orderId)},
            {
                $set:{
                    status:'Success'
                }
            }
            ).then(() => {
                resolve()
            })
        })
    }
}