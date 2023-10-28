package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/minhthao56/monorepo-taxi/libs/go/schema"
	"github.com/swaggest/jsonschema-go"
)

func main() {
	reflector := jsonschema.Reflector{}
	for fileName, entityType := range schema.GetUserSchema() {
		schema, err := reflector.Reflect(entityType)
		if err != nil {
			log.Printf("Error generating JSON schema for entity: %v", err)
			continue
		}

		j, err := json.MarshalIndent(schema, "", " ")
		if err != nil {
			log.Printf("Error marshaling JSON schema: %v", err)
			continue
		}
		filePath := fmt.Sprintf("%s.json", fileName)
		err = saveToFile("json/authmgmt/"+filePath, j)
		if err != nil {
			log.Printf("Error saving JSON schema to file %s: %v", filePath, err)
			continue // Skip to the next entity
		}

		fmt.Printf("JSON schema for entity %s saved to %s\n", fileName, filePath)
	}

	// Booking
	for fileName, entityType := range schema.GetBookingSchema() {
		schema, err := reflector.Reflect(entityType)
		if err != nil {
			log.Printf("Error generating JSON schema for entity: %v", err)
			continue
		}

		j, err := json.MarshalIndent(schema, "", " ")
		if err != nil {
			log.Printf("Error marshaling JSON schema: %v", err)
			continue
		}
		filePath := fmt.Sprintf("%s.json", fileName)
		err = saveToFile("json/booking/"+filePath, j)
		if err != nil {
			log.Printf("Error saving JSON schema to file %s: %v", filePath, err)
			continue // Skip to the next entity
		}

		fmt.Printf("JSON schema for entity %s saved to %s\n", fileName, filePath)
	}
}

func saveToFile(filePath string, data []byte) error {
	file, err := os.Create(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	_, err = file.Write(data)
	if err != nil {
		return err
	}

	return nil
}
