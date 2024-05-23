import { useEffect, useRef } from "react";
import api from "../../api/axiosConfig";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import ReviewForm from "../reviewForm/ReviewForm";
import React from "react";

const Reviews = ({ getMovieData, movie, reviews, setReviews }) => {
  const revText = useRef();
  const params = useParams();
  const movieId = params.movieId;

  useEffect(() => {
    getMovieData(movieId);
  }, []);
  //adds review to review list for specific movie (stores an array of reviews)
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

      // Update reviews for the specific movie in localStorage
      const storedReviews = JSON.parse(localStorage.getItem("reviews")) || {};
      const movieReviews = storedReviews[movieId] || [];
      const updatedMovieReviews = [...movieReviews, { body: rev.value }];
      const updatedStoredReviews = {
        ...storedReviews,
        [movieId]: updatedMovieReviews,
      };
      localStorage.setItem("reviews", JSON.stringify(updatedStoredReviews));

      rev.value = "";
    } catch (err) {
      console.error(err);
    }
  };

  //delete review from movie (removes a review from the review array)
  const deleteReview = (index) => {
    const updatedReviews = reviews.filter((_, i) => i !== index);
    setReviews(updatedReviews);

    // Update reviews for the specific movie in localStorage
    const storedReviews = JSON.parse(localStorage.getItem("reviews")) || {};
    const movieReviews = storedReviews[movieId] || [];
    const updatedMovieReviews = movieReviews.filter((_, i) => i !== index);
    const updatedStoredReviews = {
      ...storedReviews,
      [movieId]: updatedMovieReviews,
    };
    localStorage.setItem("reviews", JSON.stringify(updatedStoredReviews));
  };

  return (
    <Container>
      <Row>
        <Col>
          <h3>Reviews</h3>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <img src={movie?.poster} alt="" />
        </Col>
        <Col>
          {
            <>
              <Row>
                <Col>
                  <ReviewForm
                    handleSubmit={addReview}
                    revText={revText}
                    labelText="Write a Review?"
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <hr />
                </Col>
              </Row>
            </>
          }
          {Array.isArray(reviews) &&
            reviews.map((r, index) => {
              return (
                <div key={index}>
                  <Row>
                    <Col>{r.body}</Col>
                    <Col>
                      <Button
                        variant="danger"
                        onClick={() => deleteReview(index)}
                      >
                        Delete
                      </Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <hr />
                    </Col>
                  </Row>
                </div>
              );
            })}
        </Col>
      </Row>
      <Row>
        <Col>
          <hr />
        </Col>
      </Row>
    </Container>
  );
};

export default Reviews;
