const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const button = document.querySelector('button');
const gallery = document.getElementById('gallery');

// Setup default dates
setupDateInputs(startInput, endInput);

// Listen for button click
button.addEventListener('click', () => {
  const startDate = startInput.value;
  const endDate = endInput.value;
  fetchImages(startDate, endDate);
});

async function fetchImages(start, end) {
  // Clear gallery and show loading
  gallery.innerHTML = '<p>🔄Loading space photos...</p>';

  try {
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=1pAWKFA4QswtrOe0vxL7Qrt6tCOaMSf2D6JH6D9x&start_date=${start}&end_date=${end}`
    );
    const data = await response.json();

    // If error message received from API
    if (data.error) throw new Error(data.error.message);

    // Clear the gallery and populate with new data
    gallery.innerHTML = '';
    data.reverse().forEach(item => {
      if (item.media_type === 'image') {
        const card = document.createElement('div');
        card.className = 'gallery-item';

        card.innerHTML = `
          <img src="${item.url}" alt="${item.title}" />
          <p class="gallery-title">${item.title}</p>
          <p class="gallery-date">${item.date}</p>
        `;

        // Add click listener to open modal with image details
        card.addEventListener('click', () => {
          openModal(item);
        });

        gallery.appendChild(card);
      }
});

    // If no images matched
    if (gallery.innerHTML === '') {
      gallery.innerHTML = '<p>No image data available for the selected range.</p>';
    }
  } catch (error) {
    gallery.innerHTML = `<p>Error fetching data</p>`;
  }
}

const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalDate = document.getElementById('modal-date');
const modalExplanation = document.getElementById('modal-explanation');
const modalClose = document.getElementById('modal-close');

// Open modal with image data
function openModal(item) {
  modalImage.src = item.hdurl || item.url;
  modalImage.alt = item.title;
  modalTitle.textContent = item.title;
  modalDate.textContent = item.date;
  modalExplanation.textContent = item.explanation;
  modal.classList.remove('hidden');
}

// Close modal
modalClose.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// Close modal when clicking outside modal-content
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
  }
});