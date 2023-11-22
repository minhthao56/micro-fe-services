package controller

import (
	"database/sql"
	"encoding/json"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/minhthao56/monorepo-taxi/libs/go/auth"
	"github.com/minhthao56/monorepo-taxi/libs/go/schema"
	"github.com/minhthao56/monorepo-taxi/services/authmgmt/repository"
)

type AuthController interface {
	CreateCustomTokens(c *gin.Context)
}

type AuthControllerImpl struct {
	FirebaseManager auth.FirebaseManager
	db              *sql.DB
	userRepo        repository.UserRepository
}

func NewAuthController(client auth.FirebaseManager, db *sql.DB) AuthController {
	userRepo := repository.NewUserRepository(db)
	return &AuthControllerImpl{FirebaseManager: client, db: db, userRepo: userRepo}
}

func (a *AuthControllerImpl) CreateCustomTokens(c *gin.Context) {
	payload, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "error reading request body",
		})
	}

	var customTokenRequest schema.CustomTokenRequest
	if err = json.Unmarshal(payload, &customTokenRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "error parsing request body",
		})
	}

	authToken, err := a.FirebaseManager.VerifyIDToken(c, customTokenRequest.FirebaseToken)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "error verifying firebase token",
			"error":   err.Error(),
		})
	}

	user, err := a.userRepo.GetByUIDWithUserGroup(c, authToken.UID, customTokenRequest.UserGroup)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error getting user by uid",
			"error":   err.Error(),
		})
	}

	if customTokenRequest.ExpoPushToken != "" {
		err = a.userRepo.UpdateExpoPushToken(c, user.UserID, customTokenRequest.ExpoPushToken)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error updating expo push token",
				"error":   err.Error(),
			})
		}
	}

	claims := map[string]interface{}{
		"user_group":      customTokenRequest.UserGroup,
		"db_user_id":      user.UserID,
		"driver_id":       user.DriverID,
		"customer_id":     user.CustomerID,
		"expo_push_token": customTokenRequest.ExpoPushToken,
	}
	token, err := a.FirebaseManager.CustomTokenWithClaims(c, authToken.UID, claims)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error creating custom token",
			"error":   err.Error(),
		})
	}
	c.JSON(http.StatusOK, schema.CustomTokenResponse{
		CustomToken: token,
	})
}
