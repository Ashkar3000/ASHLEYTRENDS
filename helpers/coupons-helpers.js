var db = require("../configure/connection");
var collection = require("../configure/collections");
var objectid = require("mongodb").ObjectId;

module.exports={
      addcoupons:(coupons)=>{
        return new Promise((resolve,reject)=>{
            let couponsObj={
              code:coupons.code,
              date:coupons.date,
              percentage:parseInt(coupons.percentage),
              miniamt:parseInt(coupons.miniamt),
              maxamt:parseInt(coupons.maxamt),
              image:coupons.imagefileName,
              description:coupons.description
            }
            db.get()
            .collection(collection.COUPONS_COLLECTIONS)
            .insertOne(couponsObj).then(() => {
            resolve()
            })
        })
    },getAllCoupons:()=>{
        return new Promise((resolve,reject)=>{
            let coupons=db.get().collection(collection.COUPONS_COLLECTIONS)
            .find()
            .sort({time:-1})
            .toArray()
            resolve(coupons)
        })
    },editcoupons:(copid,coupons)=>{
        return new Promise((resolve, reject) => {
        db.get()
        .collection(collection.COUPONS_COLLECTIONS)
        .updateOne(
          { _id: objectid(copid) },
          {
            $set:{
              code:coupons.code,
              date:coupons.date,
              percentage:parseInt(coupons.percentage),
              miniamt:parseInt(coupons.miniamt),
              maxamt:parseInt(coupons.maxamt),
              image:coupons.imagefileName,
              description:coupons.description
            },
          }
        )
        .then((response) => {
          resolve();
        })
        })
    },getCoupons:(copid)=>{
        return new Promise(async(resolve, reject) => {
            await db.get()
            .collection(collection.COUPONS_COLLECTIONS)
            .findOne({_id:objectid(copid)})
            .then((coupons) => {
                 resolve(coupons) 
               })
        })
    },deleteCoupons:(copid)=>{
        return new Promise((resolve, reject) => {
            db.get()
            .collection(collection.COUPONS_COLLECTIONS)
            .deleteOne(
                {
                  _id: objectid(copid)
                }
              )
              .then(() => {
                resolve();
              })
        })
    },
    getCoupon:(data,userId,total)=>{
      return new Promise(async(resolve, reject) => {
        let coupon=await db.get().collection(collection.COUPONS_COLLECTIONS)
        .findOne({code:data})
        if (coupon) {
         
        let cip = coupon._id;
        const expireDate = new Date(coupon.date)
        if (expireDate>= new Date()) {
            let usedCoupon = await db.get().collection(collection.USERS_COLLECTION).findOne({$and:[{_id:objectid(userId)},{coupons:{$in:[coupon._id]}}]})
           if(usedCoupon){
            response.usedCoupon = true;
            response.usedCouponMsg = "Coupon is Already used"
            resolve(response)
          }
          else{
            coupon.usedCoupon = true;
          }
          coupon.dateChecked = true;
          // resolve(checkCoupon);
          if (total >= coupon.miniamt) {
            coupon.minChecked = true;
          } else {
            response.minChecked = true;
            response.maxAmountMsg =
              "your maximum purchase should be" + coupon.miniamt;
            resolve(response);
          }
        } else {
          response.dateChecked = true;
          response.dateInvalidMessage = "Date is expired";
          resolve(response);
        }
      } else {
        response.invalidCoupon = true;
        response.invalidMessage = "This coupon code is invalid";
        resolve(response);
      }

      if (coupon && coupon.dateChecked && coupon.minChecked && coupon.usedCoupon) {
        coupon.couponVerified = true;
        resolve(coupon);
      } else {
        reject("coupon not found");
      }
    })  
    },
    insertCouponId: (userId,couponId)=>{
        return new Promise((resolve,reject) => {
          db.get().collection(collection.USERS_COLLECTION).updateOne({_id:objectid(userId)},{
            $push:{coupons:objectid(couponId)}
          }).then(()=>{
            resolve();
          })
        })
    },findWalletTotal:(userId)=>{
        return new Promise(async(resolve, reject) => {
          let wallet=await db.get().collection(collection.WALLET_COLLECTION).findOne({user:objectid(userId)})
          resolve(wallet.Amount)
        })
      },
      walletPurchase:(userId,price)=>{
        return new Promise((resolve, reject) => {
          details = {
            From: "Purchase",
            credited: -price,
            Time: new Date(),
          };
          db.get()
            .collection(collection.WALLET_COLLECTION)
            .updateOne(
              { user: objectid(userId) },
              { $inc: { Amount: parseInt(-price) }, $push: { history: details } }
            )
            .then((response) => {
              resolve();
            });
          })
      },     
}
