
const products = [
    {
        id: 1,
        name: "Es Kopi Senja",
        category: "Kopi",
        price: 18000,
        description: "Espresso, susu creamy, dan gula aren.",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Cappuccino",
        category: "Kopi",
        price: 22000,
        description: "Espresso dengan foam susu lembut.",
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Caffe Latte",
        category: "Kopi",
        price: 24000,
        description: "Perpaduan espresso dan susu segar.",
        image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Americano",
        category: "Kopi",
        price: 16000,
        description: "Kopi hitam dengan rasa yang clean.",
        image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Matcha Latte",
        category: "Nonkopi",
        price: 23000,
        description: "Matcha dengan susu yang creamy.",
        image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Chocolate Latte",
        category: "Nonkopi",
        price: 22000,
        description: "Cokelat nikmat untuk teman santai.",
        image: "https://images.unsplash.com/photo-1542990253-0b8be8f1f3f0?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 7,
        name: "Croissant",
        category: "Makanan",
        price: 17000,
        description: "Pastry renyah dengan lapisan buttery.",
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 8,
        name: "Pancake",
        category: "Makanan",
        price: 25000,
        description: "Pancake lembut untuk sarapan santai.",
        image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=600&q=80"
    }
];

const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");

let cart = [];
let activeCategory = "Semua";

function formatRupiah(amount) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(amount);
}

// Menampilkan produk
function renderProducts() {
    const filteredProducts = activeCategory === "Semua"
        ? products
        : products.filter(product =>
            product.category === activeCategory
        );

    productGrid.innerHTML = filteredProducts.map(product => `
        <article class="product-card">
            <div class="product-image">
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >
            </div>

            <div class="product-info">
                <span class="product-category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <p class="product-description">
                    ${product.description}
                </p>

                <div class="product-bottom">
                    <span class="product-price">
                        ${formatRupiah(product.price)}
                    </span>

                    <button
                        class="add-button"
                        data-add="${product.id}"
                    >
                        + Tambah
                    </button>
                </div>
            </div>
        </article>
    `).join("");
}

// Filter kategori menu
document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");
        activeCategory = button.dataset.category;

        renderProducts();
    });
});

// Menambahkan produk ke keranjang
productGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");

    if (!button) return;

    const id = Number(button.dataset.add);
    const product = products.find(item => item.id === id);

    if (!product) return;

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    renderCart();
    openCart();
});

// Mengubah jumlah atau menghapus produk
cartItems.addEventListener("click", event => {
    const button = event.target.closest("[data-action]");

    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;
    const item = cart.find(product => product.id === id);

    if (!item) return;

    if (action === "increase") {
        item.quantity++;
    }

    if (action === "decrease") {
        item.quantity--;

        if (item.quantity <= 0) {
            cart = cart.filter(product => product.id !== id);
        }
    }

    renderCart();
});

// Menampilkan isi keranjang
function renderCart() {
    const totalQuantity = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    cartCount.textContent = totalQuantity;
    cartTotal.textContent = formatRupiah(totalPrice);

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart">
                Keranjang masih kosong ☕<br>
                Yuk, pilih menu favoritmu!
            </p>
        `;
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <h3>${item.name}</h3>
                <p>${formatRupiah(item.price)} / item</p>

                <div class="quantity-controls">
                    <button
                        data-action="decrease"
                        data-id="${item.id}"
                        aria-label="Kurangi ${item.name}"
                    >−</button>

                    <span>${item.quantity}</span>

                    <button
                        data-action="increase"
                        data-id="${item.id}"
                        aria-label="Tambah ${item.name}"
                    >+</button>
                </div>
            </div>

            <strong>
                ${formatRupiah(item.price * item.quantity)}
            </strong>
        </div>
    `).join("");
}

// Buka dan tutup keranjang
function openCart() {
    cartPanel.classList.add("show");
    overlay.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeCart() {
    cartPanel.classList.remove("show");
    overlay.classList.remove("show");
    document.body.style.overflow = "";
}

document.getElementById("openCart")
    .addEventListener("click", openCart);

document.getElementById("closeCart")
    .addEventListener("click", closeCart);

overlay.addEventListener("click", closeCart);

// Menu navigasi untuk HP
document.getElementById("menuToggle")
    .addEventListener("click", () => {
        document.getElementById("navMenu")
            .classList.toggle("open");
    });

document.querySelectorAll("#navMenu a").forEach(link => {
    link.addEventListener("click", () => {
        document.getElementById("navMenu")
            .classList.remove("open");
    });
});

// Simulasi checkout
document.getElementById("checkoutBtn")
    .addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Keranjang kamu masih kosong!");
            return;
        }

        const summary = cart.map(item =>
            `${item.name} x${item.quantity}`
        ).join("\n");

        const total = cart.reduce(
            (sum, item) => sum + item.price * item.quantity, 0
        );

        alert(
            "RINGKASAN PESANAN KOPI SENJA\n\n" +
            summary +
            "\n\nTotal: " + formatRupiah(total) +
            "\n\nIni masih simulasi. Belum ada pembayaran sungguhan."
        );
    });

// Tahun otomatis di footer
document.getElementById("year").textContent =
    new Date().getFullYear();

// Jalankan website
renderProducts();
renderCart();
