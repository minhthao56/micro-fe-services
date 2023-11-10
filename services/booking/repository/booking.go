package repository

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/minhthao56/monorepo-taxi/libs/go/schema"
)

type BookingRepository interface {
	CreateBooking(ctx context.Context, booking schema.CreateBookingRequest) (int, error)
	UpdateBooking(ctx context.Context, booking schema.UpdateBookingRequest) error
}

type BookingRepositoryImpl struct {
	db *sql.DB
}

func NewBookingRepository(db *sql.DB) BookingRepository {
	return &BookingRepositoryImpl{db: db}
}

func (c *BookingRepositoryImpl) CreateBooking(ctx context.Context, booking schema.CreateBookingRequest) (int, error) {
	row := c.db.QueryRow(
		`INSERT INTO booking (customer_id, driver_id, start_long, start_lat, end_long, end_lat, status) 
		VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING booking_id`,
		booking.CustomerID,
		booking.DriverID,
		booking.StartLat,
		booking.StartLat,
		booking.EndLong,
		booking.EndLat,
		booking.Status,
	)
	fmt.Println("row", row.Err())
	var bookingID int
	err := row.Scan(&bookingID)
	if err != nil {
		if err == sql.ErrNoRows {
			// This means that the query completed successfully, but found no rows
			return 0, fmt.Errorf("no rows found: %w", err)
		}
		// This means that there was an error with the query itself
		return 0, fmt.Errorf("query error: %w", err)
	}
	return bookingID, nil
}

func (c *BookingRepositoryImpl) UpdateBooking(ctx context.Context, booking schema.UpdateBookingRequest) error {
	r, e := c.db.Exec(
		"UPDATE booking SET status = $1 WHERE booking_id = $2",
		booking.Status,
		booking.BookingID,
	)
	if e != nil {
		return e
	}
	if n, _ := r.RowsAffected(); n == 0 {
		return sql.ErrNoRows
	}
	return nil
}
