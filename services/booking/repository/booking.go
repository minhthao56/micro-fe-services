package repository

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/minhthao56/monorepo-taxi/libs/go/schema"
	"github.com/pkg/errors"
)

type BookingRepository interface {
	CreateBooking(ctx context.Context, booking schema.CreateBookingRequest) (int, error)
	UpdateBooking(ctx context.Context, booking schema.UpdateBookingRequest) error
	GetManyBooking(ctx context.Context, booking schema.GetManyBookingRequest) ([]schema.BookingWithAddress, error)
	CountBooking(ctx context.Context, booking schema.GetManyBookingRequest) (int, error)
	GetAddressesByUserID(ctx context.Context, userID string, req schema.GetFrequentlyAddressRequest) ([]schema.Address, error)
	CountAddressesByUserID(ctx context.Context, userID string) (int, error)
	GetHistoryBookingByUserID(ctx context.Context, userID string, req schema.GetHistoryBookingRequest) ([]schema.BookingWithAddress, error)
	CountHistoryBookingByUserID(ctx context.Context, userID string) (int, error)
	CountBookingPerTwoHours(ctx context.Context) (map[int]int, error)
	GetManyBookingInDay(ctx context.Context) ([]schema.Booking, error)
}

type BookingRepositoryImpl struct {
	db *sql.DB
}

func NewBookingRepository(db *sql.DB) BookingRepository {
	return &BookingRepositoryImpl{db: db}
}

func (c *BookingRepositoryImpl) CreateBooking(ctx context.Context, booking schema.CreateBookingRequest) (int, error) {
	row := c.db.QueryRow(
		`INSERT INTO booking (customer_id, driver_id, start_long, start_lat, end_long, end_lat, status, distance) 
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING booking_id`,
		booking.CustomerID,
		booking.DriverID,
		booking.StartLong,
		booking.StartLat,
		booking.EndLong,
		booking.EndLat,
		booking.Status,
		booking.Distance,
	)
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

func (c *BookingRepositoryImpl) GetManyBooking(ctx context.Context, booking schema.GetManyBookingRequest) ([]schema.BookingWithAddress, error) {
	rows, err := c.db.Query(
		`SELECT b.booking_id, b.customer_id, b.driver_id, b.start_long, b.start_lat, 
		b.end_long, b.end_lat, b.status, 
		u.first_name, u.last_name,u.phone_number, u.email,
		u2.first_name, u2.last_name, u2.phone_number,u2.email,
		b.created_at,
		sa.formatted_address, sa.display_name,
		ea.formatted_address, ea.display_name, b.distance
			FROM booking AS b 
			JOIN customers AS c ON b.customer_id = c.customer_id
			JOIN drivers AS d ON b.driver_id = d.driver_id
			JOIN users AS u ON c.user_id = u.user_id
			JOIN users AS u2 ON d.user_id = u2.user_id
			LEFT JOIN addresses AS sa ON sa.lat = b.start_lat AND sa.long = b.start_long
			LEFT JOIN addresses AS ea ON ea.lat = b.end_lat AND ea.long = b.end_long
			WHERE u.first_name LIKE '%' || $1 || '%' OR u.last_name LIKE '%' || $1 || '%'
			ORDER BY b.created_at DESC
			LIMIT $2 
			OFFSET $3`,
		booking.Search,
		booking.Limit,
		booking.Offset,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var bookings []schema.BookingWithAddress
	for rows.Next() {
		var booking schema.BookingWithAddress
		distance := sql.NullFloat64{}

		startFormattedAddress := sql.NullString{}
		startDisplayName := sql.NullString{}

		endFormattedAddress := sql.NullString{}
		endDisplayName := sql.NullString{}

		err := rows.Scan(
			&booking.BookingID,
			&booking.CustomerID,
			&booking.DriverID,
			&booking.StartLong,
			&booking.StartLat,
			&booking.EndLong,
			&booking.EndLat,
			&booking.Status,
			&booking.Customer.FirstName,
			&booking.Customer.LastName,
			&booking.Customer.PhoneNumber,
			&booking.Customer.Email,
			&booking.Driver.FirstName,
			&booking.Driver.LastName,
			&booking.Driver.PhoneNumber,
			&booking.Driver.Email,
			&booking.CreatedAt,
			&startFormattedAddress,
			&startDisplayName,
			&endFormattedAddress,
			&endDisplayName,
			&distance,
		)
		if err != nil {
			return nil, err
		}
		booking.Distance = distance.Float64

		booking.StartAddress.FormattedAddress = startFormattedAddress.String
		booking.StartAddress.DisplayName = startDisplayName.String
		booking.EndAddress.FormattedAddress = endFormattedAddress.String
		booking.EndAddress.DisplayName = endDisplayName.String

		bookings = append(bookings, booking)
	}
	return bookings, nil
}

func (c *BookingRepositoryImpl) CountBooking(ctx context.Context, booking schema.GetManyBookingRequest) (int, error) {
	row := c.db.QueryRow(
		`SELECT COUNT(*) FROM booking AS b 
		JOIN customers AS c ON b.customer_id = c.customer_id
		JOIN drivers AS d ON b.driver_id = d.driver_id
		JOIN users AS u ON c.user_id = u.user_id
		JOIN users AS u2 ON d.user_id = u2.user_id
		WHERE u.first_name LIKE '%' || $1 || '%' OR u.last_name LIKE '%' || $1 || '%'`,
		booking.Search,
	)
	var count int
	err := row.Scan(&count)
	if err != nil {
		return 0, err
	}
	return count, nil
}

func (c *BookingRepositoryImpl) GetAddressesByUserID(ctx context.Context, userID string, req schema.GetFrequentlyAddressRequest) ([]schema.Address, error) {
	rows, err := c.db.Query(
		`SELECT DISTINCT b.end_lat, b.end_long, a.formatted_address, a.display_name FROM booking AS b
		JOIN customers AS c ON  b.customer_id = c.customer_id
        LEFT JOIN addresses AS a ON b.end_lat = a.lat AND  b.end_long = a.long
		WHERE c.user_id = $1
		LIMIT $2
		OFFSET $3;
		`,
		userID, req.Limit, req.Offset,
	)

	if err != nil {
		return nil, errors.Wrap(err, "query booking and address")
	}
	defer rows.Close()

	var addresses []schema.Address

	for rows.Next() {
		address := schema.Address{}
		formattedAddress := sql.NullString{}
		displayName := sql.NullString{}
		err := rows.Scan(
			&address.Lat,
			&address.Long,
			&formattedAddress,
			&displayName,
		)

		if err != nil {
			return nil, errors.Wrap(err, "scan booking address")
		}
		address.FormattedAddress = formattedAddress.String
		address.DisplayName = displayName.String
		addresses = append(addresses, address)
	}
	return addresses, nil
}

func (c *BookingRepositoryImpl) CountAddressesByUserID(ctx context.Context, userID string) (int, error) {
	row := c.db.QueryRow(
		`SELECT COUNT(DISTINCT (b.end_lat::text || ',' || b.end_long::text)) FROM booking AS b
		JOIN customers AS c ON  b.customer_id = c.customer_id
		WHERE c.user_id = $1;`,
		userID,
	)
	var count int
	err := row.Scan(&count)
	if err != nil {
		return 0, err
	}
	return count, nil
}

func (c *BookingRepositoryImpl) GetHistoryBookingByUserID(ctx context.Context, userID string, req schema.GetHistoryBookingRequest) ([]schema.BookingWithAddress, error) {
	rows, err := c.db.Query(
		`SELECT b.booking_id, b.customer_id, b.driver_id, b.start_long, b.start_lat, 
		b.end_long, b.end_lat, b.status, 
		u2.first_name, u2.last_name, u2.phone_number, b.created_at, b.distance,
		sa.formatted_address, sa.display_name, sa.lat, sa.long,
		ea.formatted_address, ea.display_name, ea.lat, ea.long
				FROM booking AS b 
				JOIN customers AS c ON b.customer_id = c.customer_id
				JOIN drivers AS d ON b.driver_id = d.driver_id
				JOIN users AS u2 ON d.user_id = u2.user_id
				LEFT JOIN addresses AS sa ON sa.lat = b.start_lat AND sa.long = b.start_long
				LEFT JOIN addresses AS ea ON ea.lat = b.end_lat AND ea.long = b.end_long
				WHERE c.user_id = $1 AND b.status = 'COMPLETED'
				ORDER BY b.created_at DESC
				LIMIT $2
				OFFSET $3`,
		userID, req.Limit, req.Offset,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var bookings []schema.BookingWithAddress
	for rows.Next() {
		var booking schema.BookingWithAddress
		distance := sql.NullFloat64{}

		startFormattedAddress := sql.NullString{}
		startDisplayName := sql.NullString{}
		startLat := sql.NullFloat64{}
		startLong := sql.NullFloat64{}

		endFormattedAddress := sql.NullString{}
		endDisplayName := sql.NullString{}
		endLat := sql.NullFloat64{}
		endLong := sql.NullFloat64{}

		err := rows.Scan(
			&booking.BookingID,
			&booking.CustomerID,
			&booking.DriverID,
			&booking.StartLong,
			&booking.StartLat,
			&booking.EndLong,
			&booking.EndLat,
			&booking.Status,
			&booking.Driver.FirstName,
			&booking.Driver.LastName,
			&booking.Driver.PhoneNumber,
			&booking.CreatedAt,
			&distance,
			&startFormattedAddress,
			&startDisplayName,
			&startLat,
			&startLong,
			&endFormattedAddress,
			&endDisplayName,
			&endLat,
			&endLong,
		)
		if err != nil {
			return nil, err
		}
		booking.Distance = distance.Float64
		booking.StartAddress.FormattedAddress = startFormattedAddress.String
		booking.StartAddress.DisplayName = startDisplayName.String
		booking.StartAddress.Lat = startLat.Float64
		booking.StartAddress.Long = startLong.Float64
		booking.EndAddress.FormattedAddress = endFormattedAddress.String
		booking.EndAddress.DisplayName = endDisplayName.String
		booking.EndAddress.Lat = endLat.Float64
		booking.EndAddress.Long = endLong.Float64

		bookings = append(bookings, booking)
	}

	return bookings, nil
}

func (c *BookingRepositoryImpl) CountBookingPerTwoHours(ctx context.Context) (map[int]int, error) {

	mapBookingPerTwoHours := make(map[int]int)
	mapBookingPerTwoHours[0] = 0
	mapBookingPerTwoHours[1] = 0
	mapBookingPerTwoHours[2] = 0
	mapBookingPerTwoHours[3] = 0
	mapBookingPerTwoHours[4] = 0
	mapBookingPerTwoHours[5] = 0
	mapBookingPerTwoHours[6] = 0
	mapBookingPerTwoHours[7] = 0
	mapBookingPerTwoHours[8] = 0
	mapBookingPerTwoHours[9] = 0
	mapBookingPerTwoHours[10] = 0
	mapBookingPerTwoHours[11] = 0
	mapBookingPerTwoHours[12] = 0
	mapBookingPerTwoHours[13] = 0
	mapBookingPerTwoHours[14] = 0
	mapBookingPerTwoHours[15] = 0
	mapBookingPerTwoHours[16] = 0
	mapBookingPerTwoHours[17] = 0
	mapBookingPerTwoHours[18] = 0
	mapBookingPerTwoHours[19] = 0
	mapBookingPerTwoHours[20] = 0
	mapBookingPerTwoHours[21] = 0
	mapBookingPerTwoHours[22] = 0
	mapBookingPerTwoHours[23] = 0

	rows, err := c.db.Query(
		`SELECT COUNT(*), EXTRACT(HOUR FROM created_at) FROM booking
		WHERE created_at BETWEEN NOW() - INTERVAL '2 HOURS' AND NOW()
		GROUP BY EXTRACT(HOUR FROM created_at)
		ORDER BY EXTRACT(HOUR FROM created_at) ASC`,
	)
	if err != nil {
		return mapBookingPerTwoHours, err
	}

	defer rows.Close()
	for rows.Next() {
		var count int
		var hour int
		err := rows.Scan(
			&count,
			&hour,
		)
		if err != nil {
			return mapBookingPerTwoHours, err
		}
		mapBookingPerTwoHours[hour] = count

	}
	return mapBookingPerTwoHours, nil
}

func (c *BookingRepositoryImpl) GetManyBookingInDay(ctx context.Context) ([]schema.Booking, error) {
	rows, err := c.db.Query(
		`SELECT DISTINCT (b.customer_id), b.booking_id, b.driver_id, b.start_long, b.start_lat, 
		b.end_long, b.end_lat, b.status,u.last_name, u.first_name, b.created_at, b.distance, c.is_vip
				FROM booking AS b 
				JOIN customers AS c ON b.customer_id = c.customer_id
				JOIN users AS u ON c.user_id = u.user_id
				WHERE b.created_at BETWEEN NOW() - INTERVAL '1 DAY' AND NOW()`,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var bookings []schema.Booking
	for rows.Next() {
		var booking schema.Booking
		distance := sql.NullFloat64{}

		err := rows.Scan(
			&booking.CustomerID,
			&booking.BookingID,
			&booking.DriverID,
			&booking.StartLong,
			&booking.StartLat,
			&booking.EndLong,
			&booking.EndLat,
			&booking.Status,
			&booking.Customer.FirstName,
			&booking.Customer.LastName,
			&booking.CreatedAt,
			&distance,
			&booking.Customer.IsVIP,
		)
		if err != nil {
			return nil, err
		}
		booking.Distance = distance.Float64
		bookings = append(bookings, booking)
	}

	return bookings, nil
}

func (c *BookingRepositoryImpl) CountHistoryBookingByUserID(ctx context.Context, userID string) (int, error) {
	row := c.db.QueryRow(
		`SELECT COUNT(*) FROM booking AS b 
		JOIN customers AS c ON b.customer_id = c.customer_id
		WHERE c.user_id = $1 AND b.status = 'COMPLETED'`,
		userID,
	)
	var count int
	err := row.Scan(&count)
	if err != nil {
		return 0, err
	}
	return count, nil
}
