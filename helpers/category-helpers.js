
var db = require("../configure/connection");
var collection = require("../configure/collections");
var objectid = require("mongodb").ObjectId;

module.exports = {
  addCategory:(category)=>{
    return new Promise((resolve,reject)=>{
       db.get()
       .collection(collection.CATEGORY_COLLECTIONS)
       .findOne({name:category.name}).then((response) => {
         if (response) {
           let data ={}
           data.status="This Category is already exist"
           reject(data)
        } else {
          
          let cateObj={
            name:category.name,
            discount:parseInt(category.discount),
            description:category.description
          }
          db.get()
          .collection("category")
          .insertOne(cateObj)
          .then(() => {
            resolve()
          })
        }
       })
    })
  },
  updateCategory: (cateId, category) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CATEGORY_COLLECTIONS)
        .updateOne(
          { _id: objectid(cateId) },
          {
            $set: {
              name:category.name,
              discount:parseInt(category.discount),
              description:category.description
            },
          }
        )
        .then((response) => {
          db.get()
              .collection(collection.CATEGORY_COLLECTIONS)
              .findOne({ _id: objectid(cateId) })
              .then((response) => {
                let val = 1 - response.discount / 100;
                db.get()
                  .collection(collection.PRODUCT_COLLECTION)
                  .updateMany(
                    { category: response.name },
                    [{
                      $project: {
                        brand: 1,
                        product: 1,
                        description: 1,
                        category: 1,
                        price:1,
                        imagefileName: 1,
                        offerprice: {$round: [{ $multiply: ["$price", val] }, 0]  },
                      },
                    },
                    { $set: { offerprice: "$offerprice" } }]
                  )
                  .then((response) => {
                    resolve();
                  });
              });    
        });
    });
  },
  getAllCategory: () => {
    return new Promise(async (resolve, reject) => {
      let category = await db
        .get()
        .collection(collection.CATEGORY_COLLECTIONS)
        .find()
        .sort({time:-1})
        .toArray();
      resolve(category);
    });
  },
  viewAllCategory: () => {
    return new Promise(async (resolve, reject) => {
      let category = await db
        .get()
        .collection(collection.CATEGORY_COLLECTIONS)
        .find()
        .toArray();
      resolve(category);
    });
  },
  deleteCategory: (catId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CATEGORY_COLLECTIONS)
        .deleteOne({ _id: objectid(catId) })
        .then((response) => {
          resolve(response);
        });
    });
  },
  getCatergoryDetails: (cateId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CATEGORY_COLLECTIONS)
        .findOne({ _id: objectid(cateId) })
        .then((category) => {
          resolve(category);
        });
    });
  },

};
