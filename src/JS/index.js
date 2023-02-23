import Notiflix from 'notiflix';
import PixadayApiData from './pixadayApi.js';
import LoadMoreBtn from './components/LoadMoreBtn.js';

// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  formEl: document.getElementById('search-form'),
  galleryEl: document.querySelector('.gallery'),
  searchBtnEl: document.querySelector('.load-more'),
};
// ------------------------------
const pixadayApiData = new PixadayApiData();

const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
});

console.log(pixadayApiData);
console.log(loadMoreBtn);
// ------------------------------
refs.formEl.addEventListener('submit', onSubmit);
refs.searchBtnEl.addEventListener('click', loadMore);
// ------------------------------
function onSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const value = form.elements.searchQuery.value.trim();

  pixadayApiData.searchQuery = value;

  clearNewsList();

  pixadayApiData.resetPage();

  loadMore()
    // ===========Одинаковые функции, убираю повторения вызовом функции
    // pixadayApiData
    //   .fetchData(pixadayApiData.searchQuery)
    //   .then(hits => {
    //     if (hits.length === 0)
    //       throw new Error(
    //         'Sorry, there are no images matching your search query. Please try again.'
    //       );
    //     return hits.reduce(
    //       (markup, article) => createMarkup(article) + markup,
    //       ''
    //     );
    //   })
    //   .then(markup => {
    //     appendNewsToList(markup);
    //   })
    //   .catch(onError)
    .finally(() => form.reset());
}
// ------------------------------
function loadMore() {
  return pixadayApiData
    .fetchData(pixadayApiData.searchQuery)
    .then(hits => {
      if (hits.length === 0)
        throw new Error(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      return hits.reduce(
        (markup, article) => createMarkup(article) + markup,
        ''
      );
    })
    .then(markup => {
      appendNewsToList(markup);
    })
    .catch(onError);
}
// ------------------------------
function createMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
  <img src=${webformatURL} alt=${tags} loading=${largeImageURL} />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`;
}
// ------------------------------
function appendNewsToList(markup) {
  refs.galleryEl.insertAdjacentHTML('beforeend', markup);
}
// ------------------------------
function clearNewsList(markup) {
  refs.galleryEl.innerHTML = '';
}

function onError(err) {
  console.error(err);
  updateNewsList(
    '<p>Sorry, there are no images matching your search query. Please try again.</p>'
  );
}
