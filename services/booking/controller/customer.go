package controller

import (
	"database/sql"
	"encoding/json"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/minhthao56/monorepo-taxi/libs/go/schema"
	"github.com/minhthao56/monorepo-taxi/services/booking/repository"
)

type CustomerController interface {
	SerCurrentLocation(c *gin.Context)
}

type CustomerControllerImpl struct {
	db *sql.DB
}

func NewCustomerController(db *sql.DB) CustomerController {
	return &CustomerControllerImpl{db: db}
}

func (u *CustomerControllerImpl) SerCurrentLocation(c *gin.Context) {
	body, err := io.ReadAll(c.Request.Body)
	stringUserID := c.GetString("user_id")

	if stringUserID == "" {
		c.JSON(http.StatusBadRequest, schema.StatusResponse{
			Message: "user_id is required",
			Status:  http.StatusBadRequest,
		})
		return
	}
	if err != nil {
		c.JSON(http.StatusBadRequest, schema.StatusResponse{
			Message: err.Error(),
			Status:  http.StatusBadRequest,
		})
		return
	}

	var request schema.SetLocationRequest
	if err := json.Unmarshal(body, &request); err != nil {
		c.JSON(http.StatusBadRequest, schema.StatusResponse{
			Message: err.Error(),
			Status:  http.StatusBadRequest,
		})
		return
	}

	repoCustomer := repository.NewCustomerRepository(u.db)

	if err := repoCustomer.SerCurrentLocation(c, request.Long, request.Lat, stringUserID); err != nil {
		c.JSON(http.StatusInternalServerError, schema.StatusResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		})
		return
	}

	c.JSON(http.StatusOK, schema.StatusResponse{
		Message: "success",
		Status:  http.StatusOK,
	})
}
