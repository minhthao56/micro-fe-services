package database

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/lib/pq"
)

const (
	host     = "db"
	port     = 5432
	user     = "postgres"
	password = "119955"
	dbname   = "taxi-db"
)

func Init() *sql.DB {
	passwordPG := os.Getenv("POSTGRES_PASSWORD")
	userPG := os.Getenv("POSTGRES_USER")
	hostPG := os.Getenv("DB_URL")
	dbNamePG := os.Getenv("DB_NAME")

	if passwordPG == "" || userPG == "" || hostPG == "" || dbNamePG == "" {
		passwordPG = password
		userPG = user
		hostPG = host
		dbNamePG = dbname
	}

	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		hostPG, port, userPG, passwordPG, dbNamePG)

	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		panic(err)
	}

	err = db.Ping()
	if err != nil {
		panic(err)
	}

	fmt.Println("Successfully connected!")

	return db
}
