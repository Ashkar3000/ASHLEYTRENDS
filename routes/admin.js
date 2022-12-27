var express = require("express");
var router = express.Router();
const upload = require("../middleware/multier")


const{
  adminlogin,
  adminlogout,
  adminhome,
  padminhome,
  userslist,
  block,
  unblock,
  products,
  addproduct,
  paddproduct,
  editproduct,
  peditproduct,
  deleteproduct,
  categories,
  addcategory,
  paddcategory,
  editcategory,
  peditcategory,
  deletecategory,
  cancel,
  catecancel,
  orders,
  viewOrderProducts,
  coupons,
  banners,
  addcoupons,
  addCoupons,
  editcoupons,
  editCoupons,
  deletecoupons,
  addbanners,
  addBanners,
  deletebanners,
  salesreport,
  salesdate,
  salesmonthly,
  salesyearly,
  changeStatus,
  chartpayment,
  Sales

}=require("../controllers/adminControllers")

router.route("/").get(adminlogin)

router.route("/adminlogout").get(adminlogout)

router.route("/adminhome").get(adminhome).post(padminhome)

router.route("/userslist").get(userslist)

router.route("/block/:id").get(block)

router.route("/unblock/:id").get(unblock)

router.route("/products").get(products)

router.route("/add-product").get(addproduct).post(upload.array("image",3),paddproduct)

router.route("/edit-product").get(editproduct).post(upload.array("image",3),peditproduct)

router.route("/delete-product/:id").get(deleteproduct)

router.route("/categories").get(categories)

router.route("/add-category").get(addcategory).post(paddcategory)

router.route("/edit-category").get(editcategory).post(peditcategory);

router.route("/delete-category/:id").get(deletecategory);

router.route("/cancel").get(cancel);

router.route("/catecancel").get(catecancel);

router.route("/orders").get(orders);

router.route("/viewOrderProducts").get(viewOrderProducts);

router.route("/changeStatus").post(changeStatus)

router.route('/coupons').get(coupons)

router.route('/add-coupons').get(addcoupons).post(upload.array("image",1),addCoupons)

router.route('/edit-coupons').get(editcoupons).post(upload.array("image",1),editCoupons)

router.route('/delete-coupons').get(deletecoupons)

router.route('/banners').get(banners)

router.route('/add-banners').get(addbanners).post(upload.array("image",1),addBanners)

router.route('/delete-banner').get(deletebanners)

router.route("/salesreport").get(salesreport)

router.route('/salesdate').get(salesdate)

router.route('/salesmonthly').get(salesmonthly)

router.route('/salesyearly').get(salesyearly)

router.route("/chartPayment").get(chartpayment)

router.route("/sales").get(Sales)

module.exports = router;
