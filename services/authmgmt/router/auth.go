package router

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/minhthao56/monorepo-taxi/libs/go/auth"
	"github.com/minhthao56/monorepo-taxi/services/authmgmt/controller"
)

func NewRouterAuth(router *gin.RouterGroup, firebase auth.FirebaseManager, conn *sql.DB) {
	controller := controller.NewAuthController(firebase, conn)
	router.POST("/create-custom-token", controller.CreateCustomTokens)
}
