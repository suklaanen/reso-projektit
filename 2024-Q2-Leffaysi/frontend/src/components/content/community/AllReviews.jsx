import React, { useState, useEffect } from 'react';
import './community.css';
import AdminDeleteReview from '@content/admin/AdminDeleteReview';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getHeaders } from '@auth/token';
const { VITE_APP_BACKEND_URL } = import.meta.env;

const AllReviews = ({ searchTerm, setSearchTerm, user }) => {

  const [reviews, setReviews] = useState([]);
  const [reviewsPerPage, setReviewsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adult, setAdult] = useState(false);
  const headers = getHeaders()

  useEffect(() => {
    
    const fetchProfile = async () => {
      if (user.user !== null || user.user !== undefined) {

      const profresponse = await axios.get(`${VITE_APP_BACKEND_URL}/profile/${user.user.user}`, { headers });
      setAdult(profresponse.data.adult);
      }

      fetchProfile();
    };
  
  }, [user]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const newReviewResponse = await axios.get(`${VITE_APP_BACKEND_URL}/reviews`);
      
      const newReviews = newReviewResponse.data;

      const reviewData = newReviews;

      // Haetaan profiilitiedot
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
    review.review.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (review.userProfile && review.userProfile.profilename && review.userProfile.profilename.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (review.movie && review.movie.title && review.movie.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (review.movie && review.movie.name && review.movie.name.toLowerCase().includes(searchTerm.toLowerCase())) 
  );

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);

  return (
    <div className='allreviews'>
      <ul className="review-list">
        {loading ? (
          <div className="loading-text">
            Ladataan arvosteluja...
          </div>
        ) : (
          <>
            <li className="userinfo">
              Palvelussa on <b>{reviews.length}</b> arvostelua ja niiden keskiarvo 
              on <b>{reviews.length > 0 && (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)}</b>.<br />
              Voit luoda uusia arvosteluja elokuvien ja sarjojen sivuilta. <br />
            </li>

            {reviews.length > reviewsPerPage && (
              <ul className="pagination">

                  <li>
                      <input className='longInput' type="text" placeholder="Etsi ..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
                      <span className='hideableBr'><br/></span>
                      <button className="buttonnext justMargin" onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}>
                    &#9664; </button>
                    &nbsp; <span className="communityinfo">sivu {currentPage} / {Math.ceil(filteredReviews.length / reviewsPerPage)}</span> &nbsp;
                    <button className="buttonnext" onClick={() => setCurrentPage(currentPage < Math.ceil(filteredReviews.length / reviewsPerPage) ? currentPage + 1 : Math.ceil(filteredReviews.length / reviewsPerPage))}>
                      &#9654; </button>

                  </li>
              </ul>
            )}
  
            <hr />
  
            {currentReviews
            .filter(review => review.adult === false || adult === true)
            .map((review, index) => (
              <li className='minheightrews' key={index}>
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
                  <Link className='reviewtitle' to={`/movie/${review.revieweditem}`}>{review.movie.title}</Link>
                ) : (
                  <Link className='reviewtitle' to={`/series/${review.revieweditem}`}>{review.movie.name}</Link>
                )}    
  
                <br/>
                {[...Array(review.rating)].map((_, i) => (
                    <span key={i} >&#11088;</span>
                ))}
                  {[...Array(5 - review.rating)].map((_, i) => (
                    <span key={i + review.rating}>&#x2605;</span>
                ))}
                <span className='userinfo'>| <b>{review.rating}/5</b> tähteä</span> <br />
                <span className='reviewinfo'>
                  <span className='reviewinfo'>{formatDate(review.timestamp)}</span> | &nbsp;
                  {review.userProfile && review.userProfile.profilename !== undefined ? (
                    <Link className="reviewitems" to={`/profile/${review.userProfile.profilename}`}>
                      {review.userProfile.profilename}
                    </Link>
                  ) : (
                    <i>anonyymi</i>
                  )}
                </span><br />
                <span className='userinfo'>{review.review}</span> <br />
                {user.user !== null && user.user.usertype === 'admin' && (
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
