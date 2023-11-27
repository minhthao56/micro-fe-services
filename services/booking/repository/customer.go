package repository

import (
	"context"
	"database/sql"

	"github.com/minhthao56/monorepo-taxi/libs/go/schema"
	"github.com/pkg/errors"
)

type CustomerRepository interface {
	SerCurrentLocation(ctx context.Context, req schema.SetLocationRequest, customer_id string) error
	GetCustomers(ctx context.Context, req schema.GetCustomersRequest) ([]schema.Customer, error)
	GetCustomer(ctx context.Context, customer_id string) (schema.Customer, error)
	CountCustomers(ctx context.Context, req schema.GetCustomersRequest) (int, error)
	UpdateVIP(ctx context.Context, UserID string, IsVIP bool) error
	GetCurrentCustomer(ctx context.Context, UserID string) (schema.Customer, error)
}

type CustomerRepositoryImpl struct {
	db *sql.DB
}

func NewCustomerRepository(db *sql.DB) CustomerRepository {
	return &CustomerRepositoryImpl{db: db}
}

func (c *CustomerRepositoryImpl) SerCurrentLocation(ctx context.Context, req schema.SetLocationRequest, customer_id string) error {
	r, e := c.db.Exec("UPDATE customers SET long = $1, lat = $2 WHERE user_id = $3", req.Long, req.Lat, customer_id)
	if e != nil {
		return e
	}
	if n, _ := r.RowsAffected(); n == 0 {
		return errors.Wrap(sql.ErrNoRows, "customer not found")
	}
	return nil
}

func (c *CustomerRepositoryImpl) GetCustomers(ctx context.Context, req schema.GetCustomersRequest) ([]schema.Customer, error) {
	var customers []schema.Customer
	r, e := c.db.Query(`
		SELECT c.customer_id,c.is_vip,
		c.long, c.lat, u.first_name, u.last_name, u.email, u.phone_number,
		a.formatted_address, a.display_name
		FROM customers  AS c
		JOIN users AS u ON c.user_id = u.user_id
		LEFT JOIN addresses AS a ON c.long = a.long AND c.lat = a.lat
		WHERE u.first_name LIKE '%' || $1 || '%' OR u.last_name LIKE '%' || $1 || '%'
		LIMIT $2 OFFSET $3
	`, req.Search, req.Limit, req.Offset,
	)
	if e != nil {
		return customers, e
	}
	for r.Next() {
		var customer schema.Customer
		var long, lat sql.NullFloat64
		var formattedAddress, displayName sql.NullString
		e = r.Scan(
			&customer.CustomerId,
			&customer.IsVIP,
			&long,
			&lat,
			&customer.FirstName,
			&customer.LastName,
			&customer.Email,
			&customer.PhoneNumber,
			&formattedAddress,
			&displayName,
		)
		if e != nil {
			return customers, e
		}
		customer.Long = long.Float64
		customer.Lat = lat.Float64
		customer.Address.FormattedAddress = formattedAddress.String
		customer.Address.DisplayName = displayName.String
		customers = append(customers, customer)
	}
	return customers, nil
}

func (c *CustomerRepositoryImpl) GetCustomer(ctx context.Context, customer_id string) (schema.Customer, error) {
	var customer schema.Customer
	r := c.db.QueryRow(`
		SELECT c.customer_id, c.long, c.lat, u.first_name, u.last_name, u.email, u.phone_number
		FROM customers  AS c
		JOIN users AS u ON c.user_id = u.user_id
		WHERE c.customer_id = $1
	`, customer_id,
	)
	var long, lat sql.NullFloat64
	e := r.Scan(
		&customer.CustomerId,
		&long,
		&lat,
		&customer.FirstName,
		&customer.LastName,
		&customer.Email,
		&customer.PhoneNumber,
	)
	customer.Long = long.Float64
	customer.Lat = lat.Float64
	if e != nil {
		return customer, e
	}
	return customer, nil
}

func (c *CustomerRepositoryImpl) CountCustomers(ctx context.Context, req schema.GetCustomersRequest) (int, error) {
	var total int
	r := c.db.QueryRow(`
		SELECT COUNT(*)
		FROM customers  AS c
		JOIN users AS u ON c.user_id = u.user_id
		WHERE u.first_name LIKE '%' || $1 || '%' OR u.last_name LIKE '%' || $1 || '%'
	`, req.Search,
	)
	e := r.Scan(&total)
	if e != nil {
		return total, e
	}
	return total, nil
}

func (c *CustomerRepositoryImpl) UpdateVIP(ctx context.Context, UserID string, IsVIP bool) error {
	r, e := c.db.Exec("UPDATE customers SET is_vip = $1 WHERE user_id = $2", IsVIP, UserID)
	if e != nil {
		return e
	}
	if n, _ := r.RowsAffected(); n == 0 {
		return errors.Wrap(sql.ErrNoRows, "customer not found")
	}
	return nil
}

func (c *CustomerRepositoryImpl) GetCurrentCustomer(ctx context.Context, UserID string) (schema.Customer, error) {
	var customer schema.Customer
	r := c.db.QueryRow(`
		SELECT c.customer_id, c.long, c.lat, c.is_vip
		FROM customers  AS c
		WHERE c.user_id = $1
	`, UserID,
	)
	var long, lat sql.NullFloat64
	e := r.Scan(
		&customer.CustomerId,
		&long,
		&lat,
		&customer.IsVIP,
	)
	customer.Long = long.Float64
	customer.Lat = lat.Float64
	if e != nil {
		return customer, e
	}
	return customer, nil
}
