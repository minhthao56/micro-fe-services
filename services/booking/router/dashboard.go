package router

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/minhthao56/monorepo-taxi/services/booking/controller"
)

func NewRouterDashboard(r *gin.RouterGroup, conn *sql.DB) {
	controller := controller.NewDashboardController(conn)
	r.GET("/dashboard/general-number", controller.GetGeneralNumber)
}
