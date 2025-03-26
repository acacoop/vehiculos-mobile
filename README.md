# Mobile FrontEnd Vehículos

FrontEnd Mobile para aplicación de gestión interna de la flota.

## Features

- Log with Microsoft Corporate Account
- List assigned vehicles
- Access to vehicle details
- Access to vehicle maintenance history
- Manage vehicle reservations
- Customize user profile

## Technologies

- **[React Native](https://reactnative.dev/)**: JavaScript framework for building native mobile applications. For the mobile version of the application.
- **[Expo](https://expo.dev/)**: Framework and platform for universal React applications. It is used to build the mobile application.

## Prerequisites

- **[Node.js](https://nodejs.org/)**: JavaScript runtime built on Chrome's V8 JavaScript engine.
- **[Expo CLI](https://docs.expo.dev/workflow/expo-cli/)**: Command line interface for Expo.
- **[Expo Go](https://expo.dev/client)**: Mobile application to run the Expo projects on a physical device.
- **[Backend Running](https://github.com/acacoop/vehiculos-backend)**: Backend application running to connect with the mobile application.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/acacoop/vehiculos-mobile.git
   cd vehiculos-mobile
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up the environment variables:

   Create a `.env` file in the root directory of the project with the following content:

   ```env
   EXPO_PUBLIC_API_URL=http://url-to-the-backend-api
   EXPO_PUBLIC_PORT=8081
   ```

   Replace the `http://url-to-the-backend-api` with the URL of the backend application.
   The .env files are loaded automatically by `expo` according to the [Standard .env file resolution](https://github.com/bkeepers/dotenv/blob/c6e583a/README.md#what-other-env-files-can-i-use).

## Development

To start the development server, run the following command:

```bash
npx expo start
```

This will open the Expo Developer Tools in the browser. You can run the application on an emulator, a physical device, or the Expo Go application.

If you want to create a tunnel to access the application from a physical device, run the following command:

```bash
npx expo start --host tunnel
```

## Production

TBD

## Project Structure

The project structure is as follows:

```plaintext
vehiculos-mobile/
├── app/                   # Application screens routable with React Router
│   ├── vehicles/          # Vehicles screens
│       ├── [id].js        # Vehicle details screen
│       ├── all.js         # Vehicles list screen
│   ├── .../               # Other screens grouped by feature
│   ├── _layouts.js        # Layout components, it wraps the application screens
│   ├── index.js           # Application routes
│   ├── calendar.js        # Calendar screen
│   └── ...                # Other application screens
├── assets/                # Local assets like images, fonts, etc.
│   ├── logo.png           # Application logo
│   └── ...                # Other assets
├── components/            # Reusable components used in the application
│   ├── Button.js          # Button component
│   ├── Card.js            # Card component
│   └── ...                # Other components
├── interfaces/            # TypeScript interfaces used in the application
│   ├── vehicle.ts         # Vehicle interface
│   └── ...                # Other interfaces
├── services/              # Services to interact with the backend
│   ├── vehicleService.ts  # Vehicle service
│   └── ...                # Other services
├── .env                   # Environment variables
├── .eslintrc.js           # ESLint configuration file
├── .gitignore             # Git ignore file
├── .app.json              # Expo configuration file
├── package-lock.json      # NPM package lock file
├── package.json           # NPM package file
├── tsconfig.json          # TypeScript configuration file
├── README.md              # Project README file
```
