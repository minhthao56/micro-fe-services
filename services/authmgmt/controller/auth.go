package controller

import (
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/minhthao56/monorepo-taxi/libs/go/auth"
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
	_, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "error reading request body",
		})
	}
}
