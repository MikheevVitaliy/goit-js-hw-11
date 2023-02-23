const ENDPOINT = 'https://pixabay.com/api/';
const API_KEY = '33801420-150697ebc6b3d77194fe6b38c';
const OPTIONS = 'image_type=photo&orientation=horizontal&safesearch=true';
const PERPAGE = '3';
// const page = '2';

// function fetchData(query) {
//   const URL = `https://pixabay.com/api/?key=${API_KEY}&${OPTIONS}&per_page=${perPage}&q=${query}$page=`;
//   return fetch(URL).then(response => response.json());
// }

// export default fetchData;

export default class PixadayApiData {
  constructor() {
    this.page = 2;
    this.searchQuery = '';
  }

  fetchData() {
    const URL = `${ENDPOINT}?key=${API_KEY}&${OPTIONS}&per_page=${PERPAGE}&q=${this.searchQuery}&page=${this.page}`;

    return fetch(URL)
      .then(response => response.json())
      .then(({ hits }) => {
        this.nextPage();
        return hits;
      });
  }

  nextPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
