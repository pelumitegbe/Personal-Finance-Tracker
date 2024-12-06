# Build stage
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o financeTracker ./backend/main.go

# Final stage
FROM alpine:latest

WORKDIR /root/

# Copy the binary from builder
COPY --from=builder /app/financeTracker .
COPY --from=builder /app/.env .

# Expose port
EXPOSE 8080

# Command to run
CMD ["./financeTracker"]
