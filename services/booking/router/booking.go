package router

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/minhthao56/monorepo-taxi/services/booking/controller"
)

func NewRouterBooking(r *gin.RouterGroup, conn *sql.DB) {
	controller := controller.NewBookingController(conn)
	r.POST("/create", controller.CreateBooking)
	r.POST("/update", controller.UpdateBooking)
	r.GET("/", controller.GetManyBooking)
	r.GET("/frequently-addresses", controller.GetFrequentlyAddresses)
}
