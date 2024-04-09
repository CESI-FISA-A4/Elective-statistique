module.exports = {
  baseSchema: {
    schema: {
      description: 'Create a new order',
      tags: ["Order"],
      query: {
        status: {
          type: 'string',
          description: 'status of the order'
        }
      }
    }
  },
}