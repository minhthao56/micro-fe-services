# System Booking
## Install dependencies
### Backend
- Node.js: https://nodejs.org/en/
- Yarn: https://yarnpkg.com/en/docs/install
- Golang: https://golang.org/doc/install
- Rust: https://www.rust-lang.org/en-US/install.html
- Kubectl: https://kubernetes.io/docs/tasks/tools/install-kubectl/
- Minikube: https://kubernetes.io/docs/tasks/tools/install-minikube/
- Docker: https://docs.docker.com/install/

### Frontend - Mobile
- Expo Go: https://docs.expo.dev/get-started/expo-go/
- Node.js: https://nodejs.org/en/

## Environment variables
### Customer app and Driver app
- `EXPO_PUBLIC_GOOGLE_API_KEY`=your_google_api_key
- `EXPO_PUBLIC_BASE_URL`=http://api.cheap-taxi.me/
- `EXPO_PUBLIC_GOONG_KEY`=your_goong_key

### Call center web app
- `REACT_APP_BASE_URL`=http://api.cheap-taxi.me/
- `REACT_APP_TWILIO_ACCOUNT_SID`=your_twilio_account_sid
- `REACT_APP_TWILIO_AUTH_TOKEN`=your_twilio_auth_token
- `REACT_APP_TWILIO_BASE_URL`=http://api.cheap-taxi.me/
- `REACT_APP_GOONG_ACCESS_TOKEN`=your_goong_access_token
- `REACT_APP_PUBLIC_GOOGLE_API_KEY`=your_google_api_key

## Setup (Only support for Linux and MacOS)
### Backend
1. Run `yarn install` in project root directory
2. Run `./scripts/start_local.bash` in project root directory to start local development environment
3. Run `kubectl get pods` to check if all pods are running
4. Run `./scripts/expose_port.bash` to expose port to localhost

### Frontend - Mobile
1. Run `yarn install` in project root directory
2. Run `yarn start:c` to start customer app
3. Run `yarn start:d` to start driver app
4. Run `make start-frontend` to start call center web app
