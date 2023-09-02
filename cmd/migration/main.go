package main

import (
	"os"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/lib/pq"
	"github.com/minhthao56/monorepo-taxi/libs/go/database"
)

const migrationsPath = "file://migrations"

func main() {
	db := database.GetDatabaseInstance()
	conn := db.GetConnection()
	defer conn.Close()

	dbNamePG := os.Getenv("DB_NAME")
	driver, err := postgres.WithInstance(conn, &postgres.Config{})
	if err != nil {
		println("postgres.WithInstance: ", err)
		panic(err)
	}
	m, err := migrate.NewWithDatabaseInstance(migrationsPath, dbNamePG, driver)
	if err != nil {
		println("NewWithDatabaseInstance: ", err)
		panic(err)
	}
	err = m.Up()
	if err != nil {
		println("Error when migrating database: ", err)
		panic(err)
	}
	println("Migrated database successfully")
}
