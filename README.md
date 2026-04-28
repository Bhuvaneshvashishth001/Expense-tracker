# SpendWise Backend

Spring Boot + MongoDB backend for the SpendWise frontend.

## Requirements

- Java 17
- Maven 3.9+
- MongoDB running locally or a remote MongoDB URI

## Environment

You can override these values with environment variables:

- `MONGODB_URI` default: `mongodb://localhost:27017/spendwise`
- `JWT_SECRET` default: `change-this-secret-key-change-this-secret-key`
- `JWT_EXPIRATION_MS` default: `604800000`
- `CORS_ALLOWED_ORIGINS` default: `http://localhost:3000,http://localhost:5173`

## Run

```bash
cd backend
mvn spring-boot:run
```

The API starts on `http://localhost:8080`.

## Main Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/transactions`
- `POST /api/transactions`
- `PUT /api/transactions/{id}`
- `DELETE /api/transactions/{id}`
- `GET /api/profile`
- `PUT /api/profile`
- `GET /api/profile/notifications`
- `PUT /api/profile/notifications`
- `GET /api/analytics/summary`


<!-- "hello world" -->

<!-- "hello dunia" -->