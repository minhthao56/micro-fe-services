package repository

import (
	"context"
	"database/sql"

	"github.com/minhthao56/monorepo-taxi/libs/go/schema"
)

type DriverRepository interface {
	GetDrivers(ctx context.Context, req schema.GetDriversRequest) ([]schema.Driver, error)
	GetDriver(ctx context.Context, driver_id string) (schema.Driver, error)
	CountDriver(ctx context.Context, req schema.GetDriversRequest) (int, error)
	GetNearbyDrivers(ctx context.Context, req schema.GetNearbyDriversRequest) ([]schema.DriverWithDistance, error)
	UpdateLocation(ctx context.Context, req schema.UpdateLocationRequest) error
	UpdateStatus(ctx context.Context, req schema.UpdateStatusRequest) error
}

type DriverRepositoryImpl struct {
	db *sql.DB
}

func NewDriverRepository(db *sql.DB) DriverRepository {
	return &DriverRepositoryImpl{db: db}
}

func (d *DriverRepositoryImpl) GetDrivers(ctx context.Context, req schema.GetDriversRequest) ([]schema.Driver, error) {
	var driver schema.Driver
	var drivers []schema.Driver
	r, e := d.db.Query(`
		SELECT d.driver_id, d.current_long, d.current_lat, d.status, 
		u.first_name, u.last_name, u.email, u.phone_number, 
		v.vehicle_name, v.vehicle_type_id, u.created_at
		FROM drivers AS d
		JOIN users AS u ON d.user_id = u.user_id
		JOIN vehicle_types AS v ON d.vehicle_type_id = v.vehicle_type_id
		WHERE u.first_name LIKE '%' || $1 || '%' OR u.last_name LIKE '%' || $1 || '%'
		LIMIT $2 OFFSET $3;
	`, req.Search, req.Limit, req.Offset,
	)
	if e != nil {
		return drivers, e
	}
	var long, lat sql.NullFloat64
	for r.Next() {
		e = r.Scan(
			&driver.DriverID,
			&long,
			&lat,
			&driver.Status,
			&driver.FirstName,
			&driver.LastName,
			&driver.Email,
			&driver.PhoneNumber,
			&driver.VehicleName,
			&driver.VehicleTypeID,
			&driver.CreatedAt,
		)
		if e != nil {
			return drivers, e
		}
		driver.CurrentLong = long.Float64
		driver.CurrentLat = lat.Float64
		drivers = append(drivers, driver)
	}
	return drivers, nil
}

func (c *DriverRepositoryImpl) GetDriver(ctx context.Context, driver_id string) (schema.Driver, error) {
	var driver schema.Driver
	r := c.db.QueryRow(`
		SELECT d.driver_id, d.current_long, d.current_lat, d.status, u.first_name, u.last_name, u.email, u.phone_number, v.vehicle_name, v.vehicle_type_id
		FROM drivers AS d
		JOIN users AS u ON d.user_id = u.user_id
		JOIN vehicle_types AS v ON d.vehicle_type_id = v.vehicle_type_id
		WHERE d.driver_id = $1;
	`, driver_id,
	)
	var long, lat sql.NullFloat64
	e := r.Scan(
		&driver.DriverID,
		&long,
		&lat,
		&driver.Status,
		&driver.FirstName,
		&driver.LastName,
		&driver.Email,
		&driver.PhoneNumber,
		&driver.VehicleName,
		&driver.VehicleTypeID,
	)
	driver.CurrentLong = long.Float64
	driver.CurrentLat = lat.Float64
	if e != nil {
		return driver, e
	}
	return driver, nil
}

func (c *DriverRepositoryImpl) CountDriver(ctx context.Context, req schema.GetDriversRequest) (int, error) {
	var total int
	r := c.db.QueryRow(`
		SELECT COUNT(*)
		FROM drivers AS d
		JOIN users AS u ON d.user_id = u.user_id
		JOIN vehicle_types AS v ON d.vehicle_type_id = v.vehicle_type_id
		WHERE u.first_name LIKE '%' || $1 || '%' OR u.last_name LIKE '%' || $1 || '%';
	`, req.Search,
	)
	e := r.Scan(&total)
	if e != nil {
		return total, e
	}
	return total, nil
}

func (c *DriverRepositoryImpl) GetNearbyDrivers(ctx context.Context, req schema.GetNearbyDriversRequest) ([]schema.DriverWithDistance, error) {
	var driver schema.DriverWithDistance
	var drivers []schema.DriverWithDistance
	r, e := c.db.Query(`
		SELECT
			d.driver_id,
			d.current_long,
			d.current_lat,
			d.status,
			u.first_name,
			u.last_name,
			u.email,
			u.phone_number,
			v.vehicle_name,
			v.vehicle_type_id,
			ST_Distance(
				ST_MakePoint($1, $2)::geography,
				ST_MakePoint(d.current_long, d.current_lat)::geography
			) AS distance
		FROM drivers AS d
		JOIN users AS u ON d.user_id = u.user_id
		JOIN vehicle_types AS v ON d.vehicle_type_id = v.vehicle_type_id
		WHERE ST_DWithin(
			ST_MakePoint($1, $2)::geography,
			ST_MakePoint(d.current_long, d.current_lat)::geography,
			3000
		) AND d.status = 'ONLINE';
	`, req.RequestLong, req.RequestLat,
	)
	if e != nil {
		return drivers, e
	}
	var long, lat sql.NullFloat64
	for r.Next() {
		e = r.Scan(
			&driver.DriverID,
			&long,
			&lat,
			&driver.Status,
			&driver.FirstName,
			&driver.LastName,
			&driver.Email,
			&driver.PhoneNumber,
			&driver.VehicleName,
			&driver.VehicleTypeID,
			&driver.Distance,
		)
		if e != nil {
			return drivers, e
		}
		driver.CurrentLong = long.Float64
		driver.CurrentLat = lat.Float64
		drivers = append(drivers, driver)
	}
	return drivers, nil
}

func (c *DriverRepositoryImpl) UpdateLocation(ctx context.Context, req schema.UpdateLocationRequest) error {
	result, e := c.db.Exec(`
		UPDATE drivers
		SET current_long = $1, current_lat = $2
		WHERE driver_id = $3;
	`, req.CurrentLong, req.CurrentLat, req.DriverID,
	)
	if e != nil {
		return e
	}
	r, e := result.RowsAffected()
	if e != nil {
		return e
	}
	if r == 0 {
		return sql.ErrNoRows
	}
	return nil
}

func (c *DriverRepositoryImpl) UpdateStatus(ctx context.Context, req schema.UpdateStatusRequest) error {
	result, e := c.db.Exec(`
		UPDATE drivers
		SET status = $1
		WHERE driver_id = $2;
	`, req.Status, req.DriverID,
	)
	if e != nil {
		return e
	}
	r, e := result.RowsAffected()
	if e != nil {
		return e
	}
	if r == 0 {
		return sql.ErrNoRows
	}
	return nil
}
