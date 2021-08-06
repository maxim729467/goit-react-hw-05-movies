import { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Link, useRouteMatch } from "react-router-dom";
import { fetchMoviesByName } from "../../fetch-service";
import styles from "./MoviesPage.module.css";
import CameraRollRoundedIcon from "@material-ui/icons/CameraRollRounded";

export default function MoviesPage({ loader }) {
  const [movieName, setMovieName] = useState("");
  const [searchedMovies, setSearchedMovie] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { url } = useRouteMatch();
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const key = location.search.split("=")[0].slice(1);
    const query = location.search.split("=")[1];

    if (location.search && key === "query") {
      const getMovies = async function () {
        try {
          setLoading(true);
          const res = await fetchMoviesByName(query);
          setSearchedMovie(res.data.results);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };

      getMovies();
    }
  }, [location.search]);

  const onChange = function (e) {
    setMovieName(e.target.value);
  };

  function onSubmit(e) {
    e.preventDefault();
    const query = movieName.toLowerCase().trim();
    if (query.length === 0) {
      return;
    }
    const getMovies = async function () {
      try {
        const res = await fetchMoviesByName(query);
        setSearchedMovie(res.data.results);
      } catch (error) {
        setError(error);
      }
    };

    getMovies();
    history.push({ ...location, search: `query=${query}` });
    setMovieName("");
  }

  return (
    <>
      <form className={styles.form} onSubmit={onSubmit}>
        <input
          className={styles.input}
          placeholder="Type movie name"
          value={movieName}
          type="text"
          onChange={onChange}
        ></input>
        <button className={styles.button} type="submit">
          Search
        </button>
      </form>
      {loading && loader}
      {searchedMovies && (
        <ul className={styles.list}>
          {searchedMovies.map((movie) => {
            return (
              <li className={styles.item} key={movie.id}>
                <Link
                  className={styles.link}
                  to={{
                    pathname: `${url}/${movie.id}`,
                    state: { from: location },
                  }}
                >
                  <CameraRollRoundedIcon />
                  <span className={styles.name}>
                    {movie.name ?? movie.title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      {error && <p>{error}</p>}
    </>
  );
}
