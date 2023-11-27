package router

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/minhthao56/monorepo-taxi/services/booking/controller"
)

func NewRouterCustomer(r *gin.RouterGroup, conn *sql.DB) {
	controller := controller.NewCustomerController(conn)
	r.POST("/customer/set-location", controller.SetCurrentLocation)
	r.GET("/customers", controller.GetCustomers)
	r.POST("/customer/vip", controller.UpdateVIP)
	r.GET("/customer", controller.GetCurrentCustomer)
}
