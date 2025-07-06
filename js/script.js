// NASA API key (replace DEMO_KEY with your own key if you have one)
const API_KEY = 'QRkiqbZM4LlY5YUxnNuHOP81Av6w8muuAEnePJpA';

// Function to fetch APOD data for a date range
async function fetchAPODImages(startDate, endDate) {
  // Build the API URL with the selected dates
  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;

  try {
    // Fetch data from the API
    const response = await fetch(url);
    // Convert the response to JSON
    const data = await response.json();
    // Return the array of APOD objects
    return data;
  } catch (error) {
    // Log any errors to the console
    console.error('Error fetching APOD data:', error);
    return [];
  }
}

// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Find the "Get Space Images" button and the gallery div
const getImagesBtn = document.getElementById('getImagesBtn');
const gallery = document.getElementById('gallery');

// Get modal elements
const imageModal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');
const closeModal = document.getElementById('closeModal');

// Function to open the modal with image details
function openModal(image) {
  // Set modal content using the image object
  modalImg.src = image.hdurl || image.url; // Use higher-res if available
  modalImg.alt = image.title;
  modalTitle.textContent = image.title;
  modalDate.textContent = image.date;
  modalExplanation.textContent = image.explanation;
  // Show the modal
  imageModal.style.display = 'flex';
}

// Function to close the modal
function hideModal() {
  imageModal.style.display = 'none';
}

// Close modal when user clicks the close button
closeModal.addEventListener('click', hideModal);

// Also close modal when user clicks outside the modal content
imageModal.addEventListener('click', function(event) {
  if (event.target === imageModal) {
    hideModal();
  }
});

// Function to display the gallery of images and videos
function displayGallery(images) {
  // Clear the gallery before adding new items
  gallery.innerHTML = '';

  // Loop through each item from the API
  images.forEach(image => {
    // Create a div for each gallery item
    const item = document.createElement('div');
    item.className = 'gallery-item';

    // Check if the item is an image
    if (image.media_type === 'image') {
      // Add the image, title, and date using template literals
      item.innerHTML = `
        <img src="${image.url}" alt="${image.title}" class="gallery-img">
        <h3>${image.title}</h3>
        <p>${image.date}</p>
      `;

      // When the user clicks this item, open the modal with details
      item.addEventListener('click', function() {
        openModal(image);
      });
    }
    // Check if the item is a video
    else if (image.media_type === 'video') {
      // If it's a YouTube video, embed it. Otherwise, show a link.
      let videoContent = '';
      if (image.url.includes('youtube.com') || image.url.includes('youtu.be')) {
        // Embed YouTube video using iframe
        videoContent = `
          <div class="video-wrapper">
            <iframe 
              src="${image.url.replace('watch?v=', 'embed/')}" 
              frameborder="0" 
              allowfullscreen 
              class="gallery-video"
              title="${image.title}">
            </iframe>
          </div>
        `;
      } else {
        // For other videos, provide a clickable link
        videoContent = `
          <a href="${image.url}" target="_blank" class="video-link">
            ▶️ Watch Video
          </a>
        `;
      }

      // Add video, title, and date
      item.innerHTML = `
        ${videoContent}
        <h3>${image.title}</h3>
        <p>${image.date}</p>
      `;

      // Optional: Show explanation in a modal on click
      item.addEventListener('click', function() {
        openModal(image);
      });
    }

    // Add the item to the gallery div
    gallery.appendChild(item);
  });
}

// When the user clicks the button, fetch and display images
getImagesBtn.addEventListener('click', async () => {
  // Show a loading message before fetching images
  gallery.innerHTML = '<p>🔄 Loading space photos…</p>';

  // Get the selected start and end dates :P
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Fetch images from the API :P
  const images = await fetchAPODImages(startDate, endDate);

  // Display the images in the gallery
  displayGallery(images);
});

// Array of fun "Did You Know?" space facts
const spaceFacts = [
  "Did you know? A day on Venus is longer than a year on Venus!",
  "Did you know? There are more stars in the universe than grains of sand on Earth.",
  "Did you know? Neutron stars can spin at a rate of 600 rotations per second.",
  "Did you know? Jupiter is so big that over 1,300 Earths could fit inside it.",
  "Did you know? The footprints on the Moon will be there for millions of years.",
  "Did you know? One million Earths could fit inside the Sun.",
  "Did you know? Space is completely silent—there’s no air to carry sound.",
  "Did you know? The hottest planet in our solar system is Venus.",
  "Did you know? The Milky Way galaxy will collide with the Andromeda galaxy in about 4 billion years.",
  "Did you know? Saturn could float in water because it’s mostly made of gas."
];

// Function to pick a random fact from the array
function getRandomFact() {
  // Generate a random index based on the length of the array
  const index = Math.floor(Math.random() * spaceFacts.length);
  return spaceFacts[index];
}

// Find or create the fact section above the gallery
let factSection = document.getElementById('spaceFact');
if (!factSection) {
  // If the section doesn't exist, create it and add it above the gallery
  factSection = document.createElement('div');
  factSection.id = 'spaceFact';
  factSection.style.margin = '24px auto 12px auto';
  factSection.style.maxWidth = '600px';
  factSection.style.background = '#1a1a2e';
  factSection.style.color = '#fff';
  factSection.style.padding = '16px';
  factSection.style.borderRadius = '8px';
  factSection.style.textAlign = 'center';
  factSection.style.fontSize = '1.1em';
  // Insert the fact section before the gallery
  gallery.parentNode.insertBefore(factSection, gallery);
}

// Set the random fact when the app loads
factSection.textContent = getRandomFact();

