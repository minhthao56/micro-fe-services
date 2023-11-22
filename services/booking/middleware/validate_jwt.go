package middleware

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/minhthao56/monorepo-taxi/libs/go/auth"
	"github.com/minhthao56/monorepo-taxi/libs/go/schema"
)

func ValidateJWT() gin.HandlerFunc {
	return func(c *gin.Context) {
		authorization := c.Request.Header.Get("Authorization")
		if authorization == "" {
			c.JSON(http.StatusUnauthorized, schema.StatusResponse{
				Message: "Authorization header is required",
				Status:  http.StatusUnauthorized,
			})
			c.Abort()
		}
		tokenString := authorization[len("Bearer "):]
		// Validate token
		firebaseManager, err := auth.NewFirebaseManager()

		if err != nil {
			c.JSON(http.StatusUnauthorized, schema.StatusResponse{
				Message: err.Error(),
				Status:  http.StatusUnauthorized,
			})
			c.Abort()
		}

		token, err := firebaseManager.VerifyIDToken(c, tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, schema.StatusResponse{
				Message: err.Error(),
				Status:  http.StatusUnauthorized,
			})
			c.Abort()
		}

		u, err := firebaseManager.GetUser(c, token.UID)

		if err != nil {
			c.JSON(http.StatusUnauthorized, schema.StatusResponse{
				Message: err.Error(),
				Status:  http.StatusUnauthorized,
			})
			c.Abort()
		}

		timestamp := u.TokensValidAfterMillis / 1000

		log.Printf("the refresh tokens were revoked at: %d (UTC seconds) ", timestamp)
		// Set user id
		c.Set("user_uid", token.UID)
		c.Set("user_id", token.Claims["db_user_id"])
		c.Next()
	}
}
