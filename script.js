
/* ==========================================
   Nova Web Impact - JAVASCRIPT PRINCIPAL
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ======================================
       1. ANNÉE AUTOMATIQUE
    ====================================== */

    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    /* ======================================
       2. MENU MOBILE
    ====================================== */

    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (menuToggle && navMenu) {

        function closeMenu() {
            navMenu.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Ouvrir le menu"
            );

            menuToggle.textContent = "☰";
        }

        menuToggle.addEventListener("click", () => {

            const isOpen = navMenu.classList.toggle("active");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Fermer le menu" : "Ouvrir le menu"
            );

            menuToggle.textContent = isOpen ? "✕" : "☰";
        });

        // Fermer le menu lorsqu'on clique sur un lien
        navMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeMenu);
        });

        // Fermer avec la touche Échap
        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        // Fermer si l'écran devient plus large
        window.addEventListener("resize", () => {
            if (window.innerWidth > 800) {
                closeMenu();
            }
        });

    }


    /* ======================================
       3. FILTRES DU PORTFOLIO
    ====================================== */

    const filterButtons = document.querySelectorAll(
        ".filter-btn"
    );

    const portfolioCards = document.querySelectorAll(
        ".portfolio-card"
    );

    if (filterButtons.length && portfolioCards.length) {

        filterButtons.forEach(button => {

            button.addEventListener("click", () => {

                const selectedFilter = button.dataset.filter;

                // Mettre à jour le bouton sélectionné
                filterButtons.forEach(btn => {

                    btn.classList.remove("active");

                    btn.setAttribute(
                        "aria-pressed",
                        "false"
                    );

                });

                button.classList.add("active");

                button.setAttribute(
                    "aria-pressed",
                    "true"
                );

                // Afficher uniquement les projets correspondants
                portfolioCards.forEach(card => {

                    const category = card.dataset.category;

                    const shouldShow =
                        selectedFilter === "all" ||
                        selectedFilter === category;

                    card.classList.toggle(
                        "is-hidden",
                        !shouldShow
                    );

                });

            });

        });

    }


    /* ======================================
       4. PRÉSÉLECTION DES OFFRES
    ====================================== */

    const serviceSelect = document.getElementById("service");

    if (serviceSelect) {

        const urlParams = new URLSearchParams(
            window.location.search
        );

        const selectedOffer = urlParams.get("offre");

        const validOffers = ["start", "pro", "care"];

        if (validOffers.includes(selectedOffer)) {
            serviceSelect.value = selectedOffer;
        }

    }


    /* ======================================
       5. FORMULAIRE DE DEVIS / FORMSPREE
    ====================================== */

    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");

    if (contactForm && formStatus) {
        const submitButton = contactForm.querySelector('button[type="submit"]');

        function showStatus(message, kind = "error") {
            formStatus.textContent = message;
            formStatus.classList.remove("success", "error");
            formStatus.classList.add(kind);
        }

        contactForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            formStatus.textContent = "";
            formStatus.classList.remove("success", "error");

            if (!contactForm.reportValidity()) return;

            const endpoint = contactForm.getAttribute("action") || "";
            const configured = /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint)
                && !endpoint.endsWith("REMPLACER_ID");

            if (!configured) {
                showStatus("L'envoi en ligne n'est pas encore activé. " +
                    "Écrivez-nous à web.impact2026@gmail.com ou via WhatsApp.");
                return;
            }

            const name = String(new FormData(contactForm).get("fullname") || "").trim();
            const message = String(new FormData(contactForm).get("message") || "").trim();
            if (!name || message.length < 10) {
                showStatus("Indiquez votre nom et un message d'au moins 10 caractères.");
                return;
            }

            submitButton.disabled = true;
            submitButton.textContent = "Envoi en cours…";
            try {
                const response = await fetch(endpoint, {
                    method: "POST",
                    body: new FormData(contactForm),
                    headers: { "Accept": "application/json" }
                });

                if (response.ok) {
                    showStatus("Votre demande a été transmise. Merci d'avoir contacté Nova Web Impact !", "success");
                    contactForm.reset();
                } else {
                    showStatus("Le service n'a pas accepté votre demande. " +
                        "Veuillez réessayer ou nous écrire directement par e-mail.");
                }
            } catch (error) {
                showStatus("Impossible de contacter le service d'envoi. " +
                    "Vérifiez votre connexion ou écrivez-nous directement par e-mail.");
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = "Envoyer ma demande";
            }
        });
    }

});
