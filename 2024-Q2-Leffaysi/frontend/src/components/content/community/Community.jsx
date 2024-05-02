import React, { useState, useEffect } from 'react';
import './community.css';
import UserList from './UserList';
import AllGroups from './AllGroups';
import AllReviews from './AllReviews';

const Community = ( user ) => {
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [groupSearchTerm, setGroupSearchTerm] = useState('');
  const [reviewSearchTerm, seReviewSearchTerm] = useState('');

  return (

    <div className="content">
      <h2>Yhteisö</h2>
      Löydä palvelumme käyttäjät, ryhmät ja arvostelut täältä.
      <UserList searchTerm={userSearchTerm} setSearchTerm={setUserSearchTerm} />
      <AllGroups user={user} searchTerm={groupSearchTerm} setSearchTerm={setGroupSearchTerm} />
      <AllReviews searchTerm={reviewSearchTerm} setSearchTerm={seReviewSearchTerm} user={user} />
    </div>
  );
};

export default Community;