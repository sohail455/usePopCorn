import { useEffect, useRef, useState } from "react";
import StarRating from "./starRating";
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const key = "27ea4592";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  function handelRemoveMovie(id) {
    setWatched(() => watched.filter((movie) => movie.ID !== id));
  }
  function handelClearSelected() {
    setSelected(null);
  }
  function handelSelected(value) {
    setSelected((prev) => (prev === value ? null : value));
  }
  function handelAddingToWatchedList(newWatchedMovie) {
    const idExists = watched.some((el) => el.ID === newWatchedMovie.ID);

    if (idExists) {
      return;
    }
    setWatched(() => [...watched, newWatchedMovie]);
  }
  useEffect(
    function () {
      const controller = new AbortController();
      async function getMovies() {
        try {
          setIsLoading(true);
          setError("");
          const newMovies = await fetch(
            `https://www.omdbapi.com/?apikey=${key}&s=${query}`,
            { signal: controller.signal }
          );
          if (!newMovies.ok)
            throw new Error("An Error Happen while Getting Movies");

          const data = await newMovies.json();
          if (data.Response === "False") throw new Error("MOVIE NOT FOUND");
          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      getMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <Result movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {/* {isLoading ? <Loading /> : <MoviesList movies={movies} />} */}
          {!isLoading && !error && (
            <MoviesList movies={movies} onSelect={handelSelected} />
          )}
          {isLoading && <Loading />}
          {error && <ShowError message={error} />}
        </Box>
        <Box>
          {selected ? (
            <MovieDetails
              movieID={selected}
              onClear={handelClearSelected}
              onAdding={handelAddingToWatchedList}
              watched={watched}
            />
          ) : (
            <>
              <WatchedListButtons watched={watched} />
              <WatchedList watched={watched} onDelete={handelRemoveMovie} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function MovieDetails({ movieID, onClear, onAdding, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const isWatched = watched.map((movie) => movie.ID).includes(movieID);
  const currentMovieUserRating = watched.find(
    (el) => el.ID === movieID
  )?.userRating;
  const {
    imdbID: ID,
    Actors: actors,
    Country: countery,
    Title: title,
    Runtime: runtime,
    Plot: plot,
    Director: director,
    Genre: genre,
    Released: released,
    imdbRating: Rating,
    Year: year,
    Writer: writer,
    Poster: poster,
    Language: language,
  } = movie;
  function handelAddingNewWatchedMovie() {
    const newWatchedMovie = {
      ID,
      poster,
      title,
      imdbRating: Number(Rating),
      userRating,
      runtime: Number(runtime.split(" ")[0]),
    };
    onAdding(newWatchedMovie);
    onClear();
  }
  console.log(actors);
  useEffect(
    function () {
      setIsLoading(true);
      async function getMovies() {
        const newMovies = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&i=${movieID}`
        );
        const data = await newMovies.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMovies();
    },
    [movieID]
  );
  useEffect(
    function () {
      if (!title) {
        return;
      }
      document.title = title;
      return function () {
        document.title = "usePopcorn🍿";
      };
    },
    [title]
  );
  return (
    <div className="details">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onClear}>
              &larr;
            </button>
            <img src={poster} alt={title}></img>
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span> {Rating} IMDB Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    size={24}
                    maxRating={10}
                    onSetRating={setUserRating}
                  />

                  {userRating > 0 && (
                    <button
                      className="btn-add"
                      onClick={handelAddingNewWatchedMovie}
                    >
                      + Add To List
                    </button>
                  )}
                </>
              ) : (
                <p>
                  you have rated this movie before {currentMovieUserRating}{" "}
                  <span>⭐</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Staring {actors}</p>
            <p>directed by: {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function Loading() {
  return <p className="loader">Loading...</p>;
}

function ShowError({ message }) {
  return (
    <div className="error">
      <span>💥</span>
      {message}
    </div>
  );
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null);
  useEffect(
    function () {
      function callback(e) {
        if (document.activeElement === inputEl.current) return;
        if (e.code === "Enter") {
          inputEl.current.focus();
          setQuery("");
        }
      }
      document.addEventListener("keydown", callback);
      return () => document.addEventListener("keydown", callback);
    },
    [setQuery]
  );
  useEffect(function () {
    inputEl.current.focus();
  }, []);
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function Result({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen2, setIsOpen2] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && children}
    </div>
  );
}

function MoviesList({ movies, onSelect }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <li key={movie.imdbID} onClick={() => onSelect(movie.imdbID)}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>🗓</span>
              <span>{movie.Year}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function WatchedList({ watched, onDelete }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <li key={movie.imdbID}>
          <img src={movie.poster} alt={`${movie.title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>⭐️</span>
              <span>{movie.imdbRating}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{movie.userRating}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.runtime} min</span>
            </p>
          </div>
          <button className="btn-delete" onClick={() => onDelete(movie.ID)}>
            X
          </button>
        </li>
      ))}
    </ul>
  );
}

function WatchedListButtons({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));

  const avgUserRating = average(watched.map((movie) => movie.userRating));

  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}
