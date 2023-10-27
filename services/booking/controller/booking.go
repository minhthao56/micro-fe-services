package controller

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
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
	c.JSON(http.StatusOK, gin.H{"message": "create booking"})
}
