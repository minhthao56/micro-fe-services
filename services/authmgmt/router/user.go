package router

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/minhthao56/monorepo-taxi/libs/go/auth"
	"github.com/minhthao56/monorepo-taxi/services/authmgmt/controller"
)

func NewRouterUser(router *gin.RouterGroup, client auth.FirebaseManager, conn *sql.DB) {
	userController := controller.NewUserController(client, conn)
	router.POST("/create-firebase-user", userController.CreateUser)
}
