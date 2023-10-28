package router

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/minhthao56/monorepo-taxi/services/booking/controller"
)

func NewRouterDriver(r *gin.RouterGroup, conn *sql.DB) {
	controller := controller.NewDriverController(conn)
	r.GET("/driver/nearest", controller.FindNearest)
	r.POST("/driver/update-location", controller.UpdateLocation)
	r.GET("/drivers", controller.GetDrivers)
}
