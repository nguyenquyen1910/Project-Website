package com.foodproject.fooddelivery.repository;

import com.foodproject.fooddelivery.entity.Product;
import com.foodproject.fooddelivery.service.ProductService;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    @Query(value = "SELECT * FROM product p WHERE "
            + "(?1 IS NULL OR p.category_id = ?1) AND "
            + "(?2 IS NULL OR p.title LIKE %?2%) AND "
            + "(p.price BETWEEN ?3 AND ?4)", nativeQuery = true)
    Page<Product> findByCategoryIdAndTitleContainingAndPriceBetween(Integer categoryId,
                                                                    String title,
                                                                    Integer priceFrom,
                                                                    Integer priceTo,
                                                                    Pageable pageable);
    Product findById(int id);
    Page<Product> findByCategoryId(int categoryId, Pageable pageable);

    @Query(value = "SELECT * FROM product p WHERE "
            + "(?1 IS NULL OR p.category_id = ?1) AND "
            + "(?2 IS NULL OR p.title LIKE %?2%) AND "
            + "p.status = ?3", nativeQuery = true)
    Page<Product> findByCategoryIdAndTitleContainingAndStatus(Integer categoryId, String title, Integer status, Pageable pageable);
    @Modifying
    @Transactional
    @Query(value = "UPDATE product SET status = 0 WHERE id = :id", nativeQuery = true)
    void updateProductStatusToDeleted(@Param("id") int id);
    @Modifying
    @Transactional
    @Query(value = "UPDATE product SET status = 1 WHERE id = :id", nativeQuery = true)
    void cancelDeletedProduct(@Param("id") int id);
}
