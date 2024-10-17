package tokens

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

type SignedDetails struct {
	Token_Type string
	Email      string
	First_Name string
	Last_Name  string
	Username   string
	Uid        string
	Role       string
	jwt.RegisteredClaims
}

var SECRET_KEY string = os.Getenv("SECRET_KEY")

func generateClaims(
	email, first_name, last_name, username, uid, role, token string,
) *SignedDetails {
	var expiring_time time.Time
	switch token {
	case "access":
		expiring_time = time.Now().Local().Add(time.Minute * 30)
	case "refresh":
		expiring_time = time.Now().Local().Add(time.Hour * 24)
	default:
		expiring_time = time.Now().Local().Add(time.Hour)
	}

	return &SignedDetails{
		Token_Type: token,
		Email:      email,
		Username:   username,
		First_Name: first_name,
		Last_Name:  last_name,
		Uid:        uid,
		Role:       role,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   username,
			Issuer:    "finance-tracker",
			ExpiresAt: jwt.NewNumericDate(expiring_time),
		},
	}
}

// function that generates access token
func GenerateAccessToken(email, first_name, last_name, username, uid, role string) (string, error) {
	claims := generateClaims(email, first_name, last_name, username, uid, role, "access")
	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(SECRET_KEY))
	if err != nil {
		return "", err
	}
	return token, nil
}

// function that generates refresh token
func GenerateRefreshToken(
	email, first_name, last_name, username, uid, role string,
) (string, error) {
	claims := generateClaims(email, first_name, last_name, username, uid, role, "refresh")
	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(SECRET_KEY))
	if err != nil {
		return "", err
	}
	return token, nil
}

// function that generates both the access and refresh token at the same time
func TokenGenerator(
	email, first_name, last_name, username, uid, role string,
) (string, string, error) {
	token, err := GenerateAccessToken(email, first_name, last_name, username, uid, role)
	if err != nil {
		return "", "", err
	}

	refreshToken, err := GenerateRefreshToken(email, first_name, last_name, username, uid, role)
	if err != nil {
		return "", "", err
	}

	return token, refreshToken, nil
}

// function that helps to retrieve claims from token
func GetClaims(signedToken string) (claims *SignedDetails, msg string) {
	token, err := jwt.ParseWithClaims(
		signedToken,
		&SignedDetails{},
		func(t *jwt.Token) (interface{}, error) {
			return []byte(SECRET_KEY), nil
		},
	)
	if err != nil {
		msg = err.Error()
		return nil, msg
	}

	claims, ok := token.Claims.(*SignedDetails)
	if !ok {
		msg = "the token is invalid"
		return nil, msg
	}
	return claims, ""
}

// function to validate access and refresh tokens
func ValidateToken(signedToken string) (claims *SignedDetails, msg string) {
	claims, msg = GetClaims(signedToken)
	if msg != "" {
		return nil, msg
	}

	// check if token is expired or not
	expAt := claims.ExpiresAt
	if expAt != nil && expAt.Before(time.Now().Local()) {
		msg = "token is already expired"
		return nil, msg
	}

	return claims, ""
}
