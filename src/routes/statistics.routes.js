const { baseSchema } = require("../utils/swagger.schemas");
const { getOngoingIncome, getOrdersStats, getOrdersFromStatus } = require("../views/statistics.views");

const statsRoutes = function (instance, opts, next) {
  instance.get('/getOngoingIncome', baseSchema, getOngoingIncome);
  instance.get('/getOrdersStats', baseSchema, getOrdersStats);
  instance.get('/getOrdersFromStatus', baseSchema, getOrdersFromStatus);
  next();
};

module.exports = statsRoutes;