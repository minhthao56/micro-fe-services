package main

import (
	"fmt"

	_ "github.com/minthao56/setup-microservices/cmd/services/notimgmt"
	_ "github.com/minthao56/setup-microservices/cmd/services/usermgmt"
)

func main() {
	fmt.Println("Hello, World!")
}
