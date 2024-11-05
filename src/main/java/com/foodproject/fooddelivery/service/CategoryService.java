package com.foodproject.fooddelivery.service;

import com.foodproject.fooddelivery.dto.CategoryDTO;
import com.foodproject.fooddelivery.dto.ProductDTO;
import com.foodproject.fooddelivery.entity.Category;
import com.foodproject.fooddelivery.entity.Product;
import com.foodproject.fooddelivery.mapper.ProductMapper;
import com.foodproject.fooddelivery.repository.CategoryRepository;
import com.foodproject.fooddelivery.repository.ProductRepository;
import com.foodproject.fooddelivery.service.imp.CategoryServiceImp;
import com.foodproject.fooddelivery.service.imp.FileServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;


@Service
public class CategoryService implements CategoryServiceImp {

    @Autowired
    CategoryRepository categoryRepository;
    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<CategoryDTO> getAllCategories() {
        List<Category> listCategory = categoryRepository.findAll();
        List<CategoryDTO> listCate=new ArrayList<>();
        for(Category category : listCategory){
            CategoryDTO categoryDTO=new CategoryDTO();
            categoryDTO.setId(category.getId());
            categoryDTO.setName(category.getNameCate());
            List<ProductDTO> productDTOList= ProductMapper.toProductDTOList(category.getListProduct());
            categoryDTO.setProducts(productDTOList);
            listCate.add(categoryDTO);
        }
        return listCate;
    }

    @Override
    public CategoryDTO getCategoryById(int id,int page) {
        Category category=categoryRepository.findById(id);
        CategoryDTO categoryDTO=new CategoryDTO();
        categoryDTO.setId(category.getId());
        categoryDTO.setName(category.getNameCate());
        Pageable pageable = PageRequest.of(page,12);
        Page<Product> productPage = productRepository.findByCategoryId(id,pageable);
        List<ProductDTO> productDTOList= ProductMapper.toProductDTOList(productPage.getContent());
        categoryDTO.setProducts(productDTOList);
        categoryDTO.setTotalPages(productPage.getTotalPages());
        categoryDTO.setTotalItems(productPage.getTotalElements());
        return categoryDTO;
    }
}
