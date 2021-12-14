const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '15412050-b20d1b69abcf0f10d11e2c309';

function fetchQuery(searchQuery, page) {
  return fetch(
    `${BASE_URL}/?key=${API_KEY}&q=${searchQuery}
      &image_type=photo&orientation=horizontal&page=
      ${page}&per_page=12`,
  ).then(res => res.json());
}

export default fetchQuery;
