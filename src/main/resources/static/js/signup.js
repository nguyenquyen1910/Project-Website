$(document).ready(function() {

    showProvince();

    // Lấy trường tỉnh
    function getProvince() {
        return $.ajax({
            method: "GET",
            url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
            headers: {
                'token': 'b8262cb5-dfc9-11ee-a2c1-ca2feb4b63fa'
            },
        });
    }
    
    //Lấy trường huyện
    function getDistrict(provinceID) {
        return $.ajax({
            method: "GET",
            url: `https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceID}`,
            headers: {
                'token': 'b8262cb5-dfc9-11ee-a2c1-ca2feb4b63fa'
            },
        });
    }
    
    //Lấy trường phường
    function getWard(districtID) {
        return $.ajax({
            method: "GET",
            url: `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtID}`,
            headers: {
                'token': 'b8262cb5-dfc9-11ee-a2c1-ca2feb4b63fa'
            },
        });
    }
    
    function showProvince() {
        getProvince().done(function(response) {
            if (response.message === "Success") {
                let provinceHtml = '<option value="">Chọn Tỉnh/Thành phố</option>';
                $.each(response.data, function(index, value) {
                    provinceHtml += `<option value="${value.ProvinceID}">${value.ProvinceName}</option>`;
                });
                $("#province").html(provinceHtml);
            } else {
                console.log("Failed to load provinces");
            }
        });
    }
    
    function showDistrict(provinceID) {
        getDistrict(provinceID).done(function(response) {
            if (response.message === "Success") {
                let districtHtml = '<option value="">Chọn Quận/Huyện</option>';
                $.each(response.data, function(index, value) {
                    districtHtml += `<option value="${value.DistrictID}">${value.DistrictName}</option>`;
                });
                $("#district").html(districtHtml).prop("disabled", false);
                $("#ward").html('<option value="">Chọn Phường/Xã</option>').prop("disabled", true);
            } else {
                console.log("Failed to load districts");
            }
        });
    }
    
    function showWard(districtID) {
        getWard(districtID).done(function(response) {
            if (response.message === "Success") {
                let wardHtml = '<option value="">Chọn Phường/Xã</option>';
                $.each(response.data, function(index, value) {
                    wardHtml += `<option value="${value.WardID}">${value.WardName}</option>`;
                });
                $("#ward").html(wardHtml).prop("disabled", false);
            } else {
                console.log("Failed to load wards");
            }
        });
    }
    
    // Xử lý sự kiện thay đổi tỉnh
    $("#province").change(function() {
        let provinceID = $(this).val();
        if (provinceID) {
            showDistrict(provinceID);
        } else {
            $("#district").html('<option value="">Chọn Quận/Huyện</option>').prop("disabled", true);
            $("#ward").html('<option value="">Chọn Phường/Xã</option>').prop("disabled", true);
        }
    });
    
    // Xử lý sự kiện thay đổi quận/huyện
    $("#district").change(function() {
        let districtID = $(this).val();
        if (districtID) {
            showWard(districtID);
        } else {
            $("#ward").html('<option value="">Chọn Phường/Xã</option>').prop("disabled", true);
        }
    });
    
    function closeModal() {
        $('.modal').removeClass('open');
        console.log($('.modal'));
        $('body').css('overflow', 'auto');
    }
    $('#signup-button').on('click', function(event) {
        event.preventDefault();
        
        var fullNameUser = $('#fullname').val();
        var phoneUser = $('#phone').val();
        var emailUser=$('#email').val();
        var province=$('#province').val();
        var district=$('#district').val();
        var ward=$('#ward').val();
        var addressDetail = $('#address-detail').val();
        var passwordUser = $('#password').val();
        var passwordConfirmation = $('#password_confirmation').val();
        var checkSignup = $('#checkbox-signup').prop('checked');

        // Xóa thông báo cũ trước khi kiểm tra
        clearErrorMessages();

        // Kiểm tra từng trường
        let isValid = true;

        if (fullNameUser.length == 0) {
            showErrorMessage('.form-message-name', 'Vui lòng nhập họ và tên');
            $('#fullname').focus();
            isValid = false;
        } else if (fullNameUser.length < 3) {
            $('#fullname').val('');
            showErrorMessage('.form-message-name', 'Vui lòng nhập họ và tên lớn hơn 3 kí tự');
            isValid = false;
        }

        if (phoneUser.length == 0) {
            showErrorMessage('.form-message-phone', 'Vui lòng nhập vào số điện thoại');
            isValid = false;
        } else if (phoneUser.length != 10) {
            $('#phone').val('');
            showErrorMessage('.form-message-phone', 'Vui lòng nhập vào số điện thoại 10 số');
            isValid = false;
        }

        if(emailUser.length==0){
            showErrorMessage('.form-message-email', 'Vui lòng nhập vào địa chỉ email');
            isValid = false;
        }
        else if(!emailIsValid(emailUser)){
            $('#email').val('');
            showErrorMessage('.form-message-email', 'Vui lòng nhập vào địa chỉ email hợp lệ');
            isValid = false;
        }

        if(province===""){
            showErrorMessage('.form-message-province', 'Vui lòng chọn tỉnh/thành phố');
            isValid = false;
        }

        if(district===""){
            showErrorMessage('.form-message-district', 'Vui lòng chọn huyện/quận');
            isValid = false;
        }

        if(ward===""){
            showErrorMessage('.form-message-ward', 'Vui lòng chọn xã/phường');
            isValid = false;
        }

        if (addressDetail.length == 0) {
            showErrorMessage('.form-message-address-detail', 'Vui lòng nhập địa chỉ cụ thể');
            isValid = false;
        }

        if (passwordUser.length == 0) {
            showErrorMessage('.form-message-password', 'Vui lòng nhập mật khẩu');
            isValid = false;
        } else if (passwordUser.length < 6) {
            $('#password').val('');
            showErrorMessage('.form-message-password', 'Vui lòng nhập mật khẩu lớn hơn 6 kí tự');
            isValid = false;
        }

        if (passwordConfirmation.length == 0) {
            showErrorMessage('.form-message-password-confi', 'Vui lòng nhập lại mật khẩu');
            isValid = false;
        } else if (passwordConfirmation !== passwordUser) {
            $('#password_confirmation').val('');
            showErrorMessage('.form-message-password-confi', 'Mật khẩu không khớp');
            isValid = false;
        }

        if (!checkSignup) {
            showErrorMessage('.form-message-checkbox', 'Vui lòng check đăng ký');
            isValid = false;
        }

        // Nếu tất cả đều hợp lệ
        if (isValid) {
            let wardText = $('#ward option:selected').text();
            let districtText = $('#district option:selected').text();
            let provinceText = $('#province option:selected').text();

            let addressText = `${addressDetail}, ${wardText}, ${districtText}, ${provinceText}`;

            let user = {
                fullName: fullNameUser,
                phone: phoneUser,
                password: passwordUser,
                address: addressText,
                addressDetail: addressDetail,
                ward: wardText,
                district: districtText,
                province: provinceText,
                email: emailUser,
                status: 1,
                joinDate: new Date(),
                roleId: 2
            };

            $.ajax({
                url: 'http://localhost:8080/login/signup',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(user),
                success: function(response) {
                    if (response.success) {
                        localStorage.setItem('currentuser', JSON.stringify(response.data.user));
                        localStorage.setItem('token',response.data.token);
                        toast({ title: 'Thành công', message: 'Tạo thành công tài khoản !', type: 'success', duration: 3000 });
                        closeModal();
                        kiemtradangnhap();
                        updateAmount();
                    } else {
                        toast({ title: 'Thất bại', message: 'Tài khoản đã tồn tại !', type: 'error', duration: 3000 });
                    }
                },
                error: function() {
                    toast({ title: 'Lỗi', message: 'Đăng ký không thành công!', type: 'error', duration: 3000 });
                }
            });
        }
    });

    // Hàm xóa các thông báo lỗi cũ
    function clearErrorMessages() {
        $('.form-message-name').text('');
        $('.form-message-phone').text('');
        $('.form-message-password').text('');
        $('.form-message-password-confi').text('');
        $('.form-message-checkbox').text('');
    }

    // Hàm hiển thị lỗi cho từng trường
    function showErrorMessage(selector, message) {
        $(selector).text(message);
    }
    function kiemtradangnhap() {
        let currentUser = localStorage.getItem("currentuser");
        if (currentUser != null) {
          let user = JSON.parse(currentUser);
          $(".auth-container").html(`<span class="text-dndk">Tài khoản</span>
                            <span class="text-tk">${user.fullName} <i class="fa-sharp fa-solid fa-caret-down"></span>`);
          $(".header-middle-right-menu")
            .html(`<li><a href="javascript:;" onclick="myAccount()"><i class="fa-light fa-circle-user"></i> Tài khoản của tôi</a></li>
                            <li><a href="javascript:;" onclick="orderHistory()"><i class="fa-regular fa-bags-shopping"></i> Đơn hàng đã mua</a></li>
                            <li class="border"><a id="logout" href="javascript:;"><i class="fa-light fa-right-from-bracket"></i> Thoát tài khoản</a></li>`);
          $("#logout").on("click", logOut);
        }
    }
    function logOut() {
        // Xóa token và thông tin người dùng
        localStorage.removeItem("token");
        localStorage.removeItem("currentuser");
    
        // Chuyển hướng về trang chủ
        window.location = "/";
      }
});
function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}