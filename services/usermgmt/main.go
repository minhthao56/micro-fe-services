package main

import (
	"fmt"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	usermgmt := r.Group("/usermgmt")
	usermgmt.GET("/", func(c *gin.Context) {
		// resp, err := http.Get("http://communicatemgmt-service:7070/communicatemgmt/")
		resp, err := http.Get("http://authmgmt-service:8080/authmgmt/")

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
			return
		}
		defer resp.Body.Close()
		body, _ := io.ReadAll(resp.Body)
		c.JSON(http.StatusOK, gin.H{
			"message": "user management service v4",
			"status":  string(body),
		})
	})
	r.Run(":9090")
	fmt.Println("user management service started port 9090")

}
