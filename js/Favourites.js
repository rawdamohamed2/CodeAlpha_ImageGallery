const favouriteBox = document.getElementById('favouriteBox');
const header = document.getElementById('header');
const themetoggle = document.getElementById('theme-toggle');
let btnfilter = document.querySelectorAll('.btnfilter');
let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
let favouritefilter = JSON.parse(localStorage.getItem('favouritefilter')) || 'curated';
let index = [];


function displayImages(favourites){
    let box = '';
    if (favourites.length === 0) {
        favouriteBox.classList.remove('gallery-masonry');
        box+=`<div class="rounded-4 overflow-hidden d-flex align-items-center justify-content-center  height text-center">
                <h1 class="h1noImagefound  py-5" >No Images Added</h1>
            </div>`; 

    }
    else{
        favouriteBox.classList.add('gallery-masonry');
        for (let i = 0; i < favourites.length; i++) {
        box+=`<div class="masonry-item position-relative rounded-4 overflow-hidden hovercolimage">
                    <img src="${favourites[i].src.original}" alt="${favourites[i].alt || 'Image from Pexels'}" data-full="${favourites[i].src.original}" data-index="${i}" loading="lazy" class="w-100 rounded-4 hoverimg d-block">
                    <p class="fontfamily text-white position-absolute name rounded-2">Photo by: <a href="${favourites[i].photographer_url}" class="fontfamily hoverfontcolor" target="_blank">${favourites[i].photographer}</a></p>
                    <button type="button" class="btn position-absolute favouritebtn" onclick="deteleFavourite(${i})">
                        <i class="fa-solid fa-heart favouriteiconhover"></i>
                    </button>
                </div>`;
        
        }

    }
    favouriteBox.innerHTML = box;
}
displayImages(favourites);

btnfilter.forEach(btn => {
  btn.addEventListener('click', () => {
    let filter = btn.dataset.filter;
    index = [];

    if (filter === 'Other') {
      for (let i = 0; i < favouritefilter.length; i++) {
        if ( favouritefilter[i] !== 'curated' && favouritefilter[i] !== 'Nature' && favouritefilter[i] !== 'Art' && favouritefilter[i] !== 'Travel' && favouritefilter[i] !== 'Architecture') {
            favouriteBox.classList.add('gallery-masonry');
            index.push(i);
        }
      }
      displayimagesfilter(index);
    } 
    else if (filter === 'All') {
      displayImages(favourites);
    } 
    else {
      for (let i = 0; i < favouritefilter.length; i++) {
        if (favouritefilter[i] === filter) {
          index.push(i);
        }
      }
      displayimagesfilter(index);
    }

    
    btnfilter.forEach(otherBtn => otherBtn.classList.remove('active'));
    btn.classList.add('active');
  });
});

function displayimagesfilter(index) {
    let filterimages = [];

    for (let i = 0; i < index.length; i++) {
            filterimages.push(favourites[index[i]]);
    }

     if (filterimages.length === 0) {
        let box = '';
        favouriteBox.classList.remove('gallery-masonry');
        box += `<div class="rounded-4 overflow-hidden d-flex align-items-center justify-content-center height">
                    <h1 class="h1noImagefound py-5">No Images found</h1>
                </div>`; 
        favouriteBox.innerHTML = box;
    }
    else{
        favouriteBox.classList.add('gallery-masonry');
        displayImages(filterimages);
    }
  
}

themetoggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    header.classList.toggle("dark-mode");
    themetoggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

function deteleFavourite(index) {
    favourites.splice(index, 1);
    favouritefilter.splice(index, 1);
    localStorage.setItem('favouritefilter', JSON.stringify(favouritefilter));
    localStorage.setItem('favourites', JSON.stringify(favourites));
    displayImages(favourites);  
}