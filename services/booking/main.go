package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	booking := r.Group("/booking")
	booking.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "order management service",
		})
	})
	r.Run(":6060")
}
