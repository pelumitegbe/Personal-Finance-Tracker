package tokens

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

type SignedDetails struct {
	Email      string
	First_Name string
	Last_Name  string
	Username   string
	Uid        string
	Role       string
	jwt.RegisteredClaims
}

var SECRET_KEY string = os.Getenv("SECRET_KEY")

func TokenGenerator(
	email, first_name, last_name, username, uid, role string,
) (string, string, error) {
	claims := &SignedDetails{
		Email:      email,
		First_Name: first_name,
		Last_Name:  last_name,
		Username:   username,
		Uid:        uid,
		Role:       role,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   username,
			Issuer:    "finance-tracker",
			ExpiresAt: jwt.NewNumericDate(time.Now().Local().Add(time.Hour * 2)),
		},
	}

	refreshClaims := &SignedDetails{
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Local().Add(time.Hour * 24)),
		},
	}

	fmt.Print(SECRET_KEY)
	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(SECRET_KEY))
	if err != nil {
		return "", "", err
	}

	refreshToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims).
		SignedString([]byte(SECRET_KEY))
	if err != nil {
		return "", "", err
	}

	return token, refreshToken, nil
}

func ValidateToken(signedToken string) (claims *SignedDetails, msg string) {
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

	// check if token is expired or not
	expAt := claims.ExpiresAt
	if expAt != nil && expAt.Before(time.Now().Local()) {
		msg = "token is already expired"
		return nil, msg
	}

	return claims, ""
}
