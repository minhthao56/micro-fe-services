package repository

import (
	"database/sql"

	"github.com/minhthao56/monorepo-taxi/libs/go/schema"
)

type DashboardRepository interface {
	GetGeneralNumber() (schema.GeneralNumberResponse, error)
}

type DashboardRepositoryImpl struct {
	db *sql.DB
}

func NewDashboardRepository(db *sql.DB) DashboardRepository {
	return &DashboardRepositoryImpl{db: db}
}

func (c *DashboardRepositoryImpl) GetGeneralNumber() (schema.GeneralNumberResponse, error) {
	var generalNumber schema.GeneralNumberResponse

	err := c.db.QueryRow(`SELECT COUNT(*) FROM drivers`).Scan(&generalNumber.TotalDriver)
	if err != nil {
		return generalNumber, err
	}
	err = c.db.QueryRow(`SELECT COUNT(*) FROM customers`).Scan(&generalNumber.TotalCustomer)

	if err != nil {
		return generalNumber, err
	}

	err = c.db.QueryRow(`SELECT COUNT(*) FROM booking`).Scan(&generalNumber.TotalBooking)

	if err != nil {
		return generalNumber, err
	}

	err = c.db.QueryRow(`SELECT COUNT(*) FROM phone_booking`).Scan(&generalNumber.TotalPhone)

	if err != nil {
		return generalNumber, err
	}

	// Get total driver created today
	err = c.db.QueryRow(`SELECT COUNT(*) FROM drivers WHERE created_at >= CURRENT_DATE`).Scan(&generalNumber.NewDriver)
	if err != nil {
		return generalNumber, err
	}

	// Get total customer created today
	err = c.db.QueryRow(`SELECT COUNT(*) FROM customers WHERE created_at >= CURRENT_DATE`).Scan(&generalNumber.NewCustomer)

	if err != nil {
		return generalNumber, err
	}

	// Get total booking created today

	err = c.db.QueryRow(`SELECT COUNT(*) FROM booking WHERE created_at >= CURRENT_DATE`).Scan(&generalNumber.NewBooking)

	if err != nil {
		return generalNumber, err
	}

	// Get total phone booking created today

	err = c.db.QueryRow(`SELECT COUNT(*) FROM phone_booking WHERE created_at >= CURRENT_DATE`).Scan(&generalNumber.NewPhone)

	if err != nil {
		return generalNumber, err
	}

	// Get total driver created this month

	err = c.db.QueryRow(`SELECT COUNT(*) FROM drivers WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'`).Scan(&generalNumber.MonthlyDriver)

	if err != nil {
		return generalNumber, err
	}

	// Get total customer created this month

	err = c.db.QueryRow(`SELECT COUNT(*) FROM customers WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'`).Scan(&generalNumber.MonthlyCustomer)

	if err != nil {
		return generalNumber, err
	}

	// Get total booking created this month

	err = c.db.QueryRow(`SELECT COUNT(*) FROM booking WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'`).Scan(&generalNumber.MonthlyBooking)

	if err != nil {
		return generalNumber, err
	}

	// Get total phone booking created this month

	err = c.db.QueryRow(`SELECT COUNT(*) FROM phone_booking WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'`).Scan(&generalNumber.MonthlyPhone)

	if err != nil {
		return generalNumber, err
	}

	return generalNumber, nil
}
