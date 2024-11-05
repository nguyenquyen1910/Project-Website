package com.foodproject.fooddelivery.service.imp;

import com.foodproject.fooddelivery.payload.ResponseData;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileServiceImp {
    boolean saveFile(MultipartFile file);
    Resource loadFile(String fileName);

    ResponseData uploadFileCloudinary(MultipartFile file);
}
