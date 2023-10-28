package controller

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/minhthao56/monorepo-taxi/libs/go/schema"
	"github.com/minhthao56/monorepo-taxi/services/booking/repository"
)

type VehicleTypeController interface {
	GetVehicleTypes(c *gin.Context)
}

type VehicleTypeControllerImpl struct {
	repoVehicleType repository.VehicleTypeRepository
	db              *sql.DB
}

func NewVehicleTypeController(db *sql.DB) VehicleTypeController {
	repoVehicleType := repository.NewVehicleTypeRepository(db)
	return &VehicleTypeControllerImpl{db: db, repoVehicleType: repoVehicleType}
}

func (u *VehicleTypeControllerImpl) GetVehicleTypes(c *gin.Context) {
	vehicleTypes, err := u.repoVehicleType.GetVehicleTypes()
	if err != nil {
		c.JSON(http.StatusBadRequest, schema.StatusResponse{
			Message: err.Error(),
			Status:  http.StatusBadRequest,
		})
		return
	}
	c.JSON(http.StatusOK, vehicleTypes)
}
