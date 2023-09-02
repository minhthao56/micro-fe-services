package database

import (
	"database/sql"
	"errors"
	"fmt"
	"os"
	"sync"
	"time"

	_ "github.com/lib/pq"
)

const (
	host     = "db"
	port     = 5432
	user     = "postgres"
	password = "119955"
	dbname   = "taxi-db"
)

type SQLDatabase interface {
	GetConnection() *sql.DB
	CloseConnection() error
}

type Database struct {
	Connection *sql.DB
}

var (
	once     sync.Once
	instance *Database
)

func GetDatabaseInstance() SQLDatabase {
	once.Do(func() {
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

		// Set connection pool settings
		db.SetMaxOpenConns(100)
		db.SetMaxIdleConns(5)
		db.SetConnMaxLifetime(30 * time.Minute)

		instance = &Database{Connection: db}
		fmt.Println("Successfully connected!")
	})

	return instance
}

func (db *Database) GetConnection() *sql.DB {
	return db.Connection
}

func (db *Database) CloseConnection() error {
	if db.Connection == nil {
		return errors.New("Cannot close the connection because the connection is nil")
	}
	return db.Connection.Close()
}
