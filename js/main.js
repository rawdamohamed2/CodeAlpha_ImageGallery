let btnsfilter = document.querySelectorAll('.filter');
const searchInput = document.getElementById('searchInput');
const btnsearch = document.getElementById('btnsearch');
const lightBox = document.getElementById('lightBox');
let btnPagenavigation = document.querySelectorAll('.btnPagenavigation');
const lightboximg = document.getElementById('lightbox-img');
const photographer = document.getElementById('photographer');
const themetoggle = document.getElementById('theme-toggle');
let currentquery = 'curated';
let currentPage = 1;
let photos = [];
let currentPhotoIndex = 0;
let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
let favouritefilter = JSON.parse(localStorage.getItem('favouritefilter')) || [];
const loader = document.getElementById('loader');
let totalPages;

async function fetchImages(query,page) {
  try {
        const res = await fetch(`https://api.pexels.com/v1/search?page=${page?page:1}&per_page=12&query=${query?query:'curated'}`, {
          headers: {
            Authorization: 'RT4KC88eJi9m7MD3RDmYA3iUVfVUlCu3GP7Au6r6gXzLNECIS20jZs2X'
          }
        });
        const data = await res.json();
        let images = await data.photos;
        if (!totalPages) {
          totalPages = Math.ceil(data.total_results / data.per_page);
        }
        photos= images;
        console.log(photos);
        displayImages(images);
        currentPage=page;
        currentquery=query;
        console.log(currentquery,currentPage);
        loader.classList.add('d-none');
      } catch (err) {
        console.error('Error:', err);
        loader.classList.add('d-none');
      }
}

fetchImages(currentquery, currentPage);

function displayImages(photos) {
  if (!photos || photos.length === 0) {
    document.getElementById('galleryBox').innerHTML = '<p>No images found</p>';
    return;
  }

  let box = '';
  photos.forEach((photo, i) => {
    const isFavourite = favourites.some(fav => fav.id === photo.id);
    box += `<div class="masonry-item position-relative rounded-4 overflow-hidden hovercolimage">
              <img src="${photo.src.large}" alt="${photo.alt || 'Image from Pexels'}" 
                   data-full="${photo.src.original}" data-index="${i}" loading="lazy" 
                   class="w-100 rounded-4 hoverimg d-block" data-bs-toggle="modal" 
                   data-bs-target="#exampleModal">
              <p class="fontfamily text-white position-absolute name rounded-2">Photo by: 
                <a href="${photo.photographer_url}" class="fontfamily hoverfontcolor" target="_blank">
                  ${photo.photographer}
                </a>
              </p>
              <button type="button" class="btn position-absolute favouritebtn" onclick="addToFavourites(${i}, this)">
                <i class="${isFavourite ? 'fa-solid favouriteiconhover' : 'fa-regular favouriteicon'} fa-heart"></i>
              </button>
            </div>`;
  });

  document.getElementById('galleryBox').innerHTML = box;

  document.querySelectorAll('.masonry-item img').forEach(img => {
    img.addEventListener('click', () => {
      currentPhotoIndex = parseInt(img.dataset.index);
      displayImagemodel();
    });
  });
}

function addToFavourites(index ,btnElement) {
  const photo = photos[index];
  const favIndex = favourites.findIndex(fav => fav.id === photo.id);
  if (favIndex !== -1) {
    favourites.splice(favIndex, 1);
    favouritefilter.splice(favIndex, 1);
    localStorage.setItem('favouritefilter', JSON.stringify(favouritefilter));
    localStorage.setItem('favourites', JSON.stringify(favourites));
    btnElement.innerHTML = `<i class="fa-regular fa-heart favouriteicon"></i>`;
    showTempMessage('romoved from favourites');
  }
  else{
  favourites.push(photo);
  favouritefilter.push(currentquery);
  localStorage.setItem('favouritefilter', JSON.stringify(favouritefilter));
  localStorage.setItem('favourites', JSON.stringify(favourites));
  btnElement.innerHTML = `<i class="fa-solid fa-heart favouriteiconhover"></i>`;
  showTempMessage('Added to favourites');
}
}

function showTempMessage(text) {
  const msg = document.createElement('div');
  msg.textContent = text;
  msg.className = 'position-fixed top-0 start-50 translate-middle-x bg-dark text-white px-3 py-2 rounded-3 z-3';
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 2000);
}


function displayImagemodel() {
  const photo = photos[currentPhotoIndex];
  lightboximg.src = photo.src.large || photo.src.medium;
  photographer.innerHTML = `Photo by: <a href="${photo.photographer_url}" class="hoverfontcolor" target="_blank">${photo.photographer}</a>`;

  const nextIndex = (currentPhotoIndex + 1) % photos.length;
  const prevIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;

  new Image().src = photos[nextIndex].src.medium;
  new Image().src = photos[prevIndex].src.medium;
}

function previousLightbox() {
  if (!photos) {return;}
  else if (currentPhotoIndex === 0) {
    currentPhotoIndex = photos.length - 1;
    displayImagemodel();
  }
  else{
    currentPhotoIndex --;
    displayImagemodel();
  }
  
}

function nextLightbox() {
  if (!photos) return;
  else if (currentPhotoIndex === photos.length - 1) {
    currentPhotoIndex = 0;
    displayImagemodel();
  }
  else{
    currentPhotoIndex++;
    displayImagemodel();
  }
  
}


btnsfilter.forEach(btn => {
  btn.addEventListener('click', () => {
    loader.classList.remove('d-none');
    const filter = btn.dataset.filter;
    if (filter !== currentquery) {
      btnsfilter.forEach(otherBtn => otherBtn.classList.remove('active'));
      btn.classList.add('active');
      currentquery = filter;
      currentPage = 1;
      fetchImages(filter, currentPage);
    }
  });
});

btnsearch.addEventListener('click', () => {
  btnsfilter.forEach(btn => btn.classList.remove('active'));
  loader.classList.remove('d-none');
  const query = searchInput.value;
  if (query) {
    fetchImages(query,1);
  }
  else{
    fetchImages('curated',1);
  }
  searchInput.value="";
});



btnPagenavigation.forEach(btn => {
  btn.addEventListener('click', () => {
    const page = btn.dataset.page;
    if (page === "Previous") {
      loader.classList.remove('d-none');
      loader.classList.add('heightleaderdownload')
      loader.classList.remove('heightleader');
      previousPage();
    } else if (page === "Next") {
      loader.classList.remove('d-none');
      loader.classList.add('heightleaderdownload')
      loader.classList.remove('heightleader');
      nextPage();
    }
  });
});

function nextPage() {

  if (currentPage < totalPages) {
    currentPage++;
    fetchImages(currentquery, currentPage);
  } else {
    loader.classList.add('d-none');
    showTempMessage('You reached the last page');
    loader.classList.add('heightleader')
    loader.classList.remove('heightleaderdownload');
  }
 
}

function previousPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchImages(currentquery, currentPage);
  } else {
    showTempMessage('Already on the first page');
    loader.classList.add('d-none');
    loader.classList.add('heightleader')
    loader.classList.remove('heightleaderdownload');
  }
}

themetoggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  themetoggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});
