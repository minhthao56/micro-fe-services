package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	usermgmt := r.Group("/usermgmt")
	usermgmt.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "user management service",
		})
	})
	r.Run(":9090")
}
