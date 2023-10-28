package controller

import (
	"database/sql"
	"encoding/json"
	"io"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/minhthao56/monorepo-taxi/libs/go/schema"
	"github.com/minhthao56/monorepo-taxi/services/booking/repository"
)

type CustomerController interface {
	SerCurrentLocation(c *gin.Context)
	GetCustomers(c *gin.Context)
}

type CustomerControllerImpl struct {
	db           *sql.DB
	repoCustomer repository.CustomerRepository
}

func NewCustomerController(db *sql.DB) CustomerController {
	repoCustomer := repository.NewCustomerRepository(db)
	return &CustomerControllerImpl{db: db, repoCustomer: repoCustomer}
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

	if err := u.repoCustomer.SerCurrentLocation(c, request.Long, request.Lat, stringUserID); err != nil {
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

func (u *CustomerControllerImpl) GetCustomers(c *gin.Context) {
	query := c.Request.URL.Query()
	stringLimit := query.Get("limit")
	limit, err := strconv.Atoi(stringLimit)
	if err != nil {
		limit = 10
	}
	stringOffset := query.Get("offset")
	offset, err := strconv.Atoi(stringOffset)
	if err != nil {
		offset = 0
	}

	search := query.Get("search")

	request := schema.GetCustomersRequest{
		Limit:  limit,
		Offset: offset,
		Search: search,
	}

	customers, err := u.repoCustomer.GetCustomers(c, request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, schema.StatusResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		})
		return
	}

	total, err := u.repoCustomer.CountCustomers(c, request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, schema.StatusResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		})
		return
	}

	c.JSON(http.StatusOK, schema.GetCustomersResponse{
		Customers: customers,
		Limit:     request.Limit,
		Offset:    request.Offset,
		Total:     total,
	})
}