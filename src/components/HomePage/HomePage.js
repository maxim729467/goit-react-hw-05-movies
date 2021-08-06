import styles from "./HomePage.module.css";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchTrendingMovies } from "../../fetch-service";
import CameraRollRoundedIcon from "@material-ui/icons/CameraRollRounded";

export default function HomePage({ loader }) {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const getMovies = async function () {
      try {
        setLoading(true);
        const res = await fetchTrendingMovies();
        setMovies(res.data.results);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getMovies();
  }, []);

  return movies ? (
    <>
      <h1 className={styles.header}>Trending today</h1>
      {loading && loader}
      <ul className={styles.list}>
        {movies.map((movie) => {
          return (
            <li className={styles.item} key={movie.id}>
              <Link
                className={styles.link}
                to={{
                  pathname: `movies/${movie.id}`,
                  state: { from: location },
                }}
              >
                <CameraRollRoundedIcon />
                <span className={styles.name}>{movie.title ?? movie.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  ) : (
    <p>{error}</p>
  );
}
