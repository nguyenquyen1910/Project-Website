let currentPage = 1;
let totalPage = 0;

$(document).ready(function () {
    loadProducts(currentPage);
});

function loadProducts(page) {
    var linkProduct = `http://localhost:8080/products/homepage?page=${page - 1}`;
    $.ajax({
        method: "GET",
        url: linkProduct,
    })
    .done(function (msg) {
        if (msg.success) {
            localStorage.setItem('products', JSON.stringify(msg.data.products));
            totalPage = msg.data.totalPages;
            displayList(msg.data.products);
            setupPagination(totalPage);
        }
    });
}

function renderProducts(products) {
    let productHTML = '';
    $.each(products, function (index, value) { 
        productHTML += buildProductHTML(value);
    });
    $("#home-products").html(productHTML);
}

function displayList(products) {
    let productShow = products.filter(item => item.status == 1);
    renderProducts(productShow);
}

function setupPagination(totalPages) {
    document.querySelector('.page-nav-list').innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        let li = paginationChange(i);
        document.querySelector('.page-nav-list').appendChild(li);
    }
}

function paginationChange(page) {
    let node = document.createElement(`li`);
    node.classList.add('page-nav-item');
    node.innerHTML = `<a href="javascript:;">${page}</a>`;
    if (currentPage === page) {
        node.classList.add('active');
    }
    
    node.addEventListener('click', function () {
        currentPage = page;
        loadProducts(currentPage);
        let t = document.querySelectorAll('.page-nav-item.active');
        for (let i = 0; i < t.length; i++) {
            t[i].classList.remove('active');
        }
        node.classList.add('active');
        document.getElementById("home-service").scrollIntoView();
    });
    
    return node;
}


function buildProductHTML(value) {
    return `
      <div class="col-product">
        <article class="card-product" >
          <div class="card-header">
            <a href="#" class="card-image-link" onclick="detailProduct(${value.id})">
              <img class="card-image" src="${value.image}" alt="${value.title}">
            </a>
          </div>
          <div class="food-info">
            <div class="card-content">
              <div class="card-title">
                <a href="#" class="card-title-link" onclick="detailProduct(${value.id})">${value.title}</a>
              </div>
            </div>
            <div class="card-footer">
              <div class="product-price">
                <span class="current-price">${vnd(value.price)}</span> 
              </div>
              <div class="product-buy">
                <button onclick="detailProduct(${value.id})" class="card-button order-item"><i class="fa-regular fa-cart-shopping-fast"></i> Đặt món</button>
              </div> 
            </div>
          </div>
        </article>
      </div>
    `;
}


function detailProduct(id) {
    
    $.ajax({
        url: `http://localhost:8080/products/product?id=${id}`,
        method: 'GET',
        success: function(infoProduct) {
            infoProduct=infoProduct.data;
            let modal = document.querySelector('.modal.product-detail');
            let modalHtml = `
                <div class="modal-header">
                    <img class="product-image" src="${infoProduct.image}" alt="">
                </div>
                <div class="modal-body">
                    <h2 class="product-title">${infoProduct.title}</h2>
                    <div class="product-control">
                        <div class="priceBox">
                            <span class="current-price">${vnd(infoProduct.price)}</span>
                        </div>
                        <div class="buttons_added">
                            <input class="minus is-form" type="button" value="-" onclick="decreasingNumber(this)">
                            <input class="input-qty" max="100" min="1" name="" type="number" value="1">
                            <input class="plus is-form" type="button" value="+" onclick="increasingNumber(this)">
                        </div>
                    </div>
                    <p class="product-description">${infoProduct.description}</p>
                </div>
                <div class="notebox">
                    <p class="notebox-title">Ghi chú</p>
                    <textarea class="text-note" id="popup-detail-note" placeholder="Nhập thông tin cần lưu ý..."></textarea>
                </div>
                <div class="modal-footer">
                    <div class="price-total">
                        <span class="thanhtien">Thành tiền</span>
                        <span class="price">${vnd(infoProduct.price)}</span>
                    </div>
                    <div class="modal-footer-control">
                        <button class="button-dathangngay" data-product="${infoProduct.id}">Đặt hàng ngay</button>
                        <button class="button-dat" id="add-cart" onclick="animationCart()"><i class="fa-light fa-basket-shopping"></i></button>
                    </div>
                </div>`;
            
            document.querySelector('#product-detail-content').innerHTML = modalHtml;
            modal.classList.add('open');
            document.body.style.overflow = "hidden";

            //Cập nhật giá tiền khi tăng số lượng sản phẩm
            let tgbtn = document.querySelectorAll('.is-form');
            let qty = document.querySelector('.product-control .input-qty');
            let priceText = document.querySelector('.price');
            tgbtn.forEach(element => {
                element.addEventListener('click', () => {
                    let price = infoProduct.price * parseInt(qty.value);
                    priceText.innerHTML = vnd(price);
                });
            });

            // Thêm sản phẩm vào giỏ hàng
            let productbtn = document.querySelector('.button-dat');
            productbtn.addEventListener('click', (e) => {
                if (localStorage.getItem('currentuser')) {
                    addCart(infoProduct.id);
                } else {
                    toast({ title: 'Warning', message: 'Chưa đăng nhập tài khoản!', type: 'warning', duration: 3000 });
                }
            });

            // Mua ngay sản phẩm
            dathangngay();
        },
        error: function(err) {
            console.error('Lỗi khi lấy thông tin sản phẩm:', err);
        }
    });
}
function vnd(price) {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

async function addCart(index) {
    let currentuser = localStorage.getItem('currentuser') ? JSON.parse(localStorage.getItem('currentuser')) : [];
    let soluong = $('.input-qty').val();
    let popupDetailNote = $('#popup-detail-note').val();
    let note = popupDetailNote === "" ? "Không có ghi chú" : popupDetailNote;
    console.log(index);

    let productcart = {
        productId: index,
        quantity: parseInt(soluong),
        note: note
    };

    try {
        let cartRequest={
            userId: currentuser.id,
            listItems: [productcart],
            status: 1
        }
        const response = await fetch(`http://localhost:8080/cart/insert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cartRequest)
        });
        if (!response.ok) {
            throw new Error('Failed to add to cart');
        }

        updateAmount();

        closeModal();
        
        toast({ title: 'Success', message: 'Thêm thành công sản phẩm vào giỏ hàng', type: 'success', duration: 3000 });
    } catch (error) {
        console.error('Error adding to cart:', error);
        toast({ title: 'Error', message: 'Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng', type: 'error', duration: 3000 });
    }
}

function closeModal() {
    $('.modal').removeClass('open');
    $('body').css('overflow', 'auto');
}

window.onscroll = () => {
    let backtopTop = document.querySelector(".back-to-top")
    if (document.documentElement.scrollTop > 100) {
        backtopTop.classList.add("active");
    } else {
        backtopTop.classList.remove("active");
    }
}

// Auto hide header on scroll
const headerNav = document.querySelector(".header-bottom");
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
    if(lastScrollY < window.scrollY) {
        headerNav.classList.add("hide")
    } else {
        headerNav.classList.remove("hide")
    }
    lastScrollY = window.scrollY;
})
