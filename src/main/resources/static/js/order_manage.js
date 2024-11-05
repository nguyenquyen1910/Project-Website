$(document).ready(function () {
  const token = localStorage.getItem("token");
  async function changeStatus(id, el) {
    $.ajax({
      url: `http://localhost:8080/order/admin/solve/${id}?status=1`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      success: function (data) {
        let orderRow = $(`tr[data-order-id="${id}"]`);
        if (orderRow.length) {
          orderRow
            .find(".status-cell")
            .html(`<span class="status-complete">Đã xử lý</span>`); // Cập nhật trạng thái
        }
        $(el)
          .removeClass("btn-chuaxuly")
          .addClass("btn-daxuly")
          .text("Đã xử lý");
        toast({
          title: "Thành công",
          message: "Đơn hàng đã được xử lý!",
          type: "success",
          duration: 3000,
        });
        $(".modal.detail-order").removeClass("open");
      },
      error: function (error) {
        console.error("Error:", error);
      },
    });
  }

  async function findOrder() {
    let tinhTrang = parseInt($("#tinh-trang").val());
    let ct = $("#form-search-order").val();
    let timeStart = $("#time-start").val();
    let timeEnd = $("#time-end").val();

    if (timeEnd < timeStart && timeEnd !== "" && timeStart !== "") {
      alert("Lựa chọn thời gian sai !");
      return;
    }

    let orders = await fetchAllOrders();
    orders = orders.data;

    let result =
      tinhTrang === 2
        ? orders
        : orders.filter((item) => {
            return item.status === tinhTrang;
          });

    result =
      ct === ""
        ? result
        : result.filter((item) => {
            return (
              item.userFullName.toLowerCase().includes(ct.toLowerCase()) ||
              item.orderId.toString().toLowerCase().includes(ct.toLowerCase())
            );
          });

    if (timeStart !== "" && timeEnd === "") {
      result = result.filter((item) => {
        return (
          new Date(item.createDate) >= new Date(timeStart).setHours(0, 0, 0)
        );
      });
    } else if (timeStart === "" && timeEnd !== "") {
      result = result.filter((item) => {
        return (
          new Date(item.createDate) <= new Date(timeEnd).setHours(23, 59, 59)
        );
      });
    } else if (timeStart !== "" && timeEnd !== "") {
      result = result.filter((item) => {
        return (
          new Date(item.createDate) >= new Date(timeStart).setHours(0, 0, 0) &&
          new Date(item.createDate) <= new Date(timeEnd).setHours(23, 59, 59)
        );
      });
    }

    showOrder(result);
  }

  $("#tinh-trang").change(function () {
    findOrder();
  });

  $("#form-search-order").on("input", findOrder);

  $("#btn-cancel").click(cancelSearchOrder);

  $("#time-start").change(function () {
    findOrder();
  });

  $("#time-end").change(function () {
    findOrder();
  });

  // Hàm hủy tìm kiếm đơn hàng
  async function cancelSearchOrder() {
    let orders = await fetchAllOrders();
    orders = orders.data;

    $("#tinh-trang").val(2);
    $("#form-search-order").val("");
    $("#time-start").val("");
    $("#time-end").val("");

    showOrder(orders);
  }

  function showOrder(arr) {
    let users = JSON.parse(localStorage.getItem("accounts"));
    let orderHtml = "";

    if (arr.length === 0) {
      orderHtml = '<td colspan="6">Không có dữ liệu</td>';
    } else {
      arr.forEach((item) => {
        let id = "DH" + item.orderId;
        let orderUserName = users.find((user) => user.id === item.userId);
        let status = "";

        if (item.status == 0) {
          status = '<span class="status-no-complete">Chưa xử lý</span>';
        } else if (item.status == 1) {
          status = '<span class="status-complete">Đã xử lý</span>';
        } else if (item.status == -1) {
          status = '<span class="status-canceled">Đã hủy</span>';
        }

        let date = formatDate(item.createDate);
        orderHtml += `
                    <tr data-order-id="${item.orderId}">
                        <td>${id}</td>
                        <td>${orderUserName.fullName}</td>
                        <td>${date}</td>
                        <td>${vnd(item.totalPrice)}</td>
                        <td class="status-cell">${status}</td>
                        <td class="control">
                            <button class="btn-detail" onclick="detailOrder('${
                              item.orderId
                            }')"><i class="fa-regular fa-eye"></i> Chi tiết</button>
                        </td>
                    </tr>`;
        localStorage.setItem("orders", JSON.stringify(item));
      });
    }
    $("#showOrder").html(orderHtml);
  }

  function fetchOrdersFromBackend() {
    return fetch("http://localhost:8080/order/admin/getall", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Failed to fetch orders from backend");
          return [];
        }
        return response.json();
      })
      .then((ordersData) => {
        return ordersData.data;
      })
      .catch((error) => {
        console.error("Error fetching orders from backend:", error);
        return [];
      });
  }

  fetchOrdersFromBackend().then((orders) => {
    showOrder(orders);
  });

  async function getOrderDetails(madon) {
    try {
      const response = await fetch(
        `http://localhost:8080/order/details/${madon}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const orderDetails = await response.json();
        return orderDetails.data;
      } else {
        console.error("Failed to fetch order details");
        return [];
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      return [];
    }
  }

  async function detailOrder(id) {
    $(".modal.detail-order").addClass("open");
    let ctDon = await getOrderDetails(id);
    let spHtml =
      '<div class="modal-detail-left"><div class="order-item-group">';

    ctDon.orderItems.forEach((item) => {
      spHtml += `
                <div class="order-product">
                    <div class="order-product-left">
                        <img src="${item.productDTO.image}" alt="">
                        <div class="order-product-info">
                            <h4>${item.productDTO.title}</h4>
                            <p class="order-product-note"><i class="fa-light fa-pen"></i> ${
                              item.note
                            }</p>
                            <p class="order-product-quantity">SL: ${
                              item.quantity
                            }</p>
                        </div>
                    </div>
                    <div class="order-product-right">
                        <div class="order-product-price">
                            <span class="order-product-current-price">${vnd(
                              item.productDTO.price
                            )}</span>
                        </div>
                    </div>
                </div>`;
    });

    spHtml += "</div></div>";
    spHtml += `
            <div class="modal-detail-right">
                <ul class="detail-order-group">
                    <li class="detail-order-item">
                        <span class="detail-order-item-left"><i class="fa-light fa-calendar-days"></i> Ngày đặt hàng</span>
                        <span class="detail-order-item-right">${formatDate(
                          ctDon.createDate
                        )}</span>
                    </li>
                    <li class="detail-order-item">
                        <span class="detail-order-item-left"><i class="fa-light fa-truck"></i> Hình thức giao</span>
                        <span class="detail-order-item-right">${
                          ctDon.shippingMethod
                        }</span>
                    </li>
                    <li class="detail-order-item">
                        <span class="detail-order-item-left"><i class="fa-thin fa-person"></i> Người nhận</span>
                        <span class="detail-order-item-right">${
                          ctDon.recipientName
                        }</span>
                    </li>
                    <li class="detail-order-item">
                        <span class="detail-order-item-left"><i class="fa-light fa-phone"></i> Số điện thoại</span>
                        <span class="detail-order-item-right">${
                          ctDon.recipientPhone
                        }</span>
                    </li>
                    <li class="detail-order-item tb">
                        <span class="detail-order-item-left"><i class="fa-light fa-clock"></i> Thời gian giao</span>
                        <p class="detail-order-item-b">${
                          ctDon.expectedDeliveryDate
                        }</p>
                    </li>
                    <li class="detail-order-item tb">
                        <span class="detail-order-item-t"><i class="fa-light fa-location-dot"></i> Địa chỉ nhận</span>
                        <p class="detail-order-item-b">${
                          ctDon.deliveryAddress
                        }</p>
                    </li>
                    <li class="detail-order-item tb">
                        <span class="detail-order-item-t"><i class="fa-light fa-note-sticky"></i> Ghi chú</span>
                        <p class="detail-order-item-b">${ctDon.noteOrder}</p>
                    </li>
                </ul>
            </div>`;

    $(".modal-detail-order").html(spHtml);
    let classDetailBtn = "";
    let textDetailBtn = "";
    let disabledAttr = "";

    if (ctDon.status == 0) {
      classDetailBtn = "btn-chuaxuly";
      textDetailBtn = "Chưa xử lý";
    } else if (ctDon.status == 1) {
      classDetailBtn = "btn-daxuly";
      textDetailBtn = "Đã xử lý";
    } else if (ctDon.status == -1) {
      classDetailBtn = "btn-dahuy";
      textDetailBtn = "Đã hủy đơn";
      disabledAttr = "disabled";
    }

    let cancelButton = "";
    if (ctDon.status != -1) {
      cancelButton = `<button class="modal-detail-btn btn-delete" onclick="cancelOrder('${ctDon.orderId}', this)">Hủy đơn hàng</button>`;
    }

    $(".modal-detail-bottom").html(`
            <div class="modal-detail-bottom-left">
                <div class="price-total">
                    <span class="thanhtien">Thành tiền</span>
                    <span class="price">${vnd(ctDon.totalPrice)}</span>
                </div>
            </div>
            <div class="modal-detail-bottom-right">
                <button class="modal-detail-btn ${classDetailBtn}" onclick="changeStatus('${ctDon.orderId}',this)" ${disabledAttr}>${textDetailBtn}</button>
                ${cancelButton}
            </div>`);
  }

  async function cancelOrder(id, el) {
    $.ajax({
      url: `http://localhost:8080/order/admin/solve/${id}?status=-1`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      success: function (data) {
        let orderRow = $(`tr[data-order-id="${id}"]`);
        if (orderRow.length) {
          orderRow
            .find(".status-cell")
            .html(`<span class="status-canceled">Đã hủy</span>`); // Cập nhật trạng thái
        }
        $(el).attr("disabled", true).text("Đã hủy");
        toast({
          title: "Thành công",
          message: "Đơn hàng đã được hủy!",
          type: "success",
          duration: 3000,
        });
        $(".modal.detail-order").removeClass("open");
      },
      error: function (error) {
        console.error("Error:", error);
      },
    });
  }
  window.changeStatus = changeStatus;
  window.cancelOrder = cancelOrder;
  window.detailOrder = detailOrder;
});

function formatDate(date) {
  let fm = new Date(date);
  let yyyy = fm.getFullYear();
  let mm = fm.getMonth() + 1;
  let dd = fm.getDate();
  let hh = fm.getHours();
  let min = fm.getMinutes();
  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  if (hh < 10) hh = "0" + hh;
  if (min < 10) min = "0" + min;
  return `${hh}:${min}  ${dd}/${mm}/${yyyy}`;
}
