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

type BookingController interface {
	CreateBooking(c *gin.Context)
}

type BookingControllerImpl struct {
	db *sql.DB
}

func NewBookingController(db *sql.DB) BookingController {
	return &BookingControllerImpl{db: db}
}

func (u *BookingControllerImpl) CreateBooking(c *gin.Context) {
	body, err := io.ReadAll(c.Request.Body)

	if err != nil {
		c.JSON(http.StatusBadRequest, schema.StatusResponse{
			Message: err.Error(),
			Status:  http.StatusBadRequest,
		})
		return
	}

	var request schema.CreateBookingRequest

	if err := json.Unmarshal(body, &request); err != nil {
		c.JSON(http.StatusBadRequest, schema.StatusResponse{
			Message: err.Error(),
			Status:  http.StatusBadRequest,
		})
		return
	}

	repoBooking := repository.NewBookingRepository(u.db)

	if err := repoBooking.CreateBooking(c, request); err != nil {
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
