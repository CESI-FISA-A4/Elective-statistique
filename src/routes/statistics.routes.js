const { schemaGetOrdersStats, schemaGetOrdersFromStatus, schemaGetOngoingIncome } = require("../utils/swagger.schemas");
const { getOngoingIncome, getOrdersStats, getOrdersFromStatus } = require("../views/statistics.views");

const statsRoutes = function (instance, opts, next) {
  instance.get('/orders', schemaGetOrdersFromStatus, getOrdersFromStatus);
  instance.get('/orders/count', schemaGetOrdersStats, getOrdersStats);
  instance.get('/orders/ongoing-income', schemaGetOngoingIncome, getOngoingIncome);
  next();
};

module.exports = statsRoutes;