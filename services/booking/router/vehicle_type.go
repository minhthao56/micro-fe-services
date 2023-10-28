package router

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/minhthao56/monorepo-taxi/services/booking/controller"
)

func NewRouterVehicleType(r *gin.RouterGroup, conn *sql.DB) {
	controller := controller.NewVehicleTypeController(conn)
	r.GET("/vehicle-types", controller.GetVehicleTypes)
}
