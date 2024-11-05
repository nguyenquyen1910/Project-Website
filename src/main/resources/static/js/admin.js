document.addEventListener("DOMContentLoaded", function() {
    checkAdminOption();
});

const rootAdmin="0123456789";

function checkAdminOption() {
    const adminOption = document.getElementById("manager-option");
    if (adminOption) {
        const currentUser = JSON.parse(localStorage.getItem("currentuser"));
        let isAdmin = currentUser.userName==="0123456789"
        adminOption.style.display = isAdmin ? "block" : "none";
    }
}

function handleAdminAccess(){
    let token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem("currentuser"));

    if (!currentUser || currentUser.roleId == 2) {
        document.querySelector("body").innerHTML = `<div class="access-denied-section">
                <img class="access-denied-img" src="./assets/img/access-denied.webp" alt="">
            </div>`
        return;
    }

    fetch('http://localhost:8080/admin', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => {
            if (response.ok) {
                console.log("User has admin access");
                document.getElementById("name-acc").innerHTML = currentUser.fullName;
            } else {
                console.error("Access denied");
                window.location.href = "/index";
            }
        })
        .catch(error => console.error('Error:', error));
}

function checkLogin() {
    let currentUser = JSON.parse(localStorage.getItem("currentuser"));
    if(currentUser == null || currentUser.roleId == 2) {
        document.querySelector("body").innerHTML = `<div class="access-denied-section">
            <img class="access-denied-img" src="./assets/img/access-denied.webp" alt="">
        </div>`
    } else {
        document.getElementById("name-acc").innerHTML = currentUser.fullName;
    }
}
window.onload = handleAdminAccess();

//do sidebar open and close
const menuIconButton = document.querySelector(".menu-icon-btn");
const sidebar = document.querySelector(".sidebar");
menuIconButton.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});

// log out admin user
/*
let toogleMenu = document.querySelector(".profile");
let mune = document.querySelector(".profile-cropdown");
toogleMenu.onclick = function () {
    mune.classList.toggle("active");
};
*/

// tab for section
const sidebars = document.querySelectorAll(".sidebar-list-item.tab-content");
const sections = document.querySelectorAll(".section");

for(let i = 0; i < sidebars.length; i++) {
    sidebars[i].onclick = function () {
        document.querySelector(".sidebar-list-item.active").classList.remove("active");
        document.querySelector(".section.active").classList.remove("active");
        sidebars[i].classList.add("active");
        sections[i].classList.add("active");
    };
}

const closeBtn = document.querySelectorAll('.section');
for(let i=0;i<closeBtn.length;i++){
    closeBtn[i].addEventListener('click',(e) => {
        sidebar.classList.add("open");
    })
}


// Get amount product
function getAmoumtProduct() {
    const token = localStorage.getItem('token');

    return fetch('http://localhost:8080/products/homepage?page=0', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(products => {
        return products.data.totalElements;
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        return 0;
    });
}

getAmoumtProduct().then(amountProduct => {
    document.getElementById("amount-product").innerHTML = amountProduct;
});


//Get amount user
function getAmoumtUser() {
    return fetch(`http://localhost:8080/user`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}` 
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(users => {
            const filterUsers = users.filter(item => item.roleId == 2);
            return filterUsers.length;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            return 0;
        });
}


getAmoumtUser().then(amountUser => {
    document.getElementById("amount-user").innerHTML = amountUser;
});

function getMoney() {
    let tongtien = 0;
    const token = localStorage.getItem('token');
    return fetch('http://localhost:8080/order/admin/getall', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }
        return response.json();
    })
    .then(data => {
        data = data.data;
        data.forEach(item => {
            if(item.status != -1){
                tongtien += item.totalPrice;
            }
        });
        return tongtien;
    })
    .catch(error => {
        console.error('Error:', error);
        return 0;
    });
}
// Gọi hàm getMoney và cập nhật doanh thu
getMoney().then(money => {
    document.getElementById("doanh-thu").innerHTML = vnd(money);    
});

// Doi sang dinh dang tien VND
function vnd(price) {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

// Phân trang và hiển thị sản phẩm
function showProductArr(arr) {
    let productHtml = "";
    if(arr.length == 0) {
        productHtml = `<div class="no-result"><div class="no-result-i"><i class="fa-light fa-face-sad-cry"></i></div><div class="no-result-h">Không có sản phẩm để hiển thị</div></div>`;
    } else {
        arr.forEach(product => {
            let btnCtl = product.status == 1 ? 
            `<button class="btn-delete" onclick="deleteProduct(${product.id})"><i class="fa-regular fa-trash"></i></button>` :
            `<button class="btn-delete" onclick="changeStatusProduct(${product.id})"><i class="fa-regular fa-eye"></i></button>`;
            productHtml += `
            <div class="list">
                    <div class="list-left">
                    <img src="${product.image}" alt="">
                    <div class="list-info">
                        <h4>${product.title}</h4>
                        <p class="list-note">${product.description}</p>
                        <span class="list-category">${product.categoryName}</span>
                    </div>
                </div>
                <div class="list-right">
                    <div class="list-price">
                    <span class="list-current-price">${vnd(product.price)}</span>                   
                    </div>
                    <div class="list-control">
                    <div class="list-tool">
                        <button class="btn-edit" onclick="editProduct(${product.id})"><i class="fa-light fa-pen-to-square"></i></button>
                        ${btnCtl}
                    </div>                       
                </div>
                </div> 
            </div>`;
        });
    }
    document.getElementById("show-product").innerHTML = productHtml;
}


let totalPageAdmin = 0;
let currentPageAdmin = 1;

function displayList(productAll) {
    showProductArr(productAll);
}

function setupPaginationAdmin(totalPageAdmin,currentPageAdmin) {
    document.querySelector('.page-nav-list').innerHTML = '';
    for (let i = 1; i <= totalPageAdmin; i++) {
        let li = paginationChangeAdmin(i,currentPageAdmin);
        document.querySelector('.page-nav-list').appendChild(li);
    }
}

function paginationChangeAdmin(page,currentPageAdmin) {
    let node = document.createElement('li');
    node.classList.add('page-nav-item');
    node.innerHTML = `<a href="javascript:;">${page}</a>`;
    if (currentPageAdmin === page) {
        node.classList.add('active');
    }
    node.addEventListener('click', function () {
        currentPageAdmin = page;
        showProduct(currentPageAdmin);
        let t = document.querySelectorAll('.page-nav-item.active');
        for (let i = 0; i < t.length; i++) {
            t[i].classList.remove('active');
        }
        node.classList.add('active');
        document.getElementById("show-product").scrollIntoView();
    });
    return node;
}

function showProduct(page=1) {
    currentPageAdmin = page;
    let token = localStorage.getItem('token');
    let valueCategory = document.getElementById('the-loai').value;
    let valueSearchInput = document.getElementById('form-search-product').value || "";

    let categoryId = getCategoryValueByName(valueCategory);
    
    let status=1;
    if(valueCategory === "Đã xóa"){
        status = 0;
    }
    if (isNaN(page) || page < 1) {
        page = 1;
    }
    if (isNaN(currentPageAdmin) || currentPageAdmin < 1) {
        currentPageAdmin = 1;
    }
    if (categoryId !== null || valueSearchInput !== "" || status === 0) {
        findProductManager(currentPageAdmin, categoryId, valueSearchInput, status);
    } else{
        fetch(`http://localhost:8080/products/homepage?page=${currentPageAdmin - 1}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            let products=data.data.products.filter(product => product.status === 1);
            totalPageAdmin = data.data.totalPages;
            displayList(products);
            setupPaginationAdmin(totalPageAdmin,currentPageAdmin);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

}

let totalPageSearchAdmin = 0;

function findProductManager(page = 1, categoryId = "", title = "", status = 1){
    let token = localStorage.getItem("token");
    if (categoryId === null) {
        categoryId = "";
    }
    if (isNaN(page) || page < 1) {
        page = 1;
    }
    let url = `http://localhost:8080/products/admin/find?categoryId=${categoryId}&title=${title}&page=${page-1}&status=${status}`;
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            let products = data.data.products;
            totalPageSearchAdmin = data.data.totalPages;
            displayList(products);
            setupPaginationAdmin(totalPageSearchAdmin,currentPageAdmin);
        } else {
            alert("Không tìm thấy sản phẩm nào.");
        }
    })
    .catch(error => {
        console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    });
}

document.getElementById('the-loai').addEventListener('change', showProduct);
async function cancelSearchProduct() {
    document.getElementById('the-loai').value = "Tất cả";
    document.getElementById('form-search-product').value = "";
    currentPageAdmin = 1;
    try {
        let token = localStorage.getItem('token');
        let url = `http://localhost:8080/products/homepage?page=${currentPageAdmin - 1}`;
        
        let response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        let data = await response.json();
        let products = data.data.products.filter(product => product.status === 1);
        totalPageAdmin = data.data.totalPages;
        displayList(products);
        setupPaginationAdmin(totalPageAdmin, currentPageAdmin);
    } catch (error) {
        console.error("Lỗi khi hủy tìm kiếm và lấy lại sản phẩm:", error);
    }
}

window.onload = showProduct();

function createId(arr) {
    let id = arr.length;
    let check = arr.find((item) => item.id == id);
    while (check != null) {
        id++;
        check = arr.find((item) => item.id == id);
    }
    return id;
}

// Xóa sản phẩm 
function deleteProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    let index = products.findIndex(item => {
        return item.id == id;
    })
    if(index==-1){
        toast({ title: 'Warning', message: 'Không tìm thấy sản phẩm !', type: 'warning', duration: 3000 });
        return;
    }
    if (confirm("Bạn có chắc muốn xóa?") == true) {
        fetch(`http://localhost:8080/products/admin/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}` 
            }
        }).then(response => response.json())
        .then(data => {
            if(data.data==true){
                localStorage.setItem("products",JSON.stringify(products));
                toast({
                    title: 'Thành công',
                    message: 'Xóa sản phẩm thành công!',
                    type: 'success',
                    duration: 3000
                });
                showProduct(currentPageAdmin);
            }
        })
    }
}

// Lấy lại sản phẩm đã xóa
function changeStatusProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    let index = products.findIndex(item => {
        return item.id == id;
    })
    if (confirm("Bạn có chắc chắn muốn hủy xóa?") == true) {
        fetch(`http://localhost:8080/products/admin/restore/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}` 
            }
        }).then(response => response.json())
        .then(data => {
            if(data.data==true){
                localStorage.setItem("products",JSON.stringify(products));
                toast({
                    title: 'Thành công',
                    message: 'Khôi phục sản phẩm thành công!',
                    type: 'success',
                    duration: 3000
                });
                showProduct(currentPageAdmin);
            }
        })
    }
}

function getCategoryValueByName(categoryName) {
    const options = document.querySelectorAll("#chon-mon option");
    for (const option of options) {
        if (option.textContent === categoryName) {
            return option.value;
        }
    }
    return null;
}

var indexCur;
async function editProduct(id) {
    let products = await fetchProducts();
    let index = products.findIndex(item => {
        return item.id == id;
    })
    indexCur = index;
    document.querySelectorAll(".add-product-e").forEach(item => {
        item.style.display = "none";
    })
    document.querySelectorAll(".edit-product-e").forEach(item => {
        item.style.display = "block";
    })
    document.querySelector(".add-product").classList.add("open");
    document.querySelector(".upload-image-preview").src = products[index].image;
    document.getElementById("ten-mon").value = products[index].title;
    document.getElementById("gia-moi").value = products[index].price;
    document.getElementById("mo-ta").value = products[index].description;
    document.getElementById("chon-mon").value = getCategoryValueByName(products[index].categoryName);
}


// Chỉnh sửa sản phẩm
let btnUpdateProductIn = document.getElementById("update-product-button");
btnUpdateProductIn.addEventListener("click", async (e) => {
    e.preventDefault();
    let products = await fetchProducts();
    let idProduct = products[indexCur].id;
    let imgProduct = products[indexCur].image;
    let titleProduct = products[indexCur].title;
    let curProduct = products[indexCur].price;
    let descProduct = products[indexCur].description;
    let categoryProduct = products[indexCur].categoryName;

    let imgProductCur = document.getElementById("up-hinh-anh");
    let titleProductCur = document.getElementById("ten-mon").value;
    let curProductCur = document.getElementById("gia-moi").value;
    let descProductCur = document.getElementById("mo-ta").value;
    let categoryId = parseInt(document.getElementById("chon-mon").value);

    let imageChange = imgProductCur.files.length > 0;

    if (imageChange || titleProductCur != titleProduct || curProductCur != curProduct || descProductCur != descProduct || getCategoryValueByName(categoryId) != categoryProduct) {
        let formData = new FormData();
        if (imageChange) {
            formData.append("file", imgProductCur.files[0]);
        } else {
            formData.append("oldImage", imgProduct);
        }
        formData.append("productId", idProduct);
        formData.append("title", titleProductCur);
        formData.append("categoryId", categoryId);
        formData.append("price", parseInt(curProductCur));
        formData.append("description", descProductCur);

        fetch('http://localhost:8080/products/admin/edit', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.data) {
                products[indexCur].title = titleProductCur;
                products[indexCur].price = parseInt(curProductCur);
                products[indexCur].description = descProductCur;
                products[indexCur].categoryId = categoryId;
                if (imageChange) {
                    products[indexCur].image = URL.createObjectURL(imgProductCur.files[0]);
                } else {
                    products[indexCur].image = imgProduct;
                }
                localStorage.setItem("products", JSON.stringify(products));
                toast({ title: "Success", message: "Chỉnh sửa thành công!", type: "success", duration: 3000 });
                setDefaultValue();
                document.querySelector(".add-product").classList.remove("open");
                showProduct(currentPageAdmin);
            } else {
                toast({ title: "Error", message: "Chỉnh sửa thất bại!", type: "error", duration: 3000 });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            toast({ title: "Error", message: "Có lỗi xảy ra!", type: "error", duration: 3000 });
        });
    } else {
        toast({ title: "Warning", message: "Sản phẩm của bạn không thay đổi!", type: "warning", duration: 3000, });
    }


});

// Thêm sản phẩm
let btnAddProductIn = document.getElementById("add-product-button");
btnAddProductIn.addEventListener("click", (e) => {
    e.preventDefault();
    let fileInput = document.getElementById("up-hinh-anh");
    let tenMon = document.getElementById("ten-mon").value;
    let price = document.getElementById("gia-moi").value;
    let moTa = document.getElementById("mo-ta").value;
    let categoryText = document.getElementById("chon-mon").value;
    if(tenMon == "" || price == "" || moTa == "") {
        toast({ title: "Chú ý", message: "Vui lòng nhập đầy đủ thông tin món!", type: "warning", duration: 3000, });
    } else {
        if(isNaN(price)) {
            toast({ title: "Chú ý", message: "Giá phải ở dạng số!", type: "warning", duration: 3000, });
        } else {
            let formData = new FormData();
            formData.append("file", fileInput.files[0]);
            formData.append("title", tenMon);
            formData.append("categoryId", parseInt(categoryText));
            formData.append("price", parseInt(price));
            formData.append("description", moTa);

            fetch('http://localhost:8080/products/admin/create', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => response.json())
            .then(data =>{
                if(data.success){
                    toast({ title: "Success", message: "Thêm sản phẩm thành công!", type: "success", duration: 3000 });
                    setDefaultValue();
                    document.querySelector(".add-product").classList.remove("open");
                    showProduct(currentPageAdmin);
                }
            })
        }
    }
});

function uploadImage(input) {
    let file = input.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function(event) {
            let imgPreview = document.querySelector(".upload-image-preview");
            imgPreview.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
}

document.querySelector(".modal-close.product-form").addEventListener("click",() => {
    setDefaultValue();
})

function setDefaultValue() {
    document.querySelector(".upload-image-preview").src = "./assets/img/blank-image.png";
    document.getElementById("ten-mon").value = "";
    document.getElementById("gia-moi").value = "";
    document.getElementById("mo-ta").value = "";
    document.getElementById("chon-mon").value = "Món chay";
}

// Open Popup Modal
let btnAddProduct = document.getElementById("btn-add-product");
btnAddProduct.addEventListener("click", () => {
    document.querySelectorAll(".add-product-e").forEach(item => {
        item.style.display = "block";
    })
    document.querySelectorAll(".edit-product-e").forEach(item => {
        item.style.display = "none";
    })
    document.querySelector(".add-product").classList.add("open");
});

// Close Popup Modal
let closePopup = document.querySelectorAll(".modal-close");
let modalPopup = document.querySelectorAll(".modal");

for (let i = 0; i < closePopup.length; i++) {
    closePopup[i].onclick = () => {
        modalPopup[i].classList.remove("open");
    };
}

// Lấy tất cả đơn hàng của khách hàng
async function fetchAllOrders() {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8080/order/admin/getall', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch orders');
    }

    const orders = await response.json();
    return orders;
}

async function fetchProducts() {
    let response = await fetch('http://localhost:8080/products/all');
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    let products = await response.json();
    return products.data;
}

async function fetchOrderDetails(orderId) {
    let response = await fetch(`http://localhost:8080/order/details/${orderId}`);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    let orderDetails = await response.json();
    return orderDetails.data;   
}

// User
let addAccount = document.getElementById('signup-button');
let updateAccount = document.getElementById("btn-update-account")

document.querySelector(".modal.signup .modal-close").addEventListener("click",() => {
    signUpFormReset();
})

function openCreateAccount() {
    document.querySelector(".signup").classList.add("open");
    document.querySelectorAll(".edit-account-e").forEach(item => {
        item.style.display = "none"
    })
    document.querySelectorAll(".add-account-e").forEach(item => {
        item.style.display = "block"
    })
}

function signUpFormReset() {
    document.getElementById('role-admin').checked = false;
    document.querySelector('.form-message-name').innerHTML = '';
    document.querySelector('.form-message-phone').innerHTML = '';
    document.querySelector('.form-message-password').innerHTML = '';
}

function showUserArr(arr) {
    
    let accountHtml = '';
    if(arr.length == 0) {
        accountHtml = `<td colspan="5">Không có dữ liệu</td>`
    } else {
        let i=1;
        arr.forEach((account, index) => {
                let tinhtrang = account.status == 0 ? `<span class="status-no-complete">Bị khóa</span>` : `<span class="status-complete">Hoạt động</span>`;
                let lockButton = account.status == 0 
                ? `<button class="btn-unlock" id="unlock-account" onclick="unlockAccount('${account.userName}')"><i class="fa-solid fa-lock-open"></i></button>` 
                : `<button class="btn-lock" id="lock-account" onclick="lockAccount('${account.userName}')"><i class="fa-solid fa-lock"></i></button>`;
                accountHtml += 
                ` <tr>
                    <td>${i}</td>
                    <td>${account.fullName}</td>
                    <td>${account.userName}</td>
                    <td>${formatDate(account.createDate)}</td>
                    <td>${tinhtrang}</td>
                    <td class="control control-table">
                    <button class="btn-edit" id="edit-account" onclick='editAccount(${account.userName})' ><i class="fa-light fa-pen-to-square"></i></button>
                    ${lockButton}                    
                    <button class="btn-delete" id="delete-account" onclick="deleteAcount('${account.userName}')"><i class="fa-regular fa-trash"></i></button>
                    </td>
                </tr>`
                i+=1;
        })
    }
    document.getElementById('show-user').innerHTML = accountHtml;
}


function showUser() {
    let tinhTrang = parseInt(document.getElementById("tinh-trang-user").value);
    let ct = document.getElementById("form-search-user").value;
    let timeStart = document.getElementById("time-start-user").value;
    let timeEnd = document.getElementById("time-end-user").value;

    if (timeEnd < timeStart && timeEnd != "" && timeStart != "") {
        alert("Lựa chọn thời gian sai !");
        return;
    }
    fetch(`http://localhost:8080/user`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}` 
        }
    })
    .then(response => {
        return response.json();
    })
    .then(accounts => {
        localStorage.setItem('accounts', JSON.stringify(accounts));
        let result=[];
        if (tinhTrang === 2) {
            result = accounts.filter(item => item.roleId === 2);
        } else if(tinhTrang === 3) {
            result = accounts.filter(item => item.roleId === 1 && item.userName !== rootAdmin);
        } else if(tinhTrang === 1){
            result = accounts.filter(item => item.roleId === 2 && item.status === 1);
        } else if(tinhTrang===0){
            result = accounts.filter(item => item.roleId === 2 && item.status === 0);
        }

        if (ct !== "") {
            result = result.filter(item => 
                item.fullName.toLowerCase().includes(ct.toLowerCase()) || 
                item.userName.toString().toLowerCase().includes(ct.toLowerCase())
            );
        }

        if (timeStart !== "" && timeEnd === "") {
            result = result.filter(item => new Date(item.createDate) >= new Date(timeStart).setHours(0, 0, 0));
        } else if (timeStart === "" && timeEnd !== "") {
            result = result.filter(item => new Date(item.createDate) <= new Date(timeEnd).setHours(23, 59, 59));
        } else if (timeStart !== "" && timeEnd !== "") {
            result = result.filter(item => 
                new Date(item.createDate) >= new Date(timeStart).setHours(0, 0, 0) && 
                new Date(item.createDate) <= new Date(timeEnd).setHours(23, 59, 59)
            );
        }
        showUserArr(result);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}


function cancelSearchUser() {
    let accounts = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")).filter(item => item.userType == 0) : [];
    showUserArr(accounts);
    document.getElementById("tinh-trang-user").value = 2;
    document.getElementById("form-search-user").value = "";
    document.getElementById("time-start-user").value = "";
    document.getElementById("time-end-user").value = "";
}

window.onload = function() {
    document.getElementById("tinh-trang-user").value = "2";
    showUser();
};

// Xóa người dùng
function deleteAcount(phone) {
    let accounts = JSON.parse(localStorage.getItem('accounts'));
    let index = accounts.find(item => item.userName == phone);
    if (confirm("Bạn có chắc muốn xóa?")) {
        fetch(`http://localhost:8080/user/admin/delete/${index.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}` 
            }
        }).then(response => response.json())
        .then(data => {
            if(data.data==true){
                localStorage.setItem("accounts",JSON.stringify(accounts));
                toast({
                    title: 'Thành công',
                    message: 'Xóa người dùng thành công!',
                    type: 'success',
                    duration: 3000
                });
                showUser()
            }
        })
    }
}


//Khóa người dùng
function lockAccount(phone) {
    let accounts = JSON.parse(localStorage.getItem('accounts'));
    let index = accounts.find(item => item.userName == phone);
    if (confirm("Bạn có chắc muốn khóa?")) {
        fetch(`http://localhost:8080/user/admin/lock/${index.id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}` 
            }
        }).then(response => response.json())
        .then(data => {
            if(data.data==true){
                localStorage.setItem("accounts",JSON.stringify(accounts));
                toast({
                    title: 'Thành công',
                    message: 'Đã khóa tài khoản này!',
                    type: 'success',
                    duration: 3000
                });
                showUser()
            }
        })
    }
}

// Mở khóa người dùng
function unlockAccount(phone) {
    let accounts = JSON.parse(localStorage.getItem('accounts'));
    let index = accounts.find(item => item.userName == phone);
    if (confirm("Bạn có chắc muốn mở khóa?")) {
        fetch(`http://localhost:8080/user/admin/unlock/${index.id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}` 
            }
        }).then(response => response.json())
        .then(data => {
            if(data.data==true){
                localStorage.setItem("accounts",JSON.stringify(accounts));
                toast({
                    title: 'Thành công',
                    message: 'Đã mở khóa tài khoản này!',
                    type: 'success',
                    duration: 3000
                });
                showUser()
            }
        })
    }
}

//Phân quyền cho người dùng
let indexFlag;
function editAccount(phone) {
    document.querySelector(".signup").classList.add("open");
    document.querySelectorAll(".add-account-e").forEach(item => {
        item.style.display = "none"
    })
    document.querySelectorAll(".edit-account-e").forEach(item => {
        item.style.display = "block"
    })
    let accounts = JSON.parse(localStorage.getItem("accounts"));
    for (const item of accounts) {
        if(item.userName==phone){
            indexFlag=item.id;
            document.getElementById("fullname").value = item.fullName;
            document.getElementById("phone").value = item.userName;
            document.getElementById("email").value = item.email;
            document.getElementById("role-admin").checked = item.roleId == 1 ? true : false;    
            break;
        }
    }
}

updateAccount.addEventListener("click", (e) => {
    e.preventDefault();
    let accounts = JSON.parse(localStorage.getItem("accounts"));
    console.log(indexFlag);
    let isAdminChecked = document.querySelector('#role-admin').checked;
    let roleId = isAdminChecked ? 1 : 2;
    let editUserRequest = {
        userId: indexFlag,
        roleId: roleId
    };
    fetch('http://localhost:8080/user/admin/edit', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(editUserRequest)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Có lỗi xảy ra khi cập nhật người dùng.');
        }
    })
    .then(data => {
        console.log(data);
        toast({ title: 'Thành công', message: 'Thay đổi quyền thành công !', type: 'success', duration: 3000 });
        localStorage.setItem("accounts", JSON.stringify(accounts));
        document.querySelector(".signup").classList.remove("open");
        signUpFormReset();
        showUser();
    })
    .catch(error => {
        toast({ title: 'Lỗi', message: error.message, type: 'error', duration: 3000 });
    });
});

// Tạo tài khoản admin cho người dùng
addAccount.addEventListener("click", (e) => {
    e.preventDefault();
    let fullNameUser = document.getElementById('fullname').value;
    let phoneUser = document.getElementById('phone').value;
    let passwordUser = document.getElementById('password').value;
    let emailUser=document.getElementById('email').value;
    let isAdminChecked = document.querySelector('#role-admin').checked;
    // Check validate
    let fullNameIP = document.getElementById('fullname');
    let formMessageName = document.querySelector('.form-message-name');
    let formMessagePhone = document.querySelector('.form-message-phone');
    let formMessageEmail = document.querySelector('.form-message-email');
    let formMessagePassword = document.querySelector('.form-message-password');

    let isValid=true;

    if (fullNameUser.length == 0) {
        formMessageName.innerHTML = 'Vui lòng nhập họ vâ tên';
        fullNameIP.focus();
        isValid=false;
    } else if (fullNameUser.length < 3) {
        fullNameIP.value = '';
        formMessageName.innerHTML = 'Vui lòng nhập họ và tên lớn hơn 3 kí tự';
        isValid = false;
    }
    
    if (emailUser.length==0){
        formMessageEmail.innerHTML = 'Vui lòng nhập vào email';
        isValid = false;
    } else if(!emailIsValid(emailUser)){
        formMessageEmail.innerHTML = 'Vui lòng nhập vào email đúng định dạng';
        document.getElementById('email').value = '';
        isValid = false;
    }

    if (phoneUser.length == 0) {
        formMessagePhone.innerHTML = 'Vui lòng nhập vào số điện thoại';
        isValid = false;
    } else if (phoneUser.length != 10) {
        formMessagePhone.innerHTML = 'Vui lòng nhập vào số điện thoại 10 số';
        document.getElementById('phone').value = '';
        isValid = false;
    }
    
    if (passwordUser.length == 0) {
        formMessagePassword.innerHTML = 'Vui lòng nhập mật khẩu';
        isValid = false;
    } else if (passwordUser.length < 6) {
        formMessagePassword.innerHTML = 'Vui lòng nhập mật khẩu lớn hơn 6 kí tự';
        document.getElementById('password').value = '';
        isValid = false;
    }

    if (isValid) {
        let userType=isAdminChecked ? 1 : 2;
        let user = {
            fullName: fullNameUser,
            phone: phoneUser,
            password: passwordUser,
            address: '',
            email: emailUser,
            status: 1,
            joinDate: new Date().toISOString(),
            roleId: userType
        };

        fetch('http://localhost:8080/login/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                toast({ title: 'Thành công', message: 'Tạo thành công tài khoản!', type: 'success', duration: 3000 });
                document.querySelector(".signup").classList.remove("open");
                showUser();
                signUpFormReset();
            } else {
                toast({ title: 'Lỗi', message: data.message || 'Đã có lỗi xảy ra khi tạo tài khoản.', type: 'error', duration: 3000 });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            toast({ title: 'Lỗi', message: 'Không thể kết nối với máy chủ!', type: 'error', duration: 3000 });
        });
    }
})

document.getElementById("logout-acc").addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem("currentuser");
    window.location = "/index";
})

function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}