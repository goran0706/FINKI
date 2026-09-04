const addMovieBtn = document.getElementById('add-movie-btn');
const searchBtn = document.getElementById('search-btn');
const movieList = document.getElementById('movie-list');

const movies = [];

const renderMovies = (filter = '') => {
  movieList.innerHTML = '';

  const filteredMovies = filter
    ? movies.filter(movie => movie.info.title.includes(filter))
    : movies;

  filteredMovies.forEach(movie => {
    if ('info' in movie) {
      const { info, getFormattedTitle, ...rest } = movie;
      let text = movie.getFormattedTitle() + ' - ';
      for (const key in info) {
        if (key !== 'title') {
          const element = `${key}: ${info[key]}`;
          text = text.concat(element);
        }
      }
      const movieEl = document.createElement('li');
      movieEl.textContent = text;
      movieList.append(movieEl);
    }
  });
};

const addMovieHandler = () => {
  const title = document.getElementById('title').value;
  const extraName = document.getElementById('extra-name').value;
  const extraValue = document.getElementById('extra-value').value;

  if (
    title.trim() === '' ||
    extraName.trim() === '' ||
    extraValue.trim() === ''
  )
    return;

  const newMovie = {
    info: {
      get title() {
        return this._title;
        // return this._title.toUpperCase();
      },
      set title(val) {
        if (val.trim() === '') {
          this._title = 'DEFAULT';
        }
        this._title = val;
      },
      [extraName]: extraValue,
    },
    id: Math.random(),
    getFormattedTitle() {
      return this.info.title.toUpperCase();
    },
  };

  newMovie.info.title = title;
  movies.push(newMovie);
  renderMovies();
};

const searchMovieHandler = () => {
  const filterTerm = document.getElementById('filter-term').value;
  renderMovies(filterTerm);
};

addMovieBtn.addEventListener('click', addMovieHandler);
searchBtn.addEventListener('click', searchMovieHandler);
