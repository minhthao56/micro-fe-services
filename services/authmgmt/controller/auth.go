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
}

func NewAuthController(client auth.FirebaseManager, db *sql.DB) AuthController {
	return &AuthControllerImpl{FirebaseManager: client, db: db}
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

	userRepo := repository.NewUserRepository(a.db)
	userID, err := userRepo.GetUserByUID(c, authToken.UID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error getting user by uid",
			"error":   err.Error(),
		})
	}

	claims := map[string]interface{}{
		"user_group": customTokenRequest.UserGroup,
		"db_user_id": userID,
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
