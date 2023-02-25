import PixadayApiData from './pixadayApi.js';
import LoadMoreBtn from './components/LoadMoreBtn.js';

import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  formEl: document.getElementById('search-form'),
  galleryEl: document.querySelector('.gallery'),
  // searchBtnEl: document.querySelector('.load-more'),
};
// ------------------------------
const pixadayApiData = new PixadayApiData();

const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});

console.log(pixadayApiData);
console.log(loadMoreBtn);
// ------------------------------
refs.formEl.addEventListener('submit', onSubmit);
// refs.searchBtnEl.button.addEventListener('click', loadMore);
loadMoreBtn.button.addEventListener('click', loadMore);
// ------------------------------
function onSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const value = form.elements.searchQuery.value.trim();

  pixadayApiData.searchQuery = value;

  clearNewsList();

  pixadayApiData.resetPage();

  loadMoreBtn.show();

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
// function loadMore() {
//   loadMoreBtn.disable();

//   return pixadayApiData
//     .fetchData(pixadayApiData.searchQuery)
//     .then(hits => {
//       if (hits.length === 0)
//         throw new Error(
//           'Sorry, there are no images matching your search query. Please try again.'
//         );
//       return hits.reduce(
//         (markup, article) => createMarkup(article) + markup,
//         ''
//       );
//     })
//     .then(markup => {
//       appendNewsToList(markup);
//       loadMoreBtn.enable();
//     })
//     .catch(onError);
// }
//---------------------------------------
async function loadMore() {
  loadMoreBtn.disable();

  try {
    const data = await pixadayApiData.fetchData(pixadayApiData.searchQuery);

    const { hits, totalHits } = data;

    // console.log(hits);
    if (hits.length === 0) throw new Error(onNothingFound());
    const markup = hits.reduce(
      (markup, article) => createMarkup(article) + markup,
      ''
    );
    appendNewsToList(markup);
    loadMoreBtn.enable();
    //----------------------
    let page = pixadayApiData.page - 1;
    let limitPerPage = 40;
    // console.log(data);
    if (pixadayApiData.page - 1 === 1) onInfo(totalHits);
    const totalPages = totalHits / limitPerPage;

    if (page > totalPages) throw new Error(onNoMore());
  } catch (err) {
    // console.error(err);
    return err;
  }
}
//---------------Помилки
function onNothingFound(err) {
  console.error(err);
  loadMoreBtn.hide();
  // appendNewsToList(
  //   '<p>Sorry, there are no images matching your search query. Please try again.</p>'
  // );
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function onNoMore() {
  loadMoreBtn.hide();
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results."
  );
}

function onInfo(info) {
  Notiflix.Notify.success(`Hooray! We found ${info} images.`);
}
//-------------------------------
function clearNewsList(markup) {
  refs.galleryEl.innerHTML = '';
}

function appendNewsToList(markup) {
  refs.galleryEl.insertAdjacentHTML('beforeend', markup);

  new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
    enableKeyboard: true,
  }).refresh();
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
    <div class="images">
    <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy"  /></a>
    </div>
    <div class="info">
    <p class="info-item">
      <b><span class="span">Likes:</span></b>
      <b>${likes}</b>
    </p>
    <p class="info-item">
      <b><span class="span">Views:</span></b>
      <b>${views}</b>
    </p>
    <p class="info-item">
      <b><span class="span">Comments:</span></b>
      <b>${comments}</b>
    </p>
    <p class="info-item">
      <b><span class="span">Downloads:</span></b>
      <b>${downloads}</b>
    </p>
  </div>
</div>`;
}
// ------------------------------
