const axios = require("axios");
require('dotenv').config();

module.exports = {
    subscribeToApiGateway: async () => {
        // Order
        // try {
            const response = await axios({
                method: "POST",
                baseURL: `http://${process.env.GATEWAY_HOST}:${process.env.GATEWAY_PORT}`,
                url: `/registry/services`,
                data: {
                    serviceIdentifier: "statistics-service",
                    serviceLabel: "Service Statistique",
                    host: process.env.HOST,
                    port: process.env.PORT,
                    entrypointUrl: "/api/statistics",
                    redirectUrl: "/api/statistics",
                    routeProtections: [
                        { methods: ["GET"], route: "/orders", roles: ["admin", "salesman"] },
                        { methods: ["GET"], route: "/orders/count", roles: ["admin", "salesman"] },
                        { methods: ["GET"], route: "/orders/ongoing-income", roles: ["admin", "salesman"] },
                        { methods: ["GET"], route: "/orders/restaurant/:id", roles: ["restaurantOwner", "admin"] }
                    ]
                }
            });
        // } catch (error) {
        //     console.log(error);
        // }
    }
}