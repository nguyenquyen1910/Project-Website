async function createObj() {
  let orders = await fetchAllOrders();
  orders = orders.data;
  let products = await fetchProducts();
  let result = [];

  $.each(orders, (index, item) => {
    if (item.status == 1 && item.orderItems && Array.isArray(item.orderItems)) {
      $.each(item.orderItems, (i, orderItem) => {
        let prod = products.find(
          (product) => product.id === orderItem.productDTO.id
        );
        if (prod) {
          let obj = {
            id: prod.id,
            madon: "DH" + item.orderId,
            quantity: orderItem.quantity,
            price: prod.price,
            category: prod.categoryName,
            title: prod.title,
            img: prod.image,
            time: item.createDate,
          };
          result.push(obj);
        }
      });
    }
  });
  return result;
}

// Filter
async function thongKe(mode) {
  let categoryTk = $("#the-loai-tk option:selected").text();
  let ct = $("#form-search-tk").val();
  let timeStart = $("#time-start-tk").val();
  let timeEnd = $("#time-end-tk").val();

  if (timeEnd < timeStart && timeEnd !== "" && timeStart !== "") {
    alert("Lựa chọn thời gian sai !");
    return;
  }

  let arrDetail = await createObj();
  let result = categoryTk === "Tất cả"  ? arrDetail  : arrDetail.filter((item) => {
    return item.category === categoryTk;
  }); 

  result =
    ct === ""
      ? result
      : result.filter((item) => {
          return item.title.toLowerCase().includes(ct.toLowerCase());
        });

  if (timeStart !== "" && timeEnd === "") {
    result = result.filter((item) => {
      return new Date(item.time) > new Date(timeStart).setHours(0, 0, 0);
    });
  } else if (timeStart === "" && timeEnd !== "") {
    result = result.filter((item) => {
      return new Date(item.time) < new Date(timeEnd).setHours(23, 59, 59);
    });
  } else if (timeStart !== "" && timeEnd !== "") {
    result = result.filter((item) => {
      return (
        new Date(item.time) > new Date(timeStart).setHours(0, 0, 0) &&
        new Date(item.time) < new Date(timeEnd).setHours(23, 59, 59)
      );
    });
  }

  showThongKe(result, mode);
}

// Show số lượng sp, số lượng đơn bán, doanh thu
function showOverview(arr) {
  $("#quantity-product").text(arr.length);
  $("#quantity-order").text(
    arr.reduce((sum, cur) => sum + parseInt(cur.quantity), 0)
  );
  $("#quantity-sale").text(
    vnd(arr.reduce((sum, cur) => sum + parseInt(cur.doanhthu), 0))
  );
}

async function showThongKe(arr, mode) {
  let orderHtml = "";
  let mergeObj = mergeObjThongKe(arr);
  showOverview(mergeObj);

  switch (mode) {
    case 0:
      showOverview(mergeObj);
      $("#the-loai-tk").val("Tất cả");
      $("#form-search-tk").val("");
      $("#time-start-tk").val("");
      $("#time-end-tk").val("");
      break;
    case 1:
      mergeObj.sort((a, b) => parseInt(a.quantity) - parseInt(b.quantity));
      break;
    case 2:
      mergeObj.sort((a, b) => parseInt(b.quantity) - parseInt(a.quantity));
      break;
  }

  $.each(mergeObj, (i, item) => {
    orderHtml += `
        <tr>
        <td>${i + 1}</td>
        <td><div class="prod-img-title"><img class="prd-img-tbl" src="${
          item.img
        }" alt=""><p>${item.title}</p></div></td>
        <td>${item.quantity}</td>
        <td>${vnd(item.doanhthu)}</td>
        <td><button class="btn-detail product-order-detail" data-id="${
          item.id
        }"><i class="fa-regular fa-eye"></i> Chi tiết</button></td>
        </tr>`;
  });

  $("#showTk").html(orderHtml);

  $(".product-order-detail").on("click", function () {
    let idProduct = $(this).data("id");
    detailOrderProduct(arr, idProduct);
  });
}

$(document).ready(async function () {
  let arr = await createObj();
  showThongKe(arr);
});

function mergeObjThongKe(arr) {
  let result = [];
  $.each(arr, (index, item) => {
    let check = result.find((i) => i.title === item.title); // Không tìm thấy gì trả về undefined
    if (check) {
      check.quantity = parseInt(check.quantity) + parseInt(item.quantity);
      check.doanhthu += parseInt(item.price) * parseInt(item.quantity);
    } else {
      const newItem = { ...item };
      newItem.doanhthu = newItem.price * newItem.quantity;
      result.push(newItem);
    }
  });
  return result;
}

function detailOrderProduct(arr, id) {
  let orderHtml = "";
  $.each(arr, (index, item) => {
    if (item.id === id) {
      orderHtml += `<tr>
            <td>${item.madon}</td>
            <td>${item.quantity}</td>
            <td>${vnd(item.price)}</td>
            <td>${formatDate(item.time)}</td>
            </tr>`;
    }
  });
  $("#show-product-order-detail").html(orderHtml);
  $(".modal.detail-order-product").addClass("open");
}
