package repository

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/minhthao56/monorepo-taxi/libs/go/schema"
)

func GetGeocodeGoong(lat string, long string) (schema.GeocodeGoongResponse, error) {
	geocodeGoongResponse := schema.GeocodeGoongResponse{}

	requestURL := fmt.Sprintf("https://rsapi.goong.io/Geocode?latlng=%s,%s&api_key=%s", lat, long, "rdKOo9UELt1uGyOKYwvPd1ZhD8fAs81GLa1ua8d4")
	res, err := http.Get(requestURL)

	if err != nil {
		return geocodeGoongResponse, err
	}

	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)

	if err != nil {
		return geocodeGoongResponse, err
	}

	err = json.Unmarshal(body, &geocodeGoongResponse)

	if err != nil {
		return geocodeGoongResponse, err
	}

	return geocodeGoongResponse, nil
}
