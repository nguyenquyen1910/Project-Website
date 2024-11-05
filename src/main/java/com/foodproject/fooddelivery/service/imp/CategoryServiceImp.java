package com.foodproject.fooddelivery.service.imp;


import com.foodproject.fooddelivery.dto.CategoryDTO;
import com.foodproject.fooddelivery.dto.ProductDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CategoryServiceImp {
    List<CategoryDTO> getAllCategories();
    CategoryDTO getCategoryById(int id,int page);
}
