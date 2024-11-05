package com.foodproject.fooddelivery.controller;

import com.foodproject.fooddelivery.dto.ProductDTO;
import com.foodproject.fooddelivery.service.CategoryService;
import com.foodproject.fooddelivery.service.ProductService;
import com.foodproject.fooddelivery.service.imp.CategoryServiceImp;
import com.foodproject.fooddelivery.service.imp.ProductServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/category")
public class CategoryController {
    @Autowired
    CategoryServiceImp categoryServiceImp;

    @Autowired
    ProductServiceImp productServiceImp;


    @GetMapping("")
    public ResponseEntity<?> getAllCategories() {

        return new ResponseEntity<>(categoryServiceImp.getAllCategories(), HttpStatus.OK);
    }

    @GetMapping("/productincate")
    public ResponseEntity<?> getCategoryById(@RequestParam int id, @RequestParam(defaultValue = "0") int page) {

        return new ResponseEntity<>(categoryServiceImp.getCategoryById(id,page),HttpStatus.OK);
    }

}
