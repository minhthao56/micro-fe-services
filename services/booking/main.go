package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/minhthao56/monorepo-taxi/libs/go/database"
	"github.com/minhthao56/monorepo-taxi/services/booking/middleware"
	"github.com/minhthao56/monorepo-taxi/services/booking/router"
)

func main() {
	db := database.GetDatabaseInstance()
	conn := db.GetConnection()
	defer conn.Close()

	r := gin.Default()
	r.Use(gin.Recovery())
	r.Use(middleware.ValidateJWT())
	routerGroup := r.Group("/booking")
	router.NewRouterCustomer(routerGroup, conn)
	router.NewRouterBooking(routerGroup, conn)
	router.NewRouterDriver(routerGroup, conn)
	router.NewRouterVehicleType(routerGroup, conn)

	r.Run(":6060")
	log.Println("booking service started port 8080")
}
