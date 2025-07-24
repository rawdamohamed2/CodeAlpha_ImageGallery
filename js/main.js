let btnsfilter = document.querySelectorAll('.btnfilter');
const searchInput = document.getElementById('searchInput');
const btnsearch = document.getElementById('btnsearch');
const lightBox = document.getElementById('lightBox');
let btnPagenavigation = document.querySelectorAll('.btn-Pagenavigation');
const lightboximg = document.getElementById('lightbox-img');
const photographer = document.getElementById('photographer');
const themetoggle = document.getElementById('theme-toggle');
let oldfavourites = JSON.parse(localStorage.getItem('favourites')) || [];
let currentQuery = 'curated';
let currentPage = 1;
let currentFilter = 'all';
let photos = [];
let currentPhotoIndex = 0;
let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
let favouritefilter = JSON.parse(localStorage.getItem('favouritefilter')) || [];
const loader = document.getElementById('loader');
async function fetchImages(query,page = 1,perPage = 20) {

  const res = query === 'curated'
    ? `https://api.pexels.com/v1/curated?page=${page}&per_page=${perPage}`
    : `https://api.pexels.com/v1/search?query=${query}&page=${page}&per_page=${perPage}`;

  try {
      const response = await fetch(res, {
        headers: {
                Authorization: 'RT4KC88eJi9m7MD3RDmYA3iUVfVUlCu3GP7Au6r6gXzLNECIS20jZs2X'
            }
        });
        const data = await response.json();
        let images = await data.photos;
        photos=images;
        console.log(photos);
        localStorage.setItem('pexelsPhotos', JSON.stringify(images)); 
        currentPage=page;
        currentQuery=query || 'curated';
        displayImages(images);
        loader.classList.add('d-none');     
      } catch (err) {
        console.error('Error:', err);
      }
}
fetchImages();

function displayImages(photos){
  let box = '';
  for(let i=0;i<photos.length;i++){
     const isFavourite = favourites.some(fav => fav.id === photos[i].id);
      box += `<div class="masonry-item  position-relative rounded-4 overflow-hidden hovercolimage">
                          <img src="${photos[i].src.original}" alt="${photos[i].alt || 'Image from Pexels'}" data-full="${photos[i].src.original}" data-index="${i}" loading="lazy" class="w-100 rounded-4 hoverimg d-block">
                          <p class="fontfamily text-white position-absolute name rounded-2">Photo by: 
                            <a href="${photos[i].photographer_url}" class="fontfamily hoverfontcolor" target="_blank">
                              ${photos[i].photographer}
                            </a>
                          </p>
                         <button type="button" class="btn position-absolute favouritebtn" onclick="addToFavourites(${i}, this)">
                          <i class="${isFavourite ? 'fa-solid favouriteiconhover' : 'fa-regular favouriteicon'} fa-heart "></i>
                        </button>
                      </div>`;

    }
    document.getElementById('galleryBox').innerHTML = box;

    document.querySelectorAll('.masonry-item img').forEach(img => {
        img.addEventListener('click', () => {
            currentPhotoIndex = img.dataset.index;
            openLightbox();
        });
    });
}

function addToFavourites(index ,btnElement) {
  const photo = photos[index];
  if (favourites.some(fav => fav.id === photo.id)) {
    alert('Image already added to favourites!');
    return;
  }
  else{
  favourites.push(photo);
  favouritefilter.push(currentQuery);
  localStorage.setItem('favouritefilter', JSON.stringify(favouritefilter));
  console.log(favouritefilter);
  localStorage.setItem('favourites', JSON.stringify(favourites));
  console.log(favourites);
  btnElement.innerHTML = `<i class="fa-solid fa-heart favouriteiconhover"></i>`;
  // alert('Image added to favourites!');
}
}

function openLightbox() {
  const photo = photos[currentPhotoIndex];
  lightBox.classList.add('d-block');
  lightBox.classList.remove('d-none');
  lightboximg.src = photo.src.original;
  photographer.innerHTML = `Photo by: <a href="${photo.photographer_url}" class="hoverfontcolor" target="_blank">${photo.photographer}</a>`;
}
function closeLightbox(){
  lightBox.classList.add('d-none');
  lightBox.classList.remove('d-block');
}
function previousLightbox(){
  currentPhotoIndex--;
  openLightbox(currentPhotoIndex);

}
function nextLightbox(){
  currentPhotoIndex++;
  openLightbox(currentPhotoIndex); 
}

btnsfilter.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    if (filter !== currentFilter) {
      btnsfilter.forEach(otherBtn => otherBtn.classList.remove('active'));
      btn.classList.add('active');
      btn.classList.add('active');
      currentFilter = filter;
      currentPage = 1;
      fetchImages(filter, currentPage);
    }
  });
});

btnsearch.addEventListener('click', () => {
  const query = searchInput.value;
  if (query) {
    fetchImages(query);
  }
  else{
    fetchImages('curated');
  }
  searchInput.value="";
});

btnPagenavigation.forEach(btn => {
  btn.addEventListener('click', () => {
    const page = btn.dataset.page;
    if (page==="Previous" && currentPage > 1) {
      currentPage--;
      fetchImages(currentFilter, currentPage);
    } else if (page==="Next") {
      currentPage++;
      fetchImages(currentFilter, currentPage);
    }
  });
});

themetoggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themetoggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});
