$(document).ready(function () {
  function closeModal() {
    $(".modal").removeClass("open");
    $("body").css("overflow", "auto");
  }

  $("#login-button").on("click", function (event) {
    event.preventDefault();
    let phonelog = $("#phone-login").val();
    let passlog = $("#password-login").val();
    if (phonelog.length == 0) {
      $(".form-message.phonelog").text("Vui lòng nhập vào số điện thoại");
    } else if (phonelog.length != 10) {
      $(".form-message.phonelog").text("Vui lòng nhập vào số điện thoại 10 số");
      $("#phone-login").val("");
    } else {
      $(".form-message.phonelog").text("");
    }

    if (passlog.length == 0) {
      $(".form-message-check-login").text("Vui lòng nhập mật khẩu");
    } else if (passlog.length < 6) {
      $(".form-message-check-login").text(
        "Vui lòng nhập mật khẩu lớn hơn 6 kí tự"
      );
      $("#passwordlogin").val("");
    } else {
      $(".form-message-check-login").text("");
    }

    if (phonelog && passlog) {
      $.ajax({
        method: "POST",
        url: "http://localhost:8080/login/signin",
        data: {
          userName: phonelog,
          password: passlog,
        },
        contentType: "application/x-www-form-urlencoded",
        success: function (response) {
          if (response.success) {
            localStorage.setItem("token", response.data.token);
            if (response.data.user.status == 0) {
              toast({
                title: "Warning",
                message: "Tài khoản của bạn đã bị khóa",
                type: "warning",
                duration: 3000,
              });
            } else {
              localStorage.setItem(
                "currentuser",
                JSON.stringify(response.data.user)
              );
              fetchUserInfo();
              toast({
                title: "Success",
                message: "Đăng nhập thành công",
                type: "success",
                duration: 3000,
              });
              closeModal();
              kiemtradangnhap();
              checkAdmin();
              updateAmount();
            }
          } else {
            toast({
              title: "Warning",
              message: "Sai mật khẩu",
              type: "warning",
              duration: 3000,
            });
          }
        },
        error: function (error) {
          console.error("Error during login:", error);
          toast({
            title: "Warning",
            message: "Sai mật khẩu",
            type: "warning",
            duration: 3000,
          });
        },
      });
    }
  });

  // Hàm để lấy thông tin người dùng từ backend sau khi đăng nhập thành công
  function fetchUserInfo() {
    let token = localStorage.getItem("token");
    $.ajax({
      method: "GET",
      url: "http://localhost:8080/user/me",
      headers: {
        Authorization: "Bearer " + token,
      },
      success: function (response) {
        localStorage.setItem("currentuser", JSON.stringify(response));
      },
      error: function (error) {
        console.error("Error fetching user info:", error);
      },
    });
  }

  function kiemtradangnhap() {
    let currentUser = localStorage.getItem("currentuser");
    if (currentUser != null) {
      let user = JSON.parse(currentUser);
      document.querySelector(
        ".auth-container"
      ).innerHTML = `<span class="text-dndk">Tài khoản</span>
            <span class="text-tk">${user.fullName} <i class="fa-sharp fa-solid fa-caret-down"></span>`;
      document.querySelector(
        ".header-middle-right-menu"
      ).innerHTML = `<li><a href="javascript:;" onclick="myAccount()"><i class="fa-light fa-circle-user"></i> Tài khoản của tôi</a></li>
            <li><a href="javascript:;" onclick="orderHistory()"><i class="fa-regular fa-bags-shopping"></i> Đơn hàng đã mua</a></li>
            <li class="border"><a id="logout" href="javascript:;"><i class="fa-light fa-right-from-bracket"></i> Thoát tài khoản</a></li>`;
      document.querySelector("#logout").addEventListener("click", logOut);
    }
  }

  function logOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("currentuser");
    window.location = "/index";
  }

  function checkAdmin() {
    let user = JSON.parse(localStorage.getItem("currentuser"));
    if (user && user.roleId == 1) {
      let node = document.createElement(`li`);
      node.innerHTML = `<a href="/admin"><i class="fa-light fa-gear"></i> Quản lý cửa hàng</a>`;
      document.querySelector(".header-middle-right-menu").prepend(node);
    }
  }

  kiemtradangnhap();
  checkAdmin();
});
