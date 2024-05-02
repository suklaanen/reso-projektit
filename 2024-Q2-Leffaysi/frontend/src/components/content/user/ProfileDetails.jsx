import React, { useState, useEffect } from 'react';
import './user.css';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { getHeaders } from '@auth/token';
import GroupList from './GroupList';
import ReviewList from './ReviewList';
import ProfileEdit from './ProfileEdit';
import FavoriteList from './FavoriteList';
const { VITE_APP_BACKEND_URL } = import.meta.env;

const ProfileDetails = ({ user }) => {
    const { profilename } = useParams();
    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [isOwnProfile, setOwnProfile] = useState(false);
    const [isPrivate, setPrivate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setAdmin] = useState(false);
    const headers = getHeaders();

    useEffect(() => {

        if (user !== null && user.usertype === 'admin') {
            setAdmin(true);
        }

            const fetchProfile = async () => {
                try {
                    const response = await axios.get(`${VITE_APP_BACKEND_URL}/profile/${profilename}`, { headers });
                    setProfile(response.data);
                    setOwnProfile(response.data.isOwnProfile);
                    setPrivate(response.data.is_private);
                } catch (error) {
                    console.error('Virhe haettaessa profiilitietoja:', error);
                }
                setLoading(false);
            };
            
            fetchProfile();
        
    }, [profilename]);

    return (
        
        <div className="content">
            {loading ? (
                <div>Ladataan sisältöä</div>
            ) : (
                <>
            <div className="inner-view">
                <div className="inner-left">
     
                        <img 
                            src={profile && profile.profilepicurl ? profile.profilepicurl : '/pic.png'} 
                            className="profilepic" 
                            alt="Käyttäjän kuva" 
                        />

                    {(isOwnProfile && !editMode) && <button onClick={() => setEditMode(true)} className="basicbutton">Muokkaa profiilia</button>}
                </div>

                <div className="inner-right">
                    <h2>{profile && profile.profilename}</h2>
                    <ul>
                        {(isAdmin || !isPrivate || isOwnProfile) && <p className="info">{profile?.description || ''} </p>}
                        {isPrivate && !isOwnProfile && <span className="userinfo">Tämä profiili on yksityinen.</span>}
                    </ul>
                </div>
            </div>

            {editMode && <ProfileEdit profilename={profilename} />}

            {(isAdmin || !isPrivate || isOwnProfile) && (
                <>
                    <div className='profile-between'>

                    <div className="profile-view">
                            <div className="profile-content">
                                <h2>Suosikit &nbsp;<img src="/blackheart.png" className='emoji' /></h2>
                                <FavoriteList profile={profile} user={user} />
                            </div>
                        </div>

                        <div className="profile-view">
                            <div className="profile-content">
                                <h2>Ryhmät &nbsp;<img src="/speak.png" className='emoji' /></h2>
                                <GroupList profile={profile} />
                            </div>
                        </div>

                    </div>

                    <div className='reviews-view'>
                        <h2>Arvostelut  &nbsp;<img src="/voice.png" className='emoji' /></h2>
                        <ReviewList user={user} profile={profile} /> 
                    </div>
                </>
                )}
                </>
            )}
        </div>
    );
};

export default ProfileDetails;