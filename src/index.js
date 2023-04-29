import './css/styles.css';
// Описаний в документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";


const gallery=document.querySelector(".gallery");
console.log(gallery);
const searchForm = document.querySelector('.search-form');

const BASE_URL="https://pixabay.com/api/";
const API_KEY="35813093-cabe0c7219a04f4206a0ddb1b";
let searchQuery ="";
let page= 1;

async function getPixabay(searchQuery){
     const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true`);
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.json();
}

function creatMarkup(array){
return array.map(
({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => `<div class="photo-card">
<div class="box-img">
<a class="slightbox" href="${largeImageURL}" data-width="1280" data-height="auto">
<img class="img__card" src="${webformatURL}" alt="${tags}" style="width=320px" loading="lazy" /></a></div>
<div class="info">
  <p class="info-item">
    <b>Likes</br>${likes}</b>
  </p>
  <p class="info-item">
    <b>Views</br>${views}</b>
  </p>
  <p class="info-item">
    <b>Comments</br>${comments}</b>
  </p>
  <p class="info-item">
    <b>Downloads</br>${downloads}</b>
  </p>
</div>
</div>`
).join("")
}

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = searchForm.elements.searchQuery.value;
    getPixabay(query)
      .then((data) => {
        gallery.insertAdjacentHTML('beforeend', creatMarkup(data.hits));
        lightbox.refresh();
      })
      .catch(error => console.log(error));
  });

  const lightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionDelay: 250,
    captionsData:'alt'
  })