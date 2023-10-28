package controller

import (
	"database/sql"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/minhthao56/monorepo-taxi/libs/go/schema"
)

type DriverController interface {
	FindNearest(c *gin.Context)
	UpdateLocation(c *gin.Context)
}

type DriverControllerImpl struct {
	db *sql.DB
}

func NewDriverController(db *sql.DB) DriverController {
	return &DriverControllerImpl{db: db}
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
