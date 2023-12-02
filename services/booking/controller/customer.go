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
	SetCurrentLocation(c *gin.Context)
	GetCustomers(c *gin.Context)
	UpdateVIP(c *gin.Context)
	GetCurrentCustomer(c *gin.Context)
	GetVIPCustomers(c *gin.Context)
}

type CustomerControllerImpl struct {
	db           *sql.DB
	repoCustomer repository.CustomerRepository
	repoAddress  repository.AddressRepository
}

func NewCustomerController(db *sql.DB) CustomerController {
	repoCustomer := repository.NewCustomerRepository(db)
	repoAddress := repository.NewAddressRepository(db)
	return &CustomerControllerImpl{db: db, repoCustomer: repoCustomer, repoAddress: repoAddress}
}

func (u *CustomerControllerImpl) SetCurrentLocation(c *gin.Context) {
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
	// TODO: Should handle transaction here
	if err := u.repoCustomer.SerCurrentLocation(c, request, stringUserID); err != nil {
		c.JSON(http.StatusInternalServerError, schema.StatusResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		})
		return
	}

	if err := u.repoAddress.UpdateAddresses(c, []schema.Address{
		{
			Lat:              request.Lat,
			Long:             request.Long,
			FormattedAddress: request.FormattedAddress,
			DisplayName:      request.DisplayName,
		},
	}); err != nil {
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

func (u *CustomerControllerImpl) UpdateVIP(c *gin.Context) {
	stringUserID := c.GetString("user_id")

	if stringUserID == "" {
		c.JSON(http.StatusBadRequest, schema.StatusResponse{
			Message: "user_id is required",
			Status:  http.StatusBadRequest,
		})
		return
	}

	if err := u.repoCustomer.UpdateVIP(c, stringUserID, true); err != nil {
		c.JSON(http.StatusInternalServerError, schema.StatusResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		})
	}

	c.JSON(http.StatusOK, schema.StatusResponse{
		Message: "success",
	})

}

func (u *CustomerControllerImpl) GetCurrentCustomer(c *gin.Context) {
	stringUserID := c.GetString("user_id")

	if stringUserID == "" {
		c.JSON(http.StatusBadRequest, schema.StatusResponse{
			Message: "user_id is required",
			Status:  http.StatusBadRequest,
		})
		return
	}

	customer, err := u.repoCustomer.GetCurrentCustomer(c, stringUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, schema.StatusResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		})
	}

	c.JSON(http.StatusOK, schema.GetCustomerResponse{
		Customer: customer,
	})
}

func (u *CustomerControllerImpl) GetVIPCustomers(c *gin.Context) {
	customers, err := u.repoCustomer.GetVIPCustomers(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, schema.StatusResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		})
	}

	c.JSON(http.StatusOK, schema.GetVPICustomersResponse{
		Customers: customers,
	})
}
