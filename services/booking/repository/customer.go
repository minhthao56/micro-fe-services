package repository

import (
	"context"
	"database/sql"

	"github.com/minhthao56/monorepo-taxi/libs/go/schema"
)

type CustomerRepository interface {
	SerCurrentLocation(ctx context.Context, long float64, lat float64, customer_id string) error
	GetCustomers(ctx context.Context, req schema.GetCustomersRequest) ([]schema.Customer, error)
	GetCustomer(ctx context.Context, customer_id string) (schema.Customer, error)
	CountCustomers(ctx context.Context, req schema.GetCustomersRequest) (int, error)
}

type CustomerRepositoryImpl struct {
	db *sql.DB
}

func NewCustomerRepository(db *sql.DB) CustomerRepository {
	return &CustomerRepositoryImpl{db: db}
}

func (c *CustomerRepositoryImpl) SerCurrentLocation(ctx context.Context, long float64, lat float64, customer_id string) error {
	r, e := c.db.Exec("UPDATE customers SET long = $1, lat = $2 WHERE customer_id = $3", long, lat, customer_id)
	if e != nil {
		return e
	}
	if n, _ := r.RowsAffected(); n == 0 {
		return sql.ErrNoRows
	}
	return nil
}

func (c *CustomerRepositoryImpl) GetCustomers(ctx context.Context, req schema.GetCustomersRequest) ([]schema.Customer, error) {
	var customer schema.Customer
	var customers []schema.Customer
	r, e := c.db.Query(`
		SELECT c.customer_id, c.long, c.lat, u.first_name, u.last_name, u.email, u.phone_number
		FROM customers  AS c
		JOIN users AS u ON c.user_id = u.user_id
		WHERE u.first_name LIKE '%' || $1 || '%' OR u.last_name LIKE '%' || $1 || '%'
		LIMIT $2 OFFSET $3
	`, req.Search, req.Limit, req.Offset,
	)
	if e != nil {
		return customers, e
	}

	for r.Next() {
		e = r.Scan(
			&customer.CustomerId,
			&customer.Long,
			&customer.Lat,
			&customer.FirstName,
			&customer.LastName,
			&customer.Email,
			&customer.PhoneNumber,
		)
		if e != nil {
			return customers, e
		}
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
	e := r.Scan(
		&customer.CustomerId,
		&customer.Long,
		&customer.Lat,
		&customer.FirstName,
		&customer.LastName,
		&customer.Email,
		&customer.PhoneNumber,
	)
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