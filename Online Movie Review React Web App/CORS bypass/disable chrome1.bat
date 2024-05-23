const getMovieData = async (movieId) => {
    try {
      const response = await api.get(`/api/v1/movies/${movieId}`);

      const singleMovie = response.data;

      setMovie(singleMovie);

      // Only update the reviews state if it's not already set
      if (!reviews.length) {
        setReviews(singleMovie.reviews || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);


----------------------------------

  const addReview = async (e) => {
    e.preventDefault();

    const rev = revText.current;

    try {
      const response = await api.post("/api/v1/reviews", {
        reviewBody: rev.value,
        imdbId: movieId,
      });

      const updatedReviews = [...reviews, { body: rev.value }];
      setReviews(updatedReviews);
      rev.value = "";
    } catch (err) {
      console.error(err);
    }
  };