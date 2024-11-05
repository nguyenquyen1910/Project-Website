package com.foodproject.fooddelivery.mapper;

import com.foodproject.fooddelivery.dto.ProductDTO;
import com.foodproject.fooddelivery.entity.Product;

import java.util.ArrayList;
import java.util.List;

public class ProductMapper {
    public static ProductDTO toProductDTO(Product product) {
        ProductDTO productDTO = new ProductDTO();
        productDTO.setId(product.getId());
        productDTO.setTitle(product.getTitle());
        productDTO.setDescription(product.getDescription());
        productDTO.setImage(product.getImage());
        productDTO.setStatus(product.getStatus());
        productDTO.setPrice(product.getPrice());
        productDTO.setCategoryName(product.getCategory().getNameCate());
        return productDTO;
    }
    public static List<ProductDTO> toProductDTOList(List<Product> products) {
        List<ProductDTO> productDTOList = new ArrayList<>();
        for(Product product : products) {
            productDTOList.add(toProductDTO(product));
        }
        return productDTOList;
    }
}
