// =====================================================
// GOVARDHAN LAL PRAJAPAT - FOLDER WISE GALLERY
// File: script.js
// Data source: gallery-index.js
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
    const galleryContainer = document.getElementById("folder-sections");
    const statusElement = document.getElementById("gallery-status");

    if (!galleryContainer) {
        console.error("Gallery container #folder-sections nahi mila.");
        return;
    }

    // Folder ka naam readable banana
    function formatFolderName(name) {
        const titles = {
            "Achievements": "उपलब्धियां | Achievements",
            "Sant-Sewa": "संत सेवा | Sant Sewa",
            "Political-Programs": "राजनीतिक कार्यक्रम | Political Programs",
            "Social-Work": "समाज सेवा | Social Work"
        };

        return titles[name] ||
            name.replace(/[-_]/g, " ");
    }

    // Image filename ko caption banana
    function formatImageName(path) {
        const filename = path.split("/").pop();
        return decodeURIComponent(filename)
            .replace(/\.[^/.]+$/, "")
            .replace(/[-_]/g, " ");
    }

    // Gallery render karna
    function renderGallery() {
        const galleryData = window.GALLERY_INDEX;

        if (!Array.isArray(galleryData)) {
            if (statusElement) {
                statusElement.textContent =
                    "Gallery data nahi mila. gallery-index.js file check karein.";
            }

            console.error(
                "window.GALLERY_INDEX nahi mila. Pehle gallery-index.js generate karein."
            );
            return;
        }

        galleryContainer.innerHTML = "";

        const foldersWithImages = galleryData.filter(
            folder => Array.isArray(folder.images) &&
                      folder.images.length > 0
        );

        if (foldersWithImages.length === 0) {
            if (statusElement) {
                statusElement.textContent =
                    "Abhi gallery mein koi photo nahi hai.";
            }
            return;
        }

        if (statusElement) {
            statusElement.textContent = "";
        }

        foldersWithImages.forEach(folder => {
            const section = document.createElement("section");
            section.className = "gallery-section";

            const heading = document.createElement("h2");
            heading.className = "gallery-section-title";
            heading.textContent = formatFolderName(folder.folder);

            const grid = document.createElement("div");
            grid.className = "gallery-grid";

            folder.images.forEach(imagePath => {
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

                // Image load nahi hui to broken card hide karna
                image.addEventListener("error", () => {
                    card.remove();
                    console.error("Image load nahi hui:", imagePath);
                });

                // Photo par click karne se badi photo kholna
                image.style.cursor = "zoom-in";

                image.addEventListener("click", () => {
                    openImage(imagePath, formatImageName(imagePath));
                });

                card.append(image, caption);
                grid.appendChild(card);
            });

            section.append(heading, grid);
            galleryContainer.appendChild(section);
        });
    }

    // Full-size image overlay
    function openImage(src, altText) {
        const overlay = document.createElement("div");
        overlay.className = "gallery-lightbox";

        Object.assign(overlay.style, {
            position: "fixed",
            inset: "0",
            background: "rgba(0,0,0,0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: "99999",
            cursor: "zoom-out"
        });

        const fullImage = document.createElement("img");
        fullImage.src = src;
        fullImage.alt = altText;

        Object.assign(fullImage.style, {
            maxWidth: "100%",
            maxHeight: "90vh",
            objectFit: "contain",
            borderRadius: "8px"
        });

        const closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.textContent = "✕";

        Object.assign(closeButton.style, {
            position: "absolute",
            top: "15px",
            right: "20px",
            padding: "8px 14px",
            fontSize: "24px",
            color: "#fff",
            background: "#222",
            border: "0",
            borderRadius: "8px",
            cursor: "pointer"
        });

        const closeOverlay = () => overlay.remove();

        closeButton.addEventListener("click", closeOverlay);

        overlay.addEventListener("click", event => {
            if (event.target === overlay) {
                closeOverlay();
            }
        });

        document.addEventListener("keydown", function handleEscape(event) {
            if (event.key === "Escape") {
                closeOverlay();
                document.removeEventListener("keydown", handleEscape);
            }
        });

        overlay.append(fullImage, closeButton);
        document.body.appendChild(overlay);
    }

    // gallery-index.js, script.js se pehle load hona chahiye
    renderGallery();
});
