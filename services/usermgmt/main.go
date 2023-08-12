package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	usermgmt := r.Group("/usermgmt")
	usermgmt.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "user management service v3",
		})
	})
	r.Run(":9090")
	fmt.Println("user management service started port 9090")
}
