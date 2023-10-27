package repository

import (
	"context"
	"database/sql"
)

type CustomerRepository interface {
	SerCurrentLocation(ctx context.Context, long float64, lat float64, customer_id string) error
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
