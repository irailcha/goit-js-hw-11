import './css/styles.css';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import axios from 'axios';

const gallery=document.querySelector('.gallery');
const searchForm = document.querySelector('.search-form');
const paginationButton=document.querySelector('.load-more')

const BASE_URL="https://pixabay.com/api/";
const API_KEY="35813093-cabe0c7219a04f4206a0ddb1b";
const PER_PAGE=40;
let searchQuery ="";
let currentPage= 1;
let totalHits=0;


function showTotalHits(totalHits) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }
  

  
  async function getPixabay(searchQuery, page) {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          key: API_KEY,
          q: searchQuery,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          page,
          per_page: PER_PAGE,
        },
      });
      const data = response.data;
  
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  
  function creatMarkup(array) {
    return array
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) =>
          `<div class="photo-card">
            <div class="box-img">
              <a class="slightbox" href="${largeImageURL}" data-width="1280" data-height="auto">
                <img class="img__card" src="${webformatURL}" alt="${tags}" loading="lazy" />
              </a>
            </div>
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
      )
      .join('');
  }
  
  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    currentPage = 1;
    const query = searchForm.elements.searchQuery.value.trim();
    searchQuery = query;
    paginationButton.classList.add('hidden');
  
    try {
      const data = await getPixabay(searchQuery, currentPage);
      if (data.hits.length === 0) {
        Notiflix.Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
  
        gallery.innerHTML = '';
        return;
      }
  
      const totalHits = data.totalHits;
      if (totalHits === 0) {
        Notiflix.Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
  
        gallery.innerHTML = '';
        return;
      }
  
      showTotalHits(totalHits);
  
      gallery.innerHTML = creatMarkup(data.hits);
      lightbox.refresh();
      paginationButton.classList.remove('hidden');
    } catch (error) {
      console.log(error);
    }
  });

  paginationButton.addEventListener('click', onClick);

  async function onClick() {
    currentPage += 1;
    try {
      const data = await getPixabay(searchQuery, currentPage);
      gallery.insertAdjacentHTML('beforeend', creatMarkup(data.hits));
      lightbox.refresh();
  
      if (data.hits.length < 40 || currentPage * 40 >= data.totalHits) {
        paginationButton.classList.add('hidden');
        Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
      }

    } catch (error) {
      console.log(error);
    }
  }



const lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionDelay: 250,
  captionsData: 'alt'
});


const firstChild = gallery.firstElementChild;
if (firstChild) {
  const { height: cardHeight } = firstChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}


