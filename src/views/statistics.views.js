const { isValidObjectId } = require("mongoose");
const { Order } = require("../models/order.model");
const { Menu } = require("../models/menu.model");
const { Article } = require("../models/article.model");
const { Product } = require("../models/product.model");
const { Status } = require("../models/status.model");
const { Restaurant } = require("../models/restaurant.model");

const errors = {
  statusNotFound: (() => {
    const err = Error("Specified status does not exists");
    err.statusCode = 400;
    return err;
  })(),
  invalidId: (() => {
    const err = Error("Invalid Id format");
    err.statusCode = 400;
    return err;
  })(),
}
module.exports = {
  ping: async (req, res) => {
    return;
  },
  getOrdersStats: async (req, res) => {
    const allOrders = await Order.find().populate("status");
    let stats = {}
    stats["total"] = 0
    allOrders.map((order) => {
      let curState = ""
      if (!order?.status?.state) return;
      curState = order.status.state;
      if (curState && !(curState in stats)) {
        stats[curState] = 0
      };
      if (curState) stats[curState] += 1;
      if (curState) stats["total"] += 1;
    });
    return stats;
  },
  getOrdersFromStatus: async (req, res) => {
    const { status } = req.query;
    const filter = {};
    if (status) {
      const targetStatus = await Status.findOne({ state: { $eq: status } });
      if (!targetStatus) return errors.statusNotFound;
      filter["status"] = { $eq: targetStatus._id }
    }
    const targetOrders = await Order.find(filter).populate("articleList.article").populate("restaurantId");
    const allRestaurants = await Restaurant.find();
    const ordersRecap = []
    targetOrders.map((order) => {
      let totalPrice = 0;
      order.articleList.map((selectedArticle) => {
        totalPrice += selectedArticle?.article?.price * selectedArticle.quantity;
      });
      const index = allRestaurants.findIndex(((restaurant) => {
        return restaurant._id.equals(order.restaurantId)
      }))
      console.log(index);
      ordersRecap.push({
        orderId: order._id,
        totalPrice: totalPrice,
        restaurant: allRestaurants[index]?.name
      });
    });
    return ordersRecap;
  },
  getOngoingIncome: async (req, res) => {
    const statusToExclude = await Status.find({ state: { $in: ["aborted", "delivered"] } });
    const statusListToExclude = [];
    statusToExclude.map((status) => {
      statusListToExclude.push(status._id);
    });
    const ongoingOrders = await Order.find({ status: { $nin: statusListToExclude } }).populate("articleList.article");
    let ongoingIncome = 0;
    ongoingOrders.map((order) => {
      order.articleList.map((selectedArticle) => {
        ongoingIncome += selectedArticle?.article?.price * selectedArticle.quantity;
      });
    });
    return { ongoingIncome };
  },
  getRestaurantStats: async (req,res)=>{
    const { id } = req.params;
    if (!isValidObjectId(id)) return errors.invalidId;
    const ordersOfRestaurant = await Order.find({restaurantId: {$eq: id}}).populate('status').populate("articleList.article");
    let count = 0;
    let totalPrice = 0;
    ordersOfRestaurant.map((order)=>{
      if(order?.status?.state=="aborted") return;
      count ++;
      order.articleList.map((selectedArticle) => {
        if (!selectedArticle?.article?.price) return;
        totalPrice += selectedArticle?.article?.price * selectedArticle.quantity;
      });
    });
    const averagePrice = totalPrice/count;
    return { count, totalPrice, averagePrice}
  }
}
