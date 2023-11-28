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

type BookingController interface {
	CreateBooking(c *gin.Context)
	UpdateBooking(c *gin.Context)
	GetManyBooking(c *gin.Context)
	GetFrequentlyAddresses(c *gin.Context)
	GetHistoryBookingByUserID(c *gin.Context)
	CountBookingPerTwoHours(c *gin.Context)
}

type BookingControllerImpl struct {
	db          *sql.DB
	repoBooking repository.BookingRepository
	repoAddress repository.AddressRepository
}

func NewBookingController(db *sql.DB) BookingController {
	repoBooking := repository.NewBookingRepository(db)
	repoAddress := repository.NewAddressRepository(db)
	return &BookingControllerImpl{db: db, repoBooking: repoBooking, repoAddress: repoAddress}
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
	if err != nil {
		c.JSON(http.StatusInternalServerError, schema.StatusResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		})
		return
	}

	err = u.repoAddress.UpdateAddresses(c, []schema.Address{
		request.EndAddress,
		request.StartAddress,
	})
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

	if err := u.repoBooking.UpdateBooking(c, request); err != nil {
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

func (u *BookingControllerImpl) GetManyBooking(c *gin.Context) {

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

	request := schema.GetManyBookingRequest{
		Limit:  limit,
		Offset: offset,
		Search: search,
	}

	booking, err := u.repoBooking.GetManyBooking(c, request)

	if err != nil {
		c.JSON(http.StatusInternalServerError, schema.StatusResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		})
		return
	}

	total, err := u.repoBooking.CountBooking(c, request)

	if err != nil {
		c.JSON(http.StatusInternalServerError, schema.StatusResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		})
		return
	}

	c.JSON(http.StatusOK, schema.GetManyBookingResponse{
		Booking: booking,
		Limit:   limit,
		Offset:  offset,
		Total:   total,
	})
}

func (u *BookingControllerImpl) GetFrequentlyAddresses(c *gin.Context) {

	stringUserID := c.GetString("user_id")

	addresses, err := u.repoBooking.GetAddressesByUserID(c, stringUserID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, schema.StatusResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		})
		return
	}

	c.JSON(http.StatusOK, schema.GetFrequentlyAddressResponse{
		Addresses: addresses,
	})
}

func (u *BookingControllerImpl) GetHistoryBookingByUserID(c *gin.Context) {

	stringUserID := c.GetString("user_id")

	bookings, err := u.repoBooking.GetBookingByUserID(c, stringUserID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, schema.StatusResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		})
		return
	}

	c.JSON(http.StatusOK, schema.GetHistoryBookingResponse{
		BookingWithAddress: bookings,
	})
}

func (u *BookingControllerImpl) CountBookingPerTwoHours(c *gin.Context) {
	results, err := u.repoBooking.CountBookingPerTwoHours(c)

	if err != nil {
		c.JSON(http.StatusInternalServerError, schema.StatusResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		})
		return
	}
	c.JSON(http.StatusOK, schema.BookingPerTwoHours{
		Results: results,
	})
}
