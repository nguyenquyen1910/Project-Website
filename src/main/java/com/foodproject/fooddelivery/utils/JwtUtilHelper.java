package com.foodproject.fooddelivery.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;

@Component
public class JwtUtilHelper {

    @Value("${jwt.privateKey}")
    private String privateKey;

    public String generateTokens(String username, List<String> roles) {
        Date expirationDate = new Date(System.currentTimeMillis() + 7 * 24 * 3600 * 1000);
        SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(privateKey));
        String jws = Jwts.builder()
                .subject(username)
                .expiration(expirationDate)
                .claim("roles", roles)
                .signWith(key)
                .compact();
        return jws;
    }

    public boolean verifyToken(String token) {
        boolean isVerify = false;
        try {
            SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(privateKey));
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            isVerify = true;
        } catch (Exception e) {
            isVerify = false;
        }
        return isVerify;
    }

    public List<String> extractRoles(String token) {
        SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(privateKey));
        Claims claims = Jwts.parser()
                .verifyWith(key).build().parseSignedClaims(token).getBody();
        return claims.get("roles", List.class);
    }

    public String extractUsername(String token) {
        SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(privateKey));
        @SuppressWarnings("deprecation")
        String username = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token).getBody().getSubject();
        return username;
    }

}
