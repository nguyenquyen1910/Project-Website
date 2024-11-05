package com.foodproject.fooddelivery.controller;

import com.foodproject.fooddelivery.payload.ResponseData;
import com.foodproject.fooddelivery.payload.request.EditProductRequest;
import com.foodproject.fooddelivery.service.imp.FileServiceImp;
import com.foodproject.fooddelivery.service.imp.ProductServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin("*")
@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    FileServiceImp fileServiceImp;

    @Autowired
    ProductServiceImp productServiceImp;

    @PostMapping("/admin/create")
    public ResponseEntity<?> createProduct(
            @RequestParam MultipartFile file,
            @RequestParam String title,
            @RequestParam int categoryId,
            @RequestParam int price,
            @RequestParam String description
    ){
        ResponseData responseData = new ResponseData();
        Boolean isSuccess=productServiceImp.addProduct(file, title, categoryId, price, description);
        responseData.setSuccess(isSuccess);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getProduct(){
        ResponseData responseData = new ResponseData();
        responseData.setData(productServiceImp.getHomePageProducts());
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/homepage")
    public ResponseEntity<?> getHomePage(@RequestParam(defaultValue = "0") int page){
        ResponseData responseData = new ResponseData();
        responseData.setData(productServiceImp.pageProducts(page));
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/admin/file/{filename:.+}")
    public ResponseEntity<?> getFileProduct(@PathVariable String filename){
        Resource resource  = fileServiceImp.loadFile(filename);

        return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"").body(resource);
    }

    @GetMapping("/find")
    public ResponseEntity<?> getProductResult(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(value = "categoryId", required = false) Integer categoryId,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "priceFrom", required = false) Integer priceFrom,
            @RequestParam(value = "priceTo", required = false) Integer priceTo,
            @RequestParam(required = false, defaultValue = "asc") String sortDirection){
        ResponseData responseData = new ResponseData();
        responseData.setData(productServiceImp.getProductByCategoryIdAndNameAndPrice(categoryId, title, priceFrom, priceTo,sortDirection,page));
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/admin/find")
    public ResponseEntity<?> getProductbyAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(value = "categoryId", required = false) Integer categoryId,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "status") Integer status){
        ResponseData responseData = new ResponseData();
        responseData.setData(productServiceImp.getProductByCategoryIdAndTitleAndStatus(categoryId,title,status,page));
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/product")
    public ResponseEntity<?> getProductById(@RequestParam int id) {
        ResponseData responseData = new ResponseData();
        responseData.setData(productServiceImp.getProductById(id));
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping("/admin/edit")
    public ResponseEntity<?> editProduct(
            @RequestParam int productId,
            @RequestParam String title,
            @RequestParam(required = false) MultipartFile file,
            @RequestParam int categoryId,
            @RequestParam int price,
            @RequestParam String description,
            @RequestParam(required = false) String oldImage
    ){
        ResponseData responseData = new ResponseData();
        boolean isSuccess=productServiceImp.updateProduct(file, productId, title, categoryId, price, description,oldImage);
        responseData.setData(isSuccess);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable int id) {
        ResponseData responseData = new ResponseData();
        boolean isSuccess=productServiceImp.deleteProduct(id);
        responseData.setData(isSuccess);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PutMapping("/admin/restore/{id}")
    public ResponseEntity<?> restoreProduct(@PathVariable int id) {
        ResponseData responseData = new ResponseData();
        boolean isSuccess=productServiceImp.restoreProduct(id);
        responseData.setData(isSuccess);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}
