const express = require("express");
const router = express.Router();
const productHelpers = require("../helpers/product-helpers");
const categoryHelpers = require("../helpers/category-helpers");
const usersHelpers = require("../helpers/users-helpers");
const orderHelpers = require("../helpers/order-helpers")
const bannerHelpers = require("../helpers/banner-helpers")
const couponsHelpers = require("../helpers/coupons-helpers")
const salesreportHelpers = require("../helpers/salesreport-helper")
const chartHelpers = require("../helpers/chart-helpers")
const upload = require("../middleware/multier")
require("dotenv").config()

let admindm = process.env.ADMIN;
let passworddm = process.env.PASSWORD;

module.exports={
    adminlogin:(req,res)=>{
        res.render("admin/adminlogin");
    },

    adminlogout:(req, res, next)=>{
        res.render("admin/adminlogin");
    },

    adminhome:(req, res) => {
        res.render("admin/adminhome");
    },

    padminhome:(req, res, next) => {
         const admin = req.body.admin;
         const password = req.body.password;
         if (admin === admindm && password === passworddm) {
           res.redirect("/admin/adminhome");
        }
    },

    userslist:(req, res, next) => {
        usersHelpers.getAllUsers().then((users) => {
        res.render("admin/userslist", { users });
       });
    },

    block:(req, res, next) => {
         usersHelpers.updateUser(req.params.id).then((result) => {
           res.redirect("/admin/userslist");
         });
    },

    unblock:(req, res, next) => {
         usersHelpers.unblockUser(req.params.id).then((result) => {
           res.redirect("/admin/userslist");
         });
    },

    products:(req, res, next) => {
        productHelpers.getAllProducts().then((products) => {
          res.render("admin/products", { products });
        });
    },

    addproduct:(req, res, next) => {
        categoryHelpers.viewAllCategory().then((category) => {
          res.render("admin/add-product", { category });
        });
    },

    paddproduct:(req, res, next) => {
        const filesname = req.files.map(filename);
       function filename(file) {
         return file.filename;
       }
       let productDetails = req.body;
       productDetails.imagefileName = filesname;
       productHelpers.addProduct(productDetails).then(() => {
        res.redirect("/admin/products");
       });
    },

    editproduct:async(req, res, next) => {
        let product = await productHelpers.getProductDetails(req.query.product);
        let category = await categoryHelpers.viewAllCategory();;
        res.render("admin/edit-product", { product, category });
    },

    peditproduct:(req, res, next) => {
        const filesname = req.files.map(filename);
        function filename(file) {
        return file.filename;
        }
        let productDetails = req.body;
        productDetails.imagefileName = filesname;
        let id = req.query.product;
        productHelpers.updateProduct(id, req.body).then(() => {
        res.redirect("/admin/products");
           
         });
    },

    deleteproduct:(req, res, next) => {
        let proId = req.params.id;
        productHelpers.deleteProduct(proId).then((response) => {
        res.redirect("/admin/products");
        });
    },

    categories:(req, res, next) => { 
        categoryHelpers.getAllCategory().then((category) => {
        res.render("admin/categories", { category });
        });
    },

    addcategory:(req, res) => {
        res.render("admin/add-category",{err:req.session.err});
    },

    paddcategory:(req, res, next) => {
        categoryHelpers.addCategory(req.body).then((result) => {
        res.redirect("/admin/categories");
        }).catch((err) => {
        req.session.err = err.status
        res.redirect("/admin/add-category");
        });
    },
    
    editcategory:async(req, res) => {
        let category = await categoryHelpers.getCatergoryDetails(req.query.category);
        res.render("admin/edit-category", {category});
    },

    peditcategory:(req, res, next) => {
        categoryHelpers.updateCategory(req.query.category, req.body).then(() => {
        res.redirect("/admin/categories");
        });
    },
    
    deletecategory:(req, res) => {
        let catId = req.params.id;
        categoryHelpers. deleteCategory(catId).then((response) => {
        res.redirect("/admin/categories");
        });
    },
    
    cancel:(req, res) => {
        res.redirect("/admin/products");
    },
    
    catecancel:(req, res) => {
         res.redirect("/admin/categories");
    },
    
    orders:(req, res, next) => {
        orderHelpers.getAllUserOrder().then((orders) => {
          res.render("admin/orders", {orders});
          
        })
    },
    
    viewOrderProducts:(req, res, next) => {
        orderHelpers.getOrderProducts(req.query.id).then((orders) => {
          res.render("admin/viewOrderProducts",{orders});
          
        })
    },

    coupons:(req,res)=>{
        couponsHelpers.getAllCoupons().then((coupons) => {
            res.render("admin/coupons",{coupons});
        })
    },

    addcoupons:(req,res)=>{
        res.render("admin/add-coupons");
    },

    addCoupons:(req,res)=>{
        const filesname = req.files.map(filename);
        function filename(file) {
          return file.filename;
        }
        let couponDetails = req.body;
        couponDetails.imagefileName = filesname;
        couponsHelpers.addcoupons(couponDetails).then((result) => {
            res.redirect("/admin/coupons");
        })
    },

    editcoupons:async(req,res)=>{
        let coupons=await couponsHelpers.getCoupons(req.query.coupons);
        
        res.render("admin/edit-coupons",{coupons});
    },

    editCoupons:(req,res)=>{
        const filesname = req.files.map(filename);
        function filename(file) {
          return file.filename;
        }
        let couponDetails = req.body;
        couponDetails.imagefileName = filesname;
        couponsHelpers.editcoupons(req.query.coupons,couponDetails).then((result) => {
            console.log(result);
            res.redirect("/admin/coupons");
        })
    },
    deletecoupons:(req,res)=>{
        couponsHelpers.deleteCoupons(req.query.coupons).then(() => {
            
            res.redirect("/admin/coupons");
        })
    },

    banners:(req,res)=>{
        bannerHelpers.getAllBanners().then((banners) => {
            
            res.render("admin/banners",{banners})
        })
    },

    addbanners:(req,res)=>{
    
        res.render("admin/add-banners")
    },

    addBanners:(req,res)=>{
        const filesname = req.files.map(filename);
           function filename(file) {
             return file.filename;
           }
       let bannerDetails = req.body;
       bannerDetails.imagefileName = filesname;
        bannerHelpers.addbanners(bannerDetails).then((result) => {
            
            res.redirect("/admin/banners")
        })
    },

    deletebanners:(req,res)=>{
        bannerHelpers.deleteBanners(req.query.banner).then(() => {
            
            res.redirect("/admin/banners");
        })
        
    },

    salesreport:async(req,res)=>{
        let gtotal=await salesreportHelpers.getSalesReporttotal()
        salesreportHelpers.getSalesReport().then((salesreport) => {

            res.render("admin/salesreport",{salesreport,gtotal})
        })
    },

    salesdate:async (req, res) => {
        date = req.query;
        let gtotal=await salesreportHelpers.salesdatetotal(date)
        salesreportHelpers.fromTo(date).then((data) => {

          res.render("admin/salesdate", { data, date ,gtotal});
        });
    },
    
    salesmonthly:async(req, res) => {
        let cdate = req.query;
        let vals = cdate.month.split("-");
        dates = {
          month: vals[1],
          year: vals[0],
        };
        let gtotal=await salesreportHelpers.salesmonthlytotal(dates)
        salesreportHelpers.getSalesByMonth(dates).then((data) => {

          res.render("admin/salesmonthly", { data, cdate ,gtotal});
        });
    },

    salesyearly:async(req, res) => {
        const month = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        let cyear = req.query;
        let gtotal=await salesreportHelpers.salesyearlytotal(cyear)
        salesreportHelpers.getSalesByyear(cyear).then((data) => {
          res.render("admin/salesyearly", { data, cyear ,gtotal});
          });
    },

    changeStatus:(req,res)=>{
        let proId = req.body.prodId;
        let orderId = req.body.orderId
        orderHelpers.changestatus(req.body).then(async(response) => {
            let product = await orderHelpers.findProduct(orderId,proId);
            if (product[0].payment !== "COD") {
                        data = {
                          user: req.body.userid,

                        };
                        usersHelpers.getRefund(data, product[0].Total);
                      }
        res.json(response)
      })
    },

    chartpayment:async(req,res)=>{
        value=await chartHelpers.chartPayment()
       
        const name=value.map(function filename(file){
            return file._id
        })
        const data=value.map((file)=>{
            return file.Total
        })
        res.json({
            name,
            data
        })
    },

    Sales:async (req, res) => {
        let year = await chartHelpers.sales();;
        var orderCounts = Array(12).fill(0);
        for (let date of year) {
          orderCounts[date._id.month - 1] = date.Total;
        }
        res.json({ orderCounts });
    }
}
