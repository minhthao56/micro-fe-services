package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/minhthao56/monorepo-taxi/libs/go/database"
)

func main() {
	db := database.GetDatabaseInstance()
	conn := db.GetConnection()
	defer conn.Close()
	r := gin.Default()
	usermgmt := r.Group("/authmgmt")
	usermgmt.GET("/", func(c *gin.Context) {
		// resp, err := http.Get("http://communicatemgmt-service:7070/communicatemgmt/")
		// resp, err := http.Get("http://authmgmt-service:8080/authmgmt/")

		// if err != nil {
		// 	c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		// 	return
		// }
		// defer resp.Body.Close()
		// body, _ := io.ReadAll(resp.Body)

		// rows, err := db.Query("select user_id from public.user")
		// if err != nil {
		// 	log.Fatal(err)
		// }
		// defer rows.Close()
		// var userID string
		// for rows.Next() {
		// 	if err := rows.Scan(&userID); err != nil {
		// 		log.Fatal(err)
		// 	}
		// 	fmt.Println(userID)
		// }
		// if err := rows.Err(); err != nil {
		// 	log.Fatal(err)
		// }
		c.JSON(http.StatusOK, gin.H{
			"message": "test",
		})
	})
	r.Run(":8080")
	fmt.Println("user management service started port 8080")

}
