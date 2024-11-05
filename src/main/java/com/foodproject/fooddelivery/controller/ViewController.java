package com.foodproject.fooddelivery.controller;

import ch.qos.logback.core.model.Model;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping({"", "/", "/index"})
    public String showHome() {
        return "index";
    }

    @GetMapping("/admin")
    public String showAdmin() {
        return "admin";
    }
}
