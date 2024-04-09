const { isValidObjectId } = require("mongoose");
const { Order } = require("../models/order.model");
const { Menu } = require("../models/menu.model");
const { Article } = require("../models/article.model");
const { Product } = require("../models/product.model");
const { Status } = require("../models/status.model");
const { Restaurant } = require("../models/restaurant.model");

const errors = {
}
module.exports = {
  getOrdersStats: async (req, res) => {
    const allOrders = await Order.find().populate("status");
    let stats = {}
    let curState = ""
    allOrders.map((order)=>{
      if (!order?.status?.state) return;
      curState = order.status.state;
      if (curState && !(curState in stats)) {
        stats[curState] = 0
      };
      if (curState) stats[curState] += 1;
    });
    return stats;
  },
  getOrdersFromStatus: async (req, res) => {
    const { status } = req.query;
    const targetStatus = await Status.findOne({state: {$eq: status}});
    if (!targetStatus) return errors.statusNotFound;
    const targetOrders = await Order.find({status: {$eq: targetStatus._id}}).populate("articleList.article").populate("restaurantId");
    const allRestaurants = await Restaurant.find();
    const ordersRecap = []
    targetOrders.map((order)=>{
      let totalPrice = 0;
      order.articleList.map((selectedArticle)=>{
        totalPrice += selectedArticle?.article?.price * selectedArticle.quantity;
      });
      const index = allRestaurants.findIndex(((restaurant)=>{
        return restaurant._id.equals(order.restaurantId)
      }))
      console.log(index);
      // const targetRestaurant = await Restaurant.findById(order.restaurantId);
      ordersRecap.push({
        orderId: order._id,
        totalPrice: totalPrice,
        restaurant: allRestaurants[index]?.name
      });
    });
    return ordersRecap;
    // Get all orders where statusId = req.query.statusId
    // Get all articles
    // Join article prix on articleId
    // sum(articlePrix*quant) par order
    // Get Restaurant on restaurantId
    // return RestaurantId,RestaurantName,OrderId,PrixTotal
  },
  getOngoingIncome: async (req, res) => {
    const statusToExclude = await Status.find({state : {$in: ["aborted","delivered"]}});
    const statusListToExclude = [];
    statusToExclude.map((status)=>{
      statusListToExclude.push(status._id);
    });
    const ongoingOrders = await Order.find({status: {$nin: statusListToExclude}}).populate("articleList.article");
    let ongoingIncome = 0;
    ongoingOrders.map((order)=>{
      order.articleList.map((selectedArticle)=>{
        ongoingIncome += selectedArticle?.article?.price * selectedArticle.quantity;
      });
    });
    return {ongoingIncome};
    // Get statusId where State = "finished"
    // Get all orders where statusId != state finished
    // Get all articles
    // Join article prix on articleId
    // sum(articlePrix*quant) par order
    // sum(orderPrixTotal)
    // return ValeurTotal
  }
}