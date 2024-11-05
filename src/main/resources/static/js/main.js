// Doi sang dinh dang tien VND
function vnd(price) {
  return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

//Close popup
$(document).ready(function () {
  // Click vùng ngoài sẽ tắt Popup
  $(".modal").on("click", closeModal);
  $(".mdl-cnt").on("click", function (event) {
    event.stopPropagation();
  });

  function closeModal() {
    $(".modal").removeClass("open");
    $("body").css("overflow", "auto");
  }

  // Tăng số lượng
  $(document).on("click", ".increase-btn", function () {
    let $qty = $(this).siblings(".input-qty");
    if (parseInt($qty.val()) < $qty.attr("max")) {
      $qty.val(parseInt($qty.val()) + 1);
    } else {
      $qty.val($qty.attr("max"));
    }
  });

  // Giảm số lượng
  $(document).on("click", ".decrease-btn", function () {
    let $qty = $(this).siblings(".input-qty");
    if (parseInt($qty.val()) > $qty.attr("min")) {
      $qty.val(parseInt($qty.val()) - 1);
    } else {
      $qty.val($qty.attr("min"));
    }
  });
});

function animationCart() {
  document.querySelector(".count-product-cart").style.animation =
    "slidein ease 1s";
  setTimeout(() => {
    document.querySelector(".count-product-cart").style.animation = "none";
  }, 1000);
}

// Them SP vao gio hang
async function addCart(index) {
  let currentuser = localStorage.getItem("currentuser")
    ? JSON.parse(localStorage.getItem("currentuser"))
    : [];
  let soluong = $(".input-qty").val();
  let popupDetailNote = $("#popup-detail-note").val();
  let note = popupDetailNote === "" ? "Không có ghi chú" : popupDetailNote;

  let productcart = {
    productId: index,
    quantity: parseInt(soluong),
    note: note,
  };

  try {
    let cartRequest = {
      userId: currentuser.id,
      listItems: [productcart],
      status: 1,
    };
    const response = await fetch(`http://localhost:8080/cart/insert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartRequest),
    });
    if (!response.ok) {
      throw new Error("Failed to add to cart");
    }

    updateAmount();

    closeModal();

    toast({
      title: "Success",
      message: "Thêm thành công sản phẩm vào giỏ hàng",
      type: "success",
      duration: 3000,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    toast({
      title: "Error",
      message: "Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng",
      type: "error",
      duration: 3000,
    });
  }
}

let body = document.querySelector("body");

//Show gio hang
var totalPrice;
async function showCart() {
  if (localStorage.getItem("currentuser") != null) {
    let currentuser = JSON.parse(localStorage.getItem("currentuser"));
    try {
      let response = await fetch(
        `http://localhost:8080/cart/get-cart/${currentuser.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        let cartItems = await response.json();
        totalPrice = cartItems.data.totalPrice;
        cartItems = cartItems.data.cartItems;

        if (cartItems.length != 0) {
          document.querySelector(".gio-hang-trong").style.display = "none";
          document
            .querySelector("button.thanh-toan")
            .classList.remove("disabled");
          let productcarthtml = "";
          cartItems.forEach((item) => {
            let note = item.note;
            if (note == null) {
              note = "Không có ghi chú";
            }
            productcarthtml += `<li class="cart-item" data-id="${item.id}">
                            <div class="cart-item-info">
                                <p class="cart-item-title">
                                    ${item.product.title}
                                </p>
                                <span class="cart-item-price price" data-price="${
                                  item.product.price
                                }">
                                    ${vnd(parseInt(item.product.price))}
                                </span>
                            </div>
                            <p class="product-note"><i class="fa-light fa-pencil"></i><span>${note}</span></p>
                            <div class="cart-item-control">
                                <button class="cart-item-delete" onclick="deleteCartItem(${
                                  item.id
                                }, this)">Xóa</button>
                                <div class="buttons_added">
                                    <input class="minus is-form" type="button" value="-" onclick="decreasingNumber(this)">
                                    <input class="input-qty" max="100" min="1" name="" type="number" value="${
                                      item.quantity
                                    }">
                                    <input class="plus is-form" type="button" value="+" onclick="increasingNumber(this)">
                                </div>
                            </div>
                        </li>`;
          });

          document.querySelector(".cart-list").innerHTML = productcarthtml;
          updateCartTotal();
          saveAmountCart();
        } else {
          document.querySelector(".gio-hang-trong").style.display = "flex";
        }
      } else {
        console.error("Failed to fetch cart items from backend");
        document.querySelector(".gio-hang-trong").innerHTML =
          "Không thể tải giỏ hàng";
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      document.querySelector(".gio-hang-trong").innerHTML =
        "Lỗi kết nối đến server";
    }
  }

  let modalCart = document.querySelector(".modal-cart");
  let containerCart = document.querySelector(".cart-container");
  let themmon = document.querySelector(".them-mon");

  modalCart.onclick = function () {
    closeCart();
  };
  themmon.onclick = function () {
    closeCart();
  };

  containerCart.addEventListener("click", (e) => {
    e.stopPropagation();
  });
}

// Delete cart item
function deleteCartItem(cartItemId, el) {
  let cartParent = el.parentNode.parentNode;
  let currentUser = JSON.parse(localStorage.getItem("currentuser"));
  let productPrice = parseInt(
    cartParent.querySelector(".cart-item-price").innerText.replace(/\D/g, "")
  );
  let quantity = cartParent.querySelector(".input-qty").value;
  fetch(`http://localhost:8080/cart/delete/${cartItemId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        cartParent.remove();
        let currentTotal = parseInt(
          document.querySelector(".text-price").innerText.replace(/\D/g, "")
        );
        let newTotal = currentTotal - productPrice * quantity;

        fetch(`http://localhost:8080/cart/get-cart/${currentUser.id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((cartResponse) => cartResponse.json())
          .then((cartItems) => {
            if (cartItems.length === 0) {
              document.querySelector(".gio-hang-trong").style.display = "flex";
              document
                .querySelector("button.thanh-toan")
                .classList.add("disabled");
            }
            document.querySelector(".text-price").innerText = vnd(newTotal);
            toast({
              title: "Success",
              message: "Xóa sản phẩm ra khỏi giỏ hàng thành công",
              type: "success",
              duration: 3000,
            });
          });
      } else {
        console.error("Failed to delete item from backend");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//Update cart total
function updateCartTotal() {
  let total = 0;
  document.querySelectorAll(".cart-item").forEach((item) => {
    let price = parseInt(
      item.querySelector(".cart-item-price").getAttribute("data-price")
    );
    let quantity = item.querySelector(".input-qty").value;
    total += price * quantity;
  });

  document.querySelector(".text-price").innerText = vnd(total);
}

function getCartTotal() {
  return totalPrice;
}
// Get Product
function getProduct(item) {
  let products = JSON.parse(localStorage.getItem("products"));
  let infoProductCart = products.find((sp) => item.id == sp.id);
  let product = {
    ...infoProductCart,
    ...item,
  };
  return product;
}

window.onload = updateAmount();
window.onload = updateCartTotal();

// Lay so luong hang
async function getAmountCart() {
  let amount = 0;
  let currentUser = JSON.parse(localStorage.getItem("currentuser"));
  if (!currentUser || !currentUser.id) {
    console.error("User is not logged in");
  }

  try {
    const response = await fetch(
      `http://localhost:8080/cart/get-cart/${currentUser.id}`
    );
    let result = await response.json();
    amount = result.data.cartItems.length;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
  return amount;
}
//Update Amount Cart
async function updateAmount() {
  if (localStorage.getItem("currentuser") != null) {
    try {
      let amount = await getAmountCart();
      document.querySelector(".count-product-cart").innerText = amount;
    } catch (error) {
      console.error("Error fetching cart amount:", error);
    }
  }
}

//Save Cart Info
function saveAmountCart() {
  let cartAmountbtn = document.querySelectorAll(".cart-item-control .is-form");
  let listProduct = document.querySelectorAll(".cart-item");
  let currentUser = JSON.parse(localStorage.getItem("currentuser"));

  cartAmountbtn.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      let cartItemElement = listProduct[parseInt(index / 2)];
      let cartItemId = cartItemElement.getAttribute("data-id");
      let quantity = parseInt(
        cartItemElement.querySelector(".input-qty").value
      );
      if (quantity >= 1) {
        fetch(`http://localhost:8080/cart/update/${cartItemId}/${quantity}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              updateCartTotal();
            } else {
              console.error("Cập nhật giỏ hàng thất bại:", data.message);
            }
          })
          .catch((error) => {
            console.error("Lỗi khi cập nhật giỏ hàng:", error);
          });
      }
    });
  });
}

//Open & Close Cart
function openCart() {
  showCart();
  document.querySelector(".modal-cart").classList.add("open");
  body.style.overflow = "hidden";
}

function closeCart() {
  document.querySelector(".modal-cart").classList.remove("open");
  body.style.overflow = "auto";
  updateAmount();
}
//Signup && Login Form
// Chuyen doi qua lai SignUp & Login
let signup = document.querySelector(".signup-link");
let login = document.querySelector(".login-link");
let container = document.querySelector(".signup-login .modal-container");
login.addEventListener("click", () => {
  container.classList.add("active");
});

signup.addEventListener("click", () => {
  container.classList.remove("active");
});

let signupbtn = document.getElementById("signup");
let loginbtn = document.getElementById("login");
let formsg = document.querySelector(".modal.signup-login");

signupbtn.addEventListener("click", () => {
  formsg.classList.add("open");
  container.classList.remove("active");
  body.style.overflow = "hidden";
});

loginbtn.addEventListener("click", () => {
  document.querySelector(".form-message-check-login").innerHTML = "";
  formsg.classList.add("open");
  container.classList.add("active");
  body.style.overflow = "hidden";
});

// // Kiểm tra xem có tài khoản đăng nhập không ?
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
  let accounts = JSON.parse(localStorage.getItem("accounts"));
  user = JSON.parse(localStorage.getItem("currentuser"));
  let vitri = accounts.findIndex((item) => item.phone == user.phone);
  accounts[vitri].cart.length = 0;
  for (let i = 0; i < user.cart.length; i++) {
    accounts[vitri].cart[i] = user.cart[i];
  }
  localStorage.setItem("accounts", JSON.stringify(accounts));
  localStorage.removeItem("currentuser");
  window.location = "/";
}

// Chuyển đổi trang chủ và trang thông tin tài khoản
function myAccount() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.getElementById("trangchu").classList.add("hide");
  document.getElementById("order-history").classList.remove("open");
  document.getElementById("account-user").classList.add("open");
  userInfo();
}

// Chuyển đổi trang chủ và trang xem lịch sử đặt hàng
function orderHistory() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.getElementById("account-user").classList.remove("open");
  document.getElementById("trangchu").classList.add("hide");
  document.getElementById("order-history").classList.add("open");
  renderOrderProduct();
}

function emailIsValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function userInfo() {
  let user = JSON.parse(localStorage.getItem("currentuser"));
  document.getElementById("infoname").value = user.fullName;
  document.getElementById("infophone").value = user.userName;
  document.getElementById("infoemail").value = user.email;
  document.getElementById("infoaddress").value = user.address;
  if (user.email == undefined) {
    infoemail.value = "";
  }
  if (user.address == undefined) {
    infoaddress.value = "";
  }
}

// Thay doi thong tin
function changeInformation() {
  let accounts = JSON.parse(localStorage.getItem("accounts"));
  let user = JSON.parse(localStorage.getItem("currentuser"));
  let infoname = document.getElementById("infoname").value;
  let infoemail = document.getElementById("infoemail").value;
  let infoaddress = document.getElementById("infoaddress").value;

  if (infoemail.length > 0) {
    if (!emailIsValid(infoemail)) {
    }
  }

  let changeInfoRequest = {
    userId: user.id,
    fullname: infoname,
    email: infoemail,
    newAddress: infoaddress,
  };

  try {
    fetch(`http://localhost:8080/user/change`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(changeInfoRequest),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          let user = JSON.parse(localStorage.getItem("currentuser"));
          user.fullName = infoname;
          user.email = infoemail;
          user.address = infoaddress;
          localStorage.setItem("currentuser", JSON.stringify(user));

          let accounts = JSON.parse(localStorage.getItem("accounts"));
          let index = accounts.findIndex((acc) => acc.id === user.id);
          if (index !== -1) {
            accounts[index].fullName = infoname;
            accounts[index].email = infoemail;
            accounts[index].address = infoaddress;
            localStorage.setItem("accounts", JSON.stringify(accounts));
          }
          kiemtradangnhap();
          toast({
            title: "Success",
            message: "Cập nhật thông tin thành công!",
            type: "success",
            duration: 3000,
          });
        } else {
          toast({
            title: "Error",
            message: "Cập nhật thất bại. Vui lòng thử lại!",
            type: "error",
            duration: 3000,
          });
        }
      });
  } catch (error) {
    console.error("Error:", error);
    toast({
      title: "Error",
      message: "Không thể cập nhật thông tin. Vui lòng thử lại!",
      type: "error",
      duration: 3000,
    });
  }
}

// Đổi mật khẩu
async function changePassword() {
  let currentUser = JSON.parse(localStorage.getItem("currentuser"));
  let passwordCur = document.getElementById("password-cur-info");
  let passwordAfter = document.getElementById("password-after-info");
  let passwordConfirm = document.getElementById("password-comfirm-info");
  let check = true;

  if (passwordCur.value.length == 0) {
    document.querySelector(".password-cur-info-error").innerHTML =
      "Vui lòng nhập mật khẩu hiện tại";
    check = false;
  } else {
    document.querySelector(".password-cur-info-error").innerHTML = "";
  }

  if (passwordAfter.value.length == 0) {
    document.querySelector(".password-after-info-error").innerHTML =
      "Vui lòng nhập mật khẩu mới";
    check = false;
  } else {
    document.querySelector(".password-after-info-error").innerHTML = "";
  }

  if (passwordConfirm.value.length == 0) {
    document.querySelector(".password-after-comfirm-error").innerHTML =
      "Vui lòng nhập mật khẩu xác nhận";
    check = false;
  } else {
    document.querySelector(".password-after-comfirm-error").innerHTML = "";
  }

  if (check === true) {
    if (passwordAfter.value.length < 6) {
      document.querySelector(".password-after-info-error").innerHTML =
        "Vui lòng nhập mật khẩu mới có số kí tự lớn hơn hoặc bằng 6";
      return;
    }

    if (passwordConfirm.value !== passwordAfter.value) {
      document.querySelector(".password-after-comfirm-error").innerHTML =
        "Mật khẩu xác nhận không trùng khớp";
      return;
    }

    let changePasswordRequest = {
      userId: currentUser.id,
      oldPassword: passwordCur.value,
      newPassword: passwordAfter.value,
      confirmPassword: passwordConfirm.value,
    };

    try {
      let response = await fetch("http://localhost:8080/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(changePasswordRequest),
      });

      let result = await response.json();

      if (result.data) {
        toast({
          title: "Success",
          message: "Đổi mật khẩu thành công!",
          type: "success",
          duration: 3000,
        });
        currentUser.password = passwordAfter.value;
        localStorage.setItem("currentuser", JSON.stringify(currentUser));

        setTimeout(() => {
          location.reload();
        }, 2000);
      } else {
        if (result.description === "Mật khẩu cũ không đúng") {
          document.querySelector(".password-cur-info-error").innerHTML =
            "Bạn đã nhập sai mật khẩu hiện tại";
        } else {
          document.querySelector(".password-cur-info-error").innerHTML =
            "Có lỗi xảy ra";
        }
      }
    } catch (error) {
      console.error("Error:", error);
      document.querySelector(".password-cur-info-error").innerHTML =
        "Có lỗi xảy ra trong quá trình kết nối";
    }
  }
}

function getProductInfo(id) {
  let products = JSON.parse(localStorage.getItem("products"));
  return products.find((item) => {
    return item.id == id;
  });
}

//Quan ly don hang
async function renderOrderProduct() {
  let currentUser = JSON.parse(localStorage.getItem("currentuser"));
  try {
    let response = await fetch(
      `http://localhost:8080/order/get/${currentUser.id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.ok) {
      let ordersData = await response.json();
      let order = ordersData.data;
      let orderHtml = "";

      if (order.length == 0) {
        orderHtml = `<div class="empty-order-section">
                                <img src="./assets/img/empty-order.jpg" alt="" class="empty-order-img">
                                <p>Chưa có đơn hàng nào</p>
                             </div>`;
      } else {
        order.forEach((order) => {
          if (order.orderItems.length > 0) {
            orderHtml += `<div class="order-history-group">`;
            order.orderItems.forEach((item) => {
              let product = item.productDTO;
              let note = item.note ? item.note : "Không có ghi chú";

              orderHtml += `
                                <div class="order-history">
                                    <div class="order-history-left">
                                        <img src="${product.image}" alt="${
                product.title
              }">
                                        <div class="order-history-info">
                                            <h4>${product.title}</h4>
                                            <p class="order-history-note"><i class="fa-light fa-pen"></i> ${note}</p>
                                            <p class="order-history-quantity">x${
                                              item.quantity
                                            }</p>
                                        </div>
                                    </div>
                                    <div class="order-history-right">
                                        <div class="order-history-price">
                                            <span class="order-history-current-price">${vnd(
                                              product.price
                                            )}</span>
                                        </div>
                                    </div>
                                </div>
                            `;
            });

            let textCompl =
              order.status === 1
                ? "Đã xử lý"
                : order.status === -1
                ? "Đã bị hủy"
                : "Đang xử lý";

            let classCompl =
              order.status === 1
                ? "complete"
                : order.status === -1
                ? "canceled"
                : "no-complete";
            orderHtml += `
                            <div class="order-history-control">
                                <div class="order-history-status">
                                    <span class="order-history-status-sp ${classCompl}">${textCompl}</span>
                                    <button id="order-history-detail" onclick="detailOrder('${
                                      order.orderId
                                    }')">
                                        <i class="fa-regular fa-eye"></i> Xem chi tiết
                                    </button>
                                </div>
                                 <div class="order-history-total">
                                    <span class="order-history-total-desc">Tổng tiền: </span>
                                    <span class="order-history-toltal-price">${vnd(
                                      order.totalPrice
                                    )}</span>
                                </div>
                            </div>
                        `;
            orderHtml += `</div>`;
          }
        });
      }
      document.querySelector(".order-history-section").innerHTML = orderHtml;
    } else {
      console.error("Failed to fetch orders from backend");
      document.querySelector(".order-history-section").innerHTML =
        "Không thể tải đơn hàng";
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    document.querySelector(".order-history-section").innerHTML =
      "Lỗi kết nối đến server";
  }
}

// Get Order Details
async function getOrderDetails(madon) {
  let response = await fetch(`http://localhost:8080/order/get-order/${madon}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (response.ok) {
    let data = await response.json();
    return data.data.orderItems;
  } else {
    console.error("Error fetching order details");
    return [];
  }
}

// Format Date
function formatDate(date) {
  let fm = new Date(date);
  let yyyy = fm.getFullYear();
  let mm = fm.getMonth() + 1;
  let dd = fm.getDate();
  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  return dd + "/" + mm + "/" + yyyy;
}

// Xem chi tiet don hang
async function detailOrder(id) {
  let response = await fetch(`http://localhost:8080/order/details/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (response.ok) {
    let detail = await response.json();
    localStorage.setItem("order", JSON.stringify(detail.data.orderItems));
    let detailOrderHtml = `
            <ul class="detail-order-group">
                <li class="detail-order-item">
                    <span class="detail-order-item-left"><i class="fa-light fa-calendar-days"></i> Ngày đặt hàng</span>
                    <span class="detail-order-item-right">${formatDate(
                      detail.data.createDate
                    )}</span>
                </li>
                <li class="detail-order-item">
                    <span class="detail-order-item-left"><i class="fa-light fa-truck"></i> Hình thức giao</span>
                    <span class="detail-order-item-right">${
                      detail.data.shippingMethod || "Không có thông tin"
                    }</span>
                </li>
                <li class="detail-order-item">
                    <span class="detail-order-item-left"><i class="fa-light fa-clock"></i> Trạng thái đơn hàng</span>
                    <span class="detail-order-item-right">${
                      detail.data.status == 1 ? "Đã xử lý" : "Đang xử lý"
                    }</span>
                </li>
                <li class="detail-order-item">
                    <span class="detail-order-item-left"><i class="fa-light fa-location-dot"></i> Địa điểm nhận</span>
                    <span class="detail-order-item-right">${
                      detail.data.deliveryAddress || "Không có thông tin"
                    }</span>
                </li>
                <li class="detail-order-item">
                    <span class="detail-order-item-left"><i class="fa-thin fa-person"></i> Người nhận</span>
                    <span class="detail-order-item-right">${
                      detail.data.recipientName || "Không có thông tin"
                    }</span>
                </li>
                <li class="detail-order-item">
                    <span class="detail-order-item-left"><i class="fa-light fa-phone"></i> Số điện thoại nhận</span>
                    <span class="detail-order-item-right">${
                      detail.data.recipientPhone || "Không có thông tin"
                    }</span>
                </li>
            </ul>`;
    document.querySelector(".detail-order-content").innerHTML = detailOrderHtml;
    document.querySelector(".modal.detail-order").classList.add("open");
  } else {
    console.error("Failed to fetch order details");
  }
}

// Create id order
function createId(arr) {
  let id = arr.length + 1;
  let check = arr.find((item) => item.id == "DH" + id);
  while (check != null) {
    id++;
    check = arr.find((item) => item.id == "DH" + id);
  }
  return "DH" + id;
}
