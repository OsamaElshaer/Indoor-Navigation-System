# 🛰️ Indoor Navigation System

## Overview

An **indoor positioning system** that determines a user's location using **trilateration** with **RSSI values from beacons**. The system allows **organizations** to upload maps in **GeoJSON format** and associate them with **access points** for accurate indoor navigation.

## Features

1. **Authentication & User Management**
2. **Trilateration-based Indoor Positioning** using **RSSI values from beacons**
3. **GeoJSON Map Representation** for **storing and visualizing floor plans**
4. **Multi-Organization Support** for managing maps & access points
5. **Swagger API Documentation** for testing and exploring endpoints
6. **Docker Compose Support** for easy deployment

## Tech Stack

-   **Backend:** Node.js (Express.js)
-   **Database:** MongoDB (Containerized)
-   **Caching:** Redis
-   **Logging:** Winston
-   **Containerization:** Docker & Docker Compose
-   **Send Mails:** sendgrid
-   **CI/CD:** CircleCI
-   **Testing:** Jest
-   **API Documentation:** Swagger

## API Documentation

🔗 **Swagger UI**: [http://localhost:4000/api-docs](http://localhost:4000/api-docs)

## Installation & Setup

### Prerequisites

-   **Docker & Docker Compose**
-   **Node.js & npm**

### Steps

1️. **Clone the repository**

```sh
git clone https://github.com/OsamaElshaer/indoor-navigation-system.git
```

2️. **Navigate to the project directory**

```sh
cd indoor-navigation-system
```

3️. **Configure environment variables** (see below).

4️. **Start the application**

```sh
docker-compose up -d
```

---

## 🌍 Environment Variables

Create a `.env` file in the root directory and add the following variables:

```ini
# Server Configuration
PORT=4000  # The port the application runs on
WHITE_LIST="*"  # Allowed origins for CORS

# Email Configuration
EMAIL="your-email@example.com"  # System admin email
SENDGRID_API_KEY="your-sendgrid-api-key"  # SendGrid API key for email sending
MAILTRAP_USER="your-mailtrap-username"  # Mailtrap sandbox username
MAILTRAP_PASS="your-mailtrap-password"  # Mailtrap sandbox password

# Database Configuration
DB_HOST="mongodb://your-mongodb-host:27017"  # MongoDB connection string
REDIS_HOST="redis://your-redis-host:6379"  # Redis connection string

# Security & Authentication
JWT_SECRET_KEY="your-secret-key"  # Secret key for JWT authentication

# Application Settings
NODE_ENV="development"  # Application environment (development/production)

# Indoor Positioning Constants
CONSTANTS_INDOOR_ENVIROMENT='{"REFERENCE_DISTANCE":1.5, "PATH_LOSS_EXPONENT":2, "VARIANCE":3}'
# Environmental constants used for trilateration calculations

REFERENCE_RSSI='{"AP1":-45,"AP2":-48,"AP3":-50}'
# RSSI reference values for access points

COORDINATES_OF_AP='{ "AP1": { "x": 2, "y": 3, "z":20 }, "AP2": { "x": 15, "y": 9, "z":20 }, "AP3": { "x": 11, "y": 15, "z":20 } }'
# Physical coordinates of access points in a 3D space

SERVER_URL="https://your-server-url.com/keep-alive"
# The public URL of the server
```

---

## License

This project is licensed under **MIT**.
