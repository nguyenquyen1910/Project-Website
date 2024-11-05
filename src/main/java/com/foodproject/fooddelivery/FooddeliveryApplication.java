package com.foodproject.fooddelivery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
public class FooddeliveryApplication {

	public static void main(String[] args) {
		SpringApplication.run(FooddeliveryApplication.class, args);
	}

}
