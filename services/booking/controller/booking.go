package controller

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/minhthao56/monorepo-taxi/libs/go/schema"
	"github.com/minhthao56/monorepo-taxi/services/booking/repository"
)

type BookingController interface {
	CreateBooking(c *gin.Context)
	UpdateBooking(c *gin.Context)
}

type BookingControllerImpl struct {
	db          *sql.DB
	repoBooking repository.BookingRepository
}

func NewBookingController(db *sql.DB) BookingController {
	repoBooking := repository.NewBookingRepository(db)
	return &BookingControllerImpl{db: db, repoBooking: repoBooking}
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
	bookingID, err := u.repoBooking.CreateBooking(c, request)
	fmt.Println("--err--", err)
	if err != nil {
		c.JSON(http.StatusInternalServerError, schema.StatusResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		})
		return
	}

	c.JSON(http.StatusOK, schema.CreateBookingResponse{
		BookingID: strconv.Itoa(bookingID),
	})

}

func (u *BookingControllerImpl) UpdateBooking(c *gin.Context) {
	body, err := io.ReadAll(c.Request.Body)

	if err != nil {
		c.JSON(http.StatusBadRequest, schema.StatusResponse{
			Message: err.Error(),
			Status:  http.StatusBadRequest,
		})
		return
	}

	var request schema.UpdateBookingRequest

	if err := json.Unmarshal(body, &request); err != nil {
		c.JSON(http.StatusBadRequest, schema.StatusResponse{
			Message: err.Error(),
			Status:  http.StatusBadRequest,
		})
		return
	}

	repoBooking := repository.NewBookingRepository(u.db)

	if err := repoBooking.UpdateBooking(c, request); err != nil {
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
