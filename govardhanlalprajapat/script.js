// ==========================================
// GOVARDHAN LAL PRAJAPAT PROFILE
// DigiProfiles | script.js
// ==========================================

"use strict";

// Current year automatically update
function updateCurrentYear() {
  const yearElement = document.getElementById("current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// Create a gallery card safely
function createGalleryCard(item) {
  const card = document.createElement("article");
  card.className = "gallery-card";

  const image = document.createElement("img");
  image.src = item.src;
  image.alt = item.alt || `${item.hi} - ${item.en}`;
  image.loading = "lazy";
  image.decoding = "async";

  const caption = document.createElement("h3");
  caption.textContent = `${item.hi} · ${item.en}`;

  card.appendChild(image);
  card.appendChild(caption);

  // Show a message if an image is missing
  image.addEventListener("error", () => {
    card.classList.add("image-error");
    image.alt = "फोटो उपलब्ध नहीं · Photo unavailable";
  });

  return card;
}

// Load gallery from images.json
async function loadGallery() {
  const gallery = document.getElementById("gallery-grid");

  if (!gallery) return;

  try {
    const response = await fetch("./images.json");

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data.gallery)) {
      throw new Error("Gallery list is missing in images.json");
    }

    gallery.replaceChildren();

    if (data.gallery.length === 0) {
      gallery.textContent =
        "अभी कोई फोटो उपलब्ध नहीं · No photos available yet.";
      return;
    }

    data.gallery.forEach((item) => {
      if (!item.src || !item.hi || !item.en) {
        console.warn("Invalid gallery entry:", item);
        return;
      }

      gallery.appendChild(createGalleryCard(item));
    });

    if (!gallery.children.length) {
      gallery.textContent =
        "अभी कोई फोटो उपलब्ध नहीं · No photos available yet.";
    }
  } catch (error) {
    console.error("Gallery loading failed:", error);

    gallery.textContent =
      "फोटो गैलरी लोड नहीं हो सकी। कृपया बाद में प्रयास करें। " +
      "Gallery could not load. Please try again later.";
  }
}

// Start website features
document.addEventListener("DOMContentLoaded", () => {
  updateCurrentYear();
  loadGallery();
});