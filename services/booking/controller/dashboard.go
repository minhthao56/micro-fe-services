package controller

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/minhthao56/monorepo-taxi/services/booking/repository"
)

type DashboardController interface {
	GetGeneralNumber(c *gin.Context)
}

type DashboardControllerImpl struct {
	db            *sql.DB
	repoDashboard repository.DashboardRepository
}

func NewDashboardController(db *sql.DB) DashboardController {
	repoDashboard := repository.NewDashboardRepository(db)
	return &DashboardControllerImpl{db: db, repoDashboard: repoDashboard}
}

func (u *DashboardControllerImpl) GetGeneralNumber(c *gin.Context) {
	generalNumber, err := u.repoDashboard.GetGeneralNumber()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, generalNumber)
}
