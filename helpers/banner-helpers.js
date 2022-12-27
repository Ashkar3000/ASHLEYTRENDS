var db = require("../configure/connection");
var collection = require("../configure/collections");

var objectid = require("mongodb").ObjectId;

module.exports={
    addbanners:(banner)=>{
        return new Promise((resolve,reject)=>{
            let bannerObj={
                banners:{
                    title:banner.title,
                    description:banner.description,
                    image:banner.imagefileName,
                    banner_date: new Date().getDate()+"-"+(new Date().getMonth() + 1)+"-"+new Date().getFullYear(),
                    banner_time:new Date().getHours()+":"+new Date().getMinutes(),
                    month:new Date().getFullYear()+"-"+Number(new Date().getMonth()+1),
                    year:new Date().getFullYear(),
                    time:new Date().getTime()
                }
            }
            db.get()
            .collection(collection.BANNER_COLLECTIONS)
            .insertOne(bannerObj)
            .then((result) => {
              resolve()  
            })
        })
    },
    getAllBanners:()=>{
        return new Promise((resolve,reject)=>{
            let banners=db.get()
            .collection(collection.BANNER_COLLECTIONS)
            .find()
            .sort({time:-1})
            .toArray()
            resolve(banners)
        })
    },deleteBanners:(banid)=>{
        return new Promise((resolve, reject) => {
            db.get()
            .collection(collection.BANNER_COLLECTIONS)
            .deleteOne(
                {
                  _id: objectid(banid)
                }
              )
              .then(() => {
                resolve();
              })
        })
    }

}