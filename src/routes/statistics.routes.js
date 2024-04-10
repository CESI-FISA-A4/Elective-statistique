const { schemaGetOrdersStats, schemaGetOrdersFromStatus, schemaGetOngoingIncome } = require("../utils/swagger.schemas");
const { getOngoingIncome, getOrdersStats, getOrdersFromStatus, ping, getRestaurantStats } = require("../views/statistics.views");

const statsRoutes = function (instance, opts, next) {
  instance.get('/ping', ping)
  instance.get('/orders', schemaGetOrdersFromStatus, getOrdersFromStatus);
  instance.get('/orders/count', schemaGetOrdersStats, getOrdersStats);
  instance.get('/orders/ongoing-income', schemaGetOngoingIncome, getOngoingIncome);
  instance.get('/orders/restaurant/:id', getRestaurantStats);
  next();
};

module.exports = statsRoutes;