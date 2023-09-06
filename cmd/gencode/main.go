package main

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/swaggest/jsonschema-go"
)

type MyStruct struct {
	Amount float64  `json:"amount" minimum:"10.5" example:"20.6" required:"true"`
	Abc    string   `json:"abc" pattern:"[abc]"`
	_      struct{} `additionalProperties:"false"`                   // Tags of unnamed field are applied to parent schema.
	_      struct{} `title:"My Struct" description:"Holds my data."` // Multiple unnamed fields can be used.
}

func main() {
	reflector := jsonschema.Reflector{}
	schema, err := reflector.Reflect(MyStruct{})
	if err != nil {
		log.Fatal(err)
	}
	j, err := json.MarshalIndent(schema, "", " ")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(string(j))
}
