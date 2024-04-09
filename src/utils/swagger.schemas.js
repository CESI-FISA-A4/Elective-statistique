module.exports = {
  schemaGetOrdersStats: {
    schema: {
      description: 'Get the amount of orders for each status',
      tags: ["Stats/Order"],
    }
  },
  schemaGetOrdersFromStatus: {
    schema: {
      description: 'Get recap of orders of a specified status',
      tags: ["Stats/Order"],
      query: {
        type: 'object',
        // required: ["status"],
        properties: {
          status: {
            type: 'string',
            description: 'status of the order'
          }
        }
      }
    }
  },
  schemaGetOngoingIncome: {
    schema: {
      description: 'Get the total amount of money of ongoing orders',
      tags: ["Stats/Order"],
    }
  }
}