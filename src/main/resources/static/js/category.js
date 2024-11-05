$(document).ready(function () {
  $.ajax({
    url: "http://localhost:8080/category",
    method: "GET",
    success: function (data) {
      var menuList = $("#menu-list");
      menuList.find(".menu-list-item:not(:first)").remove();
      $.each(data, function (index, category) {
        var menuItem = $("<li>", {
          class: "menu-list-item",
          onclick: "showCategory(" + category.id + ")",
        }).append(
          $("<a>", {
            href: "javascript:;",
            class: "menu-link",
            text: category.name,
          })
        );
        menuList.append(menuItem);
      });
    },
    error: function () {
      console.error("Failed to fetch categories.");
    },
  });
});

function decreasingNumber(btn) {
  let qtyInput = $(btn).siblings(".input-qty");
  let currentValue = parseInt(qtyInput.val());
  if (currentValue > 1) {
    qtyInput.val(currentValue - 1);
    updateTotalPrice();
  }
}

function increasingNumber(btn) {
  let qtyInput = $(btn).siblings(".input-qty");
  let currentValue = parseInt(qtyInput.val());
  let maxValue = parseInt(qtyInput.attr("max"));
  if (currentValue < maxValue) {
    qtyInput.val(currentValue + 1);
    updateTotalPrice();
  }
}

function updateTotalPrice() {
  let unitPrice = parseFloat($(".current-price").text().replace(/\D/g, ""));
  let qty = parseInt($(".input-qty").val());
  let totalPrice = unitPrice * qty;
  $(".price-total .price").text(vnd(totalPrice));
}

let totalPageCate = 0;
let currentPageCate = 1;

function showCategory(categoryId,page=1) {
  currentPageCate = page;
  var linkCategoryProduct = `http://localhost:8080/category/productincate?id=${categoryId}&page=${page - 1}`
  $.ajax({
    url: linkCategoryProduct,
    method: "GET",
  })
  .done(function (data) {
    var productContainer = $("#product-container");
    productContainer.empty();
    var products = data.products;
    totalPageCate = data.totalPages;
    displayList(products,currentPageCate);
    setupPaginationCate(totalPageCate, categoryId);
    $("#trangchu").removeClass("hide");
    $("#account-user").removeClass("open");
    $("#order-history").removeClass("open");
    $("#home-title")[0].scrollIntoView();
  });
}
function setupPaginationCate(totalPages, categoryId) {
  document.querySelector('.page-nav-list').innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
      let li = paginationChangeCate(i, categoryId);
      document.querySelector('.page-nav-list').appendChild(li);
  }
}
function paginationChangeCate(page, categoryId) {
  let node = document.createElement(`li`);
    node.classList.add('page-nav-item');
    node.innerHTML = `<a href="javascript:;">${page}</a>`;
    if (currentPageCate === page) {
        node.classList.add('active');
    }
    
    node.addEventListener('click', function () {
      currentPageCate = page;
      showCategory(categoryId,currentPageCate);
      let t = document.querySelectorAll('.page-nav-item.active');
      for (let i = 0; i < t.length; i++) {
          t[i].classList.remove('active');
      }
      node.classList.add('active');
      document.getElementById("home-service").scrollIntoView();
    });
    
    return node;
}
