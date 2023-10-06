package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/minhthao56/monorepo-taxi/libs/go/auth"
	"github.com/minhthao56/monorepo-taxi/libs/go/database"
	"github.com/minhthao56/monorepo-taxi/services/authmgmt/router"
)

func main() {
	db := database.GetDatabaseInstance()
	conn := db.GetConnection()
	defer conn.Close()
	firebaseManager, err := auth.NewFirebaseManager()
	if err != nil {
		log.Fatalf("Error when creating user manager:%s \n", err)
		panic(err)
	}
	log.Println("user manager created")

	r := gin.Default()
	routerGroup := r.Group("/authmgmt")
	router.NewRouterUser(routerGroup, firebaseManager)
	router.NewRouterAuth(routerGroup, firebaseManager)

	r.Run(":8080")
	log.Println("user anthmgnt service started port 8080")

}
