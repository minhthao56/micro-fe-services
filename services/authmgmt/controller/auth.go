package controller

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/minhthao56/monorepo-taxi/libs/go/auth"
	"github.com/minhthao56/monorepo-taxi/libs/go/schema"
)

type AuthController interface {
	CreateCustomTokens(c *gin.Context)
}

type AuthControllerImpl struct {
	FirebaseManager auth.FirebaseManager
}

func NewAuthController(client auth.FirebaseManager) AuthController {
	return &AuthControllerImpl{FirebaseManager: client}
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
	token, err := a.FirebaseManager.CustomTokenWithClaims(c, customTokenRequest.UID, "1", "2")
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
