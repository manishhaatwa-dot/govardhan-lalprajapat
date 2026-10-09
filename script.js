// =====================================================
// GOVARDHAN LAL PRAJAPAT PROFILE
// File: script.js
// Automatic folder-wise photo gallery
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
    const galleryContainer = document.getElementById("folder-sections");
    const statusElement = document.getElementById("gallery-status");
    const yearElement = document.getElementById("current-year");

    // Footer year
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    if (!galleryContainer) {
        console.error("Gallery container not found.");
        return;
    }

    // Folder name ko readable banana
    function formatFolderName(name) {
        return name
            .replace(/[-_]+/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    // Photo ke filename ko caption banana
    function formatImageName(path) {
        const filename = path.split("/").pop();

        try {
            return decodeURIComponent(filename)
                .replace(/\.[^.]+$/, "")
                .replace(/[-_]+/g, " ")
                .replace(/\s+/g, " ")
                .trim();
        } catch {
            return filename.replace(/\.[^.]+$/, "");
        }
    }

    // Accessible full-size photo viewer
    function openImage(src, caption) {
        const overlay = document.createElement("div");
        overlay.className = "gallery-lightbox";
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.setAttribute("aria-label", caption);

        Object.assign(overlay.style, {
            position: "fixed",
            inset: "0",
            zIndex: "99999",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "12px",
            padding: "20px",
            background: "rgba(0,0,0,0.94)"
        });

        const image = document.createElement("img");
        image.src = src;
        image.alt = caption;

        Object.assign(image.style, {
            maxWidth: "100%",
            maxHeight: "82vh",
            objectFit: "contain",
            borderRadius: "8px"
        });

        const title = document.createElement("p");
        title.textContent = caption;
        title.style.color = "#ffffff";
        title.style.textAlign = "center";

        const closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.textContent = "✕ बंद करें";
        closeButton.setAttribute("aria-label", "फोटो बंद करें");

        Object.assign(closeButton.style, {
            padding: "10px 18px",
            border: "0",
            borderRadius: "8px",
            background: "#ffffff",
            color: "#222222",
            cursor: "pointer",
            fontSize: "16px"
        });

        function closeViewer() {
            overlay.remove();
            document.removeEventListener("keydown", handleKeydown);
        }

        function handleKeydown(event) {
            if (event.key === "Escape") {
                closeViewer();
            }
        }

        closeButton.addEventListener("click", closeViewer);

        overlay.addEventListener("click", event => {
            if (event.target === overlay) {
                closeViewer();
            }
        });

        document.addEventListener("keydown", handleKeydown);

        overlay.append(image, title, closeButton);
        document.body.appendChild(overlay);
        closeButton.focus();
    }

    // Gallery display
    function renderGallery() {
        const galleryData = window.GALLERY_INDEX;

        if (!Array.isArray(galleryData)) {
            if (statusElement) {
                statusElement.textContent =
                    "गैलरी लोड नहीं हुई। कृपया कुछ देर बाद फिर प्रयास करें।";
            }

            console.error(
                "GALLERY_INDEX missing. Check gallery-index.js and GitHub Actions."
            );
            return;
        }

        galleryContainer.replaceChildren();

        let displayedImages = 0;

        galleryData.forEach(folder => {
            if (
                !folder ||
                typeof folder.folder !== "string" ||
                !Array.isArray(folder.images) ||
                folder.images.length === 0
            ) {
                return;
            }

            const section = document.createElement("section");
            section.className = "gallery-section";

            const heading = document.createElement("h2");
            heading.className = "gallery-section-title";
            heading.textContent = formatFolderName(folder.folder);

            const grid = document.createElement("div");
            grid.className = "gallery-grid";

            folder.images.forEach(imagePath => {
                if (typeof imagePath !== "string") return;

                const card = document.createElement("article");
                card.className = "gallery-card";

                const image = document.createElement("img");
                image.src = imagePath;
                image.alt = formatImageName(imagePath);
                image.loading = "lazy";
                image.decoding = "async";

                const caption = document.createElement("p");
                caption.className = "gallery-caption";
                caption.textContent = formatImageName(imagePath);

                image.addEventListener("error", () => {
                    card.remove();
                    console.error("Unable to load image:", imagePath);

                    if (grid.children.length === 0) {
                        section.remove();
                    }
                });

                image.addEventListener("click", () => {
                    openImage(imagePath, caption.textContent);
                });

                card.append(image, caption);
                grid.appendChild(card);
                displayedImages++;
            });

            if (grid.children.length > 0) {
                section.append(heading, grid);
                galleryContainer.appendChild(section);
            }
        });

        if (statusElement) {
            statusElement.textContent = displayedImages > 0
                ? ""
                : "अभी फोटो गैलरी में कोई तस्वीर उपलब्ध नहीं है।";
        }
    }

    renderGallery();
});
