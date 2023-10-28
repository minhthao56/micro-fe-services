package repository

import (
	"database/sql"

	"github.com/minhthao56/monorepo-taxi/libs/go/schema"
)

type VehicleTypeRepository interface {
	GetVehicleTypes() (schema.GetVehicleTypesResponse, error)
}

type VehicleTypeRepositoryImpl struct {
	db *sql.DB
}

func NewVehicleTypeRepository(db *sql.DB) VehicleTypeRepository {
	return &VehicleTypeRepositoryImpl{db: db}
}

func (c *VehicleTypeRepositoryImpl) GetVehicleTypes() (schema.GetVehicleTypesResponse, error) {
	var vehicleTypes schema.GetVehicleTypesResponse
	var vehicleType schema.VehicleType

	rows, err := c.db.Query("SELECT vehicle_type_id, vehicle_name FROM vehicle_types")
	if err != nil {
		return vehicleTypes, err
	}
	for rows.Next() {
		err = rows.Scan(&vehicleType.VehicleTypeID, &vehicleType.VehicleName)
		if err != nil {
			return vehicleTypes, err
		}
		vehicleTypes.VehicleTypes = append(vehicleTypes.VehicleTypes, vehicleType)
	}
	return vehicleTypes, nil
}
