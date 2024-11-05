var productAll = JSON.parse(localStorage.getItem('products'));

document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".filter-btn").addEventListener("click", (e) => {
        e.preventDefault();
        const advancedSearch = document.querySelector(".advanced-search");
        advancedSearch.classList.toggle("open");
        document.getElementById("home-service").scrollIntoView({
            behavior: 'smooth'
        });
    });
});

document.querySelector(".form-search-input").addEventListener("click",(e) => {
    e.preventDefault();
    document.getElementById("home-service").scrollIntoView();
})

function closeSearchAdvanced() {
    document.querySelector(".advanced-search").classList.toggle("open");
}

//Open Search Mobile 
function openSearchMb() {
    document.querySelector(".header-middle-left").style.display = "none";
    document.querySelector(".header-middle-center").style.display = "block";
    document.querySelector(".header-middle-right-item.close").style.display = "block";
    let liItem = document.querySelectorAll(".header-middle-right-item.open");
    for(let i = 0; i < liItem.length; i++) {
        liItem[i].style.setProperty("display", "none", "important")
    }
}

//Close Search Mobile 
function closeSearchMb() {
    document.querySelector(".header-middle-left").style.display = "block";
    document.querySelector(".header-middle-center").style.display = "none";
    document.querySelector(".header-middle-right-item.close").style.display = "none";
    let liItem = document.querySelectorAll(".header-middle-right-item.open");
    for(let i = 0; i < liItem.length; i++) {
        liItem[i].style.setProperty("display", "block", "important")
    }
}

let currentPageSearch = 0;
let totalPageSearch = 0;

function searchProducts(mode, page=1) {
    currentPageSearch = page;
    let valeSearchInput = $('.form-search-input').val() || "";
    let valueCategory = $('#advanced-search-category-select').val() || "";
    let minPrice = $('#min-price').val() !== "" ? parseInt($('#min-price').val()) : 1;
    let maxPrice = $('#max-price').val() !== "" ? parseInt($('#max-price').val()) : 100000000;
    
    if (parseInt(minPrice) > parseInt(maxPrice) && minPrice !== "" && maxPrice !== "") {
        alert("Giá đã nhập sai !");
    }

    // showHomeProduct(result);
    $.ajax({
        url: 'http://localhost:8080/products/find',
        method: 'GET',
        data: {
            title: valeSearchInput || "",
            priceFrom: minPrice || "",
            categoryId: valueCategory === "" ? null : valueCategory,
            priceTo: maxPrice || "",
            sortDirection: (mode === 1 ? "asc" : (mode === 2 ? "desc" : "")),
            page : page-1
        }
    })
    .done(function (response) {
        if (response.success) {
            totalPageSearch = response.data.totalPages;
            var products = response.data.products;
            localStorage.setItem('products', JSON.stringify(response.data.products));
            displayList(products,currentPageSearch);
            setupPaginationSearch(mode, totalPageSearch);
        } else {
            alert("Không tìm thấy sản phẩm nào.");
        }
    });
    $('#home-service')[0].scrollIntoView();

    switch (mode) {
        case 0:
            $('.form-search-input').val("");
            $('#advanced-search-category-select').val("");
            $('#min-price').val("");
            $('#max-price').val("");
            break;
        case 1:
            
            break;
        case 2:
            
            break;
    }
}

//Search Admin



function setupPaginationSearch(mode, totalPages) {
    document.querySelector('.page-nav-list').innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        let li = paginationChangeSearch(mode, i);
        document.querySelector('.page-nav-list').appendChild(li);
    }
  }
function paginationChangeSearch(mode, page) {
    let node = document.createElement(`li`);
    node.classList.add('page-nav-item');
    node.innerHTML = `<a href="javascript:;">${page}</a>`;
    if (currentPageSearch === page) {
        node.classList.add('active');
    }
    
    node.addEventListener('click', function () {
    currentPageSearch = page;
    searchProducts(mode,currentPageSearch);
    let t = document.querySelectorAll('.page-nav-item.active');
    for (let i = 0; i < t.length; i++) {
        t[i].classList.remove('active');
    }
    node.classList.add('active');
    document.getElementById("home-service").scrollIntoView();
    });
    
    return node;
}