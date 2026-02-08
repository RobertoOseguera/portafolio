document.addEventListener("DOMContentLoaded", () => {

    const toggle = document.getElementById("themeToggle");
    const navbar = document.querySelector(".navbar");
    const navLinks = document.querySelectorAll(".nav-link");
    const navCollapse = document.querySelector(".navbar-collapse");
    const cards = document.querySelectorAll(".product-card");

    /* =========================
        DARK MODE INTELIGENTE
    ========================== */
    const savedTheme = localStorage.getItem("theme");

    const applyTheme = (isDark) => {
        document.body.classList.toggle("dark", isDark);
        toggle.textContent = isDark ? "☀️" : "🌙";
        localStorage.setItem("theme", isDark ? "dark" : "light");
    };

    if (savedTheme) {
        applyTheme(savedTheme === "dark");
    } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        applyTheme(prefersDark);
    }

    toggle.addEventListener("click", () => {
        const isDark = !document.body.classList.contains("dark");
        applyTheme(isDark);
    });

    /* =========================
        NAVBAR QUE SE ELEVA
    ========================== */
    const handleNavbarShadow = () => {
        if (window.scrollY > 20) {
            navbar.classList.add("navbar-shadow");
        } else {
            navbar.classList.remove("navbar-shadow");
        }
    };
    window.addEventListener("scroll", handleNavbarShadow);

    /* =========================
        CERRAR MENU EN MÓVIL
    ========================== */
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (navCollapse.classList.contains("show")) {
                new bootstrap.Collapse(navCollapse).toggle();
            }
        });
    });

    /* =========================
        SCROLL SUAVE
    ========================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute("href"));
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    /* =========================
        HOVER PREMIUM CARDS
    ========================== */
    cards.forEach(card => {
        card.addEventListener("mouseenter", () => card.classList.add("hovered"));
        card.addEventListener("mouseleave", () => card.classList.remove("hovered"));
    });

});
