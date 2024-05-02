import React, { useState, useEffect } from 'react';
import AdminDeleteReview from './AdminDeleteReview';
import axios from 'axios';
import { Link } from 'react-router-dom';
const { VITE_APP_BACKEND_URL } = import.meta.env;


const AllReviews = ({ searchTerm, setSearchTerm, user }) => {

  const [reviews, setReviews] = useState([]);
  const [reviewsPerPage, setReviewsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const newReviewResponse = await axios.get(`${VITE_APP_BACKEND_URL}/reviews`);
      const newReviews = newReviewResponse.data;
      const reviewData = newReviews;

      const reviewsWithProfiles = await Promise.all(reviewData.map(async review => {
        try {
          if (review.profileid !== null) {
            const userProfileResponse = await axios.get(`${VITE_APP_BACKEND_URL}/profile/id/${review.profileid}`);
            const userProfileData = userProfileResponse.data;
            return { ...review, userProfile: userProfileData };
          } else {
            return review;
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          return review;
        }
      }));

      const reviewsWithMovies = await Promise.all(reviewsWithProfiles.map(async review => {
        try {
          let responseData;
          if (review.mediatype === 0) {
            const movieResponse = await axios.get(`${VITE_APP_BACKEND_URL}/movie/${encodeURIComponent(review.revieweditem)}`);
            responseData = movieResponse.data;
            setLoading(false);
          } else if (review.mediatype === 1) {
            const tvResponse = await axios.get(`${VITE_APP_BACKEND_URL}/series/${encodeURIComponent(review.revieweditem)}`);
            responseData = tvResponse.data;
            setLoading(false);
          }
          if (responseData && (responseData.title || responseData.name)) {
            return {
              ...review,
              movie: responseData,
            };
          } else {
            return review;
          }
        } catch (error) {
          console.error('Fetch error:', error);
          return review;
        }
      }));

      const sortedReviews = reviewsWithMovies.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setReviews(sortedReviews);
    } catch (error) {
      console.error('Hakuvirhe:', error);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  
  const handleDelete = async (idreview) => {
      setReviews(reviews.filter(review => review.idreview !== idreview));
  };

  const filteredReviews = reviews.filter(review =>
    review.review.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);

  return (
    <div className='admin-reviews'>
      <ul className="review-list">
        {loading ? (
          <div className="loading-text">
            Ladataan arvosteluja...
          </div>
        ) : (
          <>
            <h2>Arvostelujen hallinnointi</h2>
  
            <ul className="pagination">
              <li>
                <button className="buttonnext" onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}>
                  &#9664;
                </button>
                &nbsp; <span className="admininfo">selaa</span> &nbsp;
                <button className="buttonnext" onClick={() => setCurrentPage(currentPage < Math.ceil(filteredReviews.length / reviewsPerPage) ? currentPage + 1 : Math.ceil(filteredReviews.length / reviewsPerPage))}>
                  &#9654;
                </button>
              </li>
            </ul>
  
            <hr />
  
            {currentReviews.map((review, index) => (
              <li className='adminrews' key={index}>
                {review.mediatype === 0 ? (
                  <Link to={`/movie/${review.revieweditem}`}>
                    <img className='reviewimg' src={`https://image.tmdb.org/t/p/w342${review.movie.poster_path}`} alt={review.movie.title} />
                  </Link>
                ) : (
                  <Link to={`/series/${review.revieweditem}`}>
                    <img className='reviewimg' src={`https://image.tmdb.org/t/p/w342${review.movie.poster_path}`} alt={review.movie.name} />
                  </Link>
                )}
  
                {review.mediatype === 0 ? (
                  <Link className='admininfo2' to={`/movie/${review.revieweditem}`}>{review.movie.title}</Link>
                ) : (
                  <Link className='admininfo2' to={`/series/${review.revieweditem}`}>{review.movie.name}</Link>
                )}    
  
                <br/>
                {[...Array(review.rating)].map((_, i) => (
                    <span key={i} >&#11088;</span>
                ))}
                  {[...Array(5 - review.rating)].map((_, i) => (
                    <span key={i + review.rating}>&#x2605;</span>
                ))}
                <span className='admininfo'>| <b>{review.rating}/5</b> tähteä</span> <br />
                <span className='admininfo'>
                  <span className='admininfo'>{formatDate(review.timestamp)}</span> | &nbsp;
                  {review.userProfile && review.userProfile.profilename !== undefined ? (
                    <Link className="admininfo" to={`/profile/${review.userProfile.profilename}`}>
                      {review.userProfile.profilename}
                    </Link>
                  ) : (
                    <i>anonyymi</i>
                  )}
                </span><br />
                <span className='admininfo'>{review.review}</span> <br />
                {user !== null && user.usertype === 'admin' && (
                  <AdminDeleteReview id={review.idreview} handleDelete={handleDelete} />
                )}
              </li>
            ))}
          </>
        )}
      </ul>
    </div>
  )
}

export default AllReviews;
