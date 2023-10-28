package controller

import (
	"database/sql"
	"io"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/minhthao56/monorepo-taxi/libs/go/schema"
	"github.com/minhthao56/monorepo-taxi/services/booking/repository"
)

type DriverController interface {
	FindNearest(c *gin.Context)
	UpdateLocation(c *gin.Context)
	GetDrivers(c *gin.Context)
}

type DriverControllerImpl struct {
	repoDriver repository.DriverRepository
	db         *sql.DB
}

func NewDriverController(db *sql.DB) DriverController {
	repoDriver := repository.NewDriverRepository(db)
	return &DriverControllerImpl{db: db, repoDriver: repoDriver}
}

func (u *DriverControllerImpl) FindNearest(c *gin.Context) {
	_, err := io.ReadAll(c.Request.Body)

	if err != nil {
		c.JSON(http.StatusBadRequest, schema.StatusResponse{
			Message: err.Error(),
			Status:  http.StatusBadRequest,
		})
		return
	}

	c.JSON(http.StatusOK, schema.StatusResponse{
		Message: "success",
		Status:  http.StatusOK,
	})

}

func (u *DriverControllerImpl) UpdateLocation(c *gin.Context) {
	_, err := io.ReadAll(c.Request.Body)

	if err != nil {
		c.JSON(http.StatusBadRequest, schema.StatusResponse{
			Message: err.Error(),
			Status:  http.StatusBadRequest,
		})
		return
	}

	c.JSON(http.StatusOK, schema.StatusResponse{
		Message: "success",
		Status:  http.StatusOK,
	})

}

func (u *DriverControllerImpl) GetDrivers(c *gin.Context) {
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
	request := schema.GetDriversRequest{
		Limit:  limit,
		Offset: offset,
		Search: search,
	}

	drivers, err := u.repoDriver.GetDrivers(c, request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, schema.StatusResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		})
		return
	}

	total, err := u.repoDriver.CountDriver(c, request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, schema.StatusResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		})
		return
	}

	c.JSON(http.StatusOK, schema.GetDriversResponse{
		Drivers: drivers,
		Limit:   request.Limit,
		Offset:  request.Offset,
		Total:   total,
	})
}
