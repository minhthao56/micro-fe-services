package repository

import (
	"context"
	"database/sql"
	"fmt"
	"strings"

	"github.com/minhthao56/monorepo-taxi/libs/go/schema"
	"github.com/pkg/errors"
)

type BookingRepository interface {
	CreateBooking(ctx context.Context, booking schema.CreateBookingRequest) (int, error)
	UpdateBooking(ctx context.Context, booking schema.UpdateBookingRequest) error
	GetManyBooking(ctx context.Context, booking schema.GetManyBookingRequest) ([]schema.Booking, error)
	CountBooking(ctx context.Context, booking schema.GetManyBookingRequest) (int, error)
	GetAddressesByUserID(ctx context.Context, userID string) ([]schema.Address, error)
	UpdateAddresses(ctx context.Context, addresses []schema.Address) error
	GetBookingByUserID(ctx context.Context, userID string) ([]schema.BookingWithAddress, error)
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
		VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING booking_id`,
		booking.CustomerID,
		booking.DriverID,
		booking.StartLat,
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

func (c *BookingRepositoryImpl) GetManyBooking(ctx context.Context, booking schema.GetManyBookingRequest) ([]schema.Booking, error) {
	rows, err := c.db.Query(
		`SELECT b.booking_id, b.customer_id, b.driver_id, b.start_long, b.start_lat, b.end_long, b.end_lat, b.status, u.first_name, u.last_name,u.phone_number, u2.first_name, u2.last_name, u2.phone_number, b.created_at
		FROM booking AS b 
		JOIN customers AS c ON b.customer_id = c.customer_id
		JOIN drivers AS d ON b.driver_id = d.driver_id
		JOIN users AS u ON c.user_id = u.user_id
		JOIN users AS u2 ON d.user_id = u2.user_id
		WHERE u.first_name LIKE '%' || $1 || '%' OR u.last_name LIKE '%' || $1 || '%'
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
	var bookings []schema.Booking
	for rows.Next() {
		var booking schema.Booking
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
			&booking.Driver.FirstName,
			&booking.Driver.LastName,
			&booking.Driver.PhoneNumber,
			&booking.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
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

func (c *BookingRepositoryImpl) GetAddressesByUserID(ctx context.Context, userID string) ([]schema.Address, error) {
	address := schema.Address{}
	rows, err := c.db.Query(
		`SELECT DISTINCT b.end_lat, b.end_long FROM booking AS b
		JOIN customers AS c ON  b.customer_id = c.customer_id
		JOIN users AS u ON c.user_id = u.user_id
		WHERE c.user_id = $1`,
		userID,
	)

	if err != nil {
		return nil, errors.Wrap(err, "query booking")
	}
	defer rows.Close()

	var addresses []schema.Address

	for rows.Next() {
		err := rows.Scan(
			&address.Lat,
			&address.Long,
		)
		if err != nil {
			return nil, errors.Wrap(err, "scan booking")
		}
		addresses = append(addresses, address)
	}

	var latlogs []string
	for _, address := range addresses {
		latlogs = append(latlogs, fmt.Sprintf("(%f,%f)", address.Lat, address.Long))
	}

	query := fmt.Sprintf(`SELECT lat, long, formatted_address, display_name FROM addresses WHERE (lat::double precision, long::double precision) IN (%s)`, strings.Join(latlogs, ", "))

	addressRow, err := c.db.Query(query)
	if err != nil {
		return nil, errors.Wrap(err, "query address")
	}
	defer addressRow.Close()

	var addressList []schema.Address

	for addressRow.Next() {
		addressNull := sql.NullString{}
		displayNull := sql.NullString{}
		err := addressRow.Scan(
			&address.Lat,
			&address.Long,
			&addressNull,
			&displayNull,
		)

		if err != nil {
			return nil, errors.Wrap(err, "scan address")
		}
		address.FormattedAddress = addressNull.String
		address.DisplayName = displayNull.String
		addressList = append(addressList, address)
	}

	for i, address := range addresses {
		if len(addressList) == 0 {
			geocode, err := GetGeocodeGoong(fmt.Sprintf("%f", address.Lat), fmt.Sprintf("%f", address.Long))

			if err != nil {
				return nil, errors.Wrap(err, "get geocode")
			}
			if (len(geocode.Results)) == 0 || geocode.Status != "OK" {
				continue
			}

			addresses[i].FormattedAddress = geocode.Results[0].FormattedAddress
			addresses[i].DisplayName = geocode.Results[0].Name
		}
		for _, address2 := range addressList {
			if address.Lat == address2.Lat && address.Long == address2.Long && address.FormattedAddress != "" && address.DisplayName != "" {
				addresses[i].FormattedAddress = address2.FormattedAddress
				addresses[i].DisplayName = address2.DisplayName
			} else {
				geocode, err := GetGeocodeGoong(fmt.Sprintf("%f", address.Lat), fmt.Sprintf("%f", address.Long))

				if err != nil {
					return nil, errors.Wrap(err, "get geocode 2")
				}

				if (len(geocode.Results)) == 0 || geocode.Status != "OK" {
					continue
				}
				addresses[i].FormattedAddress = geocode.Results[0].FormattedAddress
				addresses[i].DisplayName = geocode.Results[0].Name
			}
		}
	}

	err = c.UpdateAddresses(ctx, addresses)

	if err != nil {
		return nil, errors.Wrap(err, "update addresses")
	}

	return addresses, nil
}

func (c *BookingRepositoryImpl) UpdateAddresses(ctx context.Context, addresses []schema.Address) error {
	for _, address := range addresses {
		_, err := c.db.Exec(
			`INSERT INTO addresses (lat, long, formatted_address, display_name)
			VALUES ($1, $2, $3, $4)
			ON CONFLICT (lat, long)
			DO UPDATE SET formatted_address = EXCLUDED.formatted_address, display_name = EXCLUDED.display_name;`,
			address.Lat,
			address.Long,
			address.FormattedAddress,
			address.DisplayName,
		)
		if err != nil {
			return errors.Wrap(err, "insert address")
		}
	}
	return nil
}

func (c *BookingRepositoryImpl) GetBookingByUserID(ctx context.Context, userID string) ([]schema.BookingWithAddress, error) {
	rows, err := c.db.Query(
		`SELECT b.booking_id, b.customer_id, b.driver_id, b.start_long, b.start_lat, b.end_long, b.end_lat, b.status, 
		u2.first_name, u2.last_name, u2.phone_number, b.created_at, b.distance
		FROM booking AS b 
		JOIN customers AS c ON b.customer_id = c.customer_id
		JOIN drivers AS d ON b.driver_id = d.driver_id
		JOIN users AS u2 ON d.user_id = u2.user_id
		WHERE c.user_id = $1 AND b.status = 'COMPLETED'`,
		userID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var bookings []schema.BookingWithAddress
	for rows.Next() {
		var booking schema.BookingWithAddress
		distance := sql.NullFloat64{}
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
		)
		if err != nil {
			return nil, err
		}
		booking.Distance = distance.Float64
		bookings = append(bookings, booking)
	}

	// Map Start Address
	var startLatlogs []string
	for _, booking := range bookings {
		startLatlogs = append(startLatlogs, fmt.Sprintf("(%f,%f)", booking.StartLat, booking.StartLong))
	}

	startQuery := fmt.Sprintf(`SELECT lat, long, formatted_address, display_name FROM addresses WHERE (lat::double precision, long::double precision) IN (%s)`, strings.Join(startLatlogs, ", "))
	startAddresses, err := c.db.Query(startQuery)
	if err != nil {
		return nil, errors.Wrap(err, "query address")
	}
	defer startAddresses.Close()

	var startAddressList []schema.Address

	for startAddresses.Next() {
		address := schema.Address{}
		addressNull := sql.NullString{}
		displayNull := sql.NullString{}
		err := startAddresses.Scan(
			&address.Lat,
			&address.Long,
			&addressNull,
			&displayNull,
		)

		if err != nil {
			return nil, errors.Wrap(err, "scan start address")
		}
		address.FormattedAddress = addressNull.String
		address.DisplayName = displayNull.String
		startAddressList = append(startAddressList, address)
	}

	for i, booking := range bookings {
		if len(startAddressList) == 0 {
			geocode, err := GetGeocodeGoong(fmt.Sprintf("%f", booking.StartLat), fmt.Sprintf("%f", booking.StartLong))

			if err != nil {
				return nil, errors.Wrap(err, "get geocode")
			}
			if (len(geocode.Results)) == 0 || geocode.Status != "OK" {
				continue
			}

			bookings[i].StartAddress.FormattedAddress = geocode.Results[0].FormattedAddress
			bookings[i].StartAddress.DisplayName = geocode.Results[0].Name
		}
		for _, startAddress := range startAddressList {
			if booking.StartLat == startAddress.Lat && booking.StartLong == startAddress.Long && startAddress.FormattedAddress != "" && startAddress.DisplayName != "" {
				bookings[i].StartAddress.FormattedAddress = startAddress.FormattedAddress
				bookings[i].StartAddress.DisplayName = startAddress.DisplayName
			} else {
				geocode, err := GetGeocodeGoong(fmt.Sprintf("%f", startAddress.Lat), fmt.Sprintf("%f", startAddress.Long))

				if err != nil {
					return nil, errors.Wrap(err, "get geocode 2")
				}

				if (len(geocode.Results)) == 0 || geocode.Status != "OK" {
					continue
				}
				bookings[i].StartAddress.FormattedAddress = geocode.Results[0].FormattedAddress
				bookings[i].StartAddress.DisplayName = geocode.Results[0].Name
			}
		}
	}

	err = c.UpdateAddresses(ctx, startAddressList)

	if err != nil {
		return nil, errors.Wrap(err, "update addresses")
	}

	// Map End Address
	var endLatlogs []string
	for _, booking := range bookings {
		endLatlogs = append(endLatlogs, fmt.Sprintf("(%f,%f)", booking.EndLat, booking.EndLong))
	}

	endQuery := fmt.Sprintf(`SELECT lat, long, formatted_address, display_name FROM addresses WHERE (lat::double precision, long::double precision) IN (%s)`, strings.Join(endLatlogs, ", "))

	endAddresses, err := c.db.Query(endQuery)
	if err != nil {
		return nil, errors.Wrap(err, "query start address")
	}
	defer endAddresses.Close()

	var endAddressList []schema.Address

	for endAddresses.Next() {
		address := schema.Address{}
		addressNull := sql.NullString{}
		displayNull := sql.NullString{}
		err := endAddresses.Scan(
			&address.Lat,
			&address.Long,
			&addressNull,
			&displayNull,
		)

		if err != nil {
			return nil, errors.Wrap(err, "scan end address")
		}
		address.FormattedAddress = addressNull.String
		address.DisplayName = displayNull.String
		endAddressList = append(endAddressList, address)
	}

	for i, booking := range bookings {
		if len(endAddressList) == 0 {
			geocode, err := GetGeocodeGoong(fmt.Sprintf("%f", booking.EndLat), fmt.Sprintf("%f", booking.EndLong))

			if err != nil {
				return nil, errors.Wrap(err, "get geocode")
			}
			if (len(geocode.Results)) == 0 || geocode.Status != "OK" {
				continue
			}

			bookings[i].EndAddress.FormattedAddress = geocode.Results[0].FormattedAddress
			bookings[i].EndAddress.DisplayName = geocode.Results[0].Name
		}
		for _, endAddress := range endAddressList {
			if booking.EndLat == endAddress.Lat && booking.EndLong == endAddress.Long && endAddress.FormattedAddress != "" && endAddress.DisplayName != "" {
				bookings[i].EndAddress.FormattedAddress = endAddress.FormattedAddress
				bookings[i].EndAddress.DisplayName = endAddress.DisplayName
			} else {
				geocode, err := GetGeocodeGoong(fmt.Sprintf("%f", endAddress.Lat), fmt.Sprintf("%f", endAddress.Long))

				if err != nil {
					return nil, errors.Wrap(err, "get geocode 2")
				}

				if (len(geocode.Results)) == 0 || geocode.Status != "OK" {
					continue
				}
				bookings[i].EndAddress.FormattedAddress = geocode.Results[0].FormattedAddress
				bookings[i].EndAddress.DisplayName = geocode.Results[0].Name
			}
		}
	}

	err = c.UpdateAddresses(ctx, endAddressList)

	if err != nil {
		return nil, errors.Wrap(err, "update end addresses")
	}

	return bookings, nil
}
