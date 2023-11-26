package repository

import (
	"context"
	"database/sql"

	"github.com/minhthao56/monorepo-taxi/libs/go/schema"
	"github.com/pkg/errors"
)

type AddressRepository interface {
	UpdateAddresses(ctx context.Context, addresses []schema.Address) error
}

type AddressRepositoryImpl struct {
	db *sql.DB
}

func NewAddressRepository(db *sql.DB) AddressRepository {
	return &AddressRepositoryImpl{db: db}
}

func (c *AddressRepositoryImpl) UpdateAddresses(ctx context.Context, addresses []schema.Address) error {
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
			return errors.Wrap(err, " address")
		}
	}
	return nil
}
