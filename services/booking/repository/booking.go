package repository

import (
	"context"
	"database/sql"

	"github.com/minhthao56/monorepo-taxi/libs/go/schema"
)

type BookingRepository interface {
	CreateBooking(ctx context.Context, booking schema.CreateBookingRequest) error
}

type BookingRepositoryImpl struct {
	db *sql.DB
}

func NewBookingRepository(db *sql.DB) BookingRepository {
	return &BookingRepositoryImpl{db: db}
}

func (c *BookingRepositoryImpl) CreateBooking(ctx context.Context, booking schema.CreateBookingRequest) error {
	r, e := c.db.Exec(
		"INSERT INTO bookings (customer_id, driver_id, start_long, start_lat, end_long, end_lat, status) VALUES ($1, $2, $3, $4, $5, $6, $7)",
		booking.CustomerID,
		booking.DriverID,
		booking.StartLat,
		booking.StartLat,
		booking.EndLong,
		booking.EndLat,
		booking.Status,
	)
	if e != nil {
		return e
	}
	if n, _ := r.RowsAffected(); n == 0 {
		return sql.ErrNoRows
	}
	return nil
}
