package entity

import "github.com/jackc/pgtype"

type User struct {
	LocationID pgtype.Text
	Name       pgtype.Text
	UpdatedAt  pgtype.Timestamptz
	CreatedAt  pgtype.Timestamptz
	DeletedAt  pgtype.Timestamptz
}
