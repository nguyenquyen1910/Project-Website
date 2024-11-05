package com.foodproject.fooddelivery.service.imp;

import com.foodproject.fooddelivery.dto.PageProductDTO;
import com.foodproject.fooddelivery.dto.ProductDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductServiceImp {
    boolean addProduct(MultipartFile file,
                       String title,
                       Integer categoryId,
                       Integer price,
                       String description);

    List<ProductDTO> getHomePageProducts();
    PageProductDTO pageProducts(int page);
    PageProductDTO getProductByCategoryIdAndNameAndPrice(Integer categoryId,
                                                           String title,
                                                           Integer priceFrom,
                                                           Integer priceTo,
                                                           String sortDirection,
                                                           int page);

    PageProductDTO getProductByCategoryIdAndTitleAndStatus(Integer categoryId, String title, Integer status,int page);

    ProductDTO getProductById(int id);
    boolean updateProduct(MultipartFile file,
                          int productId,
                          String title,
                          int categoryId,
                          Integer price,
                          String description,
                          String oldImage);
    boolean deleteProduct(int id);
    boolean restoreProduct(int id);
}
