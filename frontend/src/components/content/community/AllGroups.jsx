import React, { useState, useEffect } from 'react';
import './community.css';
import GroupCarousel from './GroupCarousel';
import axios from 'axios';
import { Link } from 'react-router-dom';
const { VITE_APP_BACKEND_URL } = import.meta.env;
import { getHeaders } from '@auth/token';

const AllGroups = ({ user, searchTerm, setSearchTerm }) => {
    const [groups, setGroups] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [groupsPerPage, setGroupsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [profileId, setProfileid] = useState(null);
    const [newGroupName, setNewGroupName] = useState('');
    const [creatingGroup, setCreatingGroup] = useState(false);
    const headers = getHeaders();

    if (user.user !== null) {
    useEffect(() => {
        const fetchProfile = async () => {
            try {

                const { user: username } = user;

                const response = await axios.get(`${VITE_APP_BACKEND_URL}/profile/${username.user}`, { headers });
    
                setProfileid(response.data.profileid);

            } catch (error) {
                console.error('Virhe haettaessa profiilitietoja:', error);
            }
        };
    
        fetchProfile();
      }, [user]);
    }

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get(`${VITE_APP_BACKEND_URL}/group`);
                const sortedGroups = response.data.sort((a, b) => a.groupname.localeCompare(b.groupname), { headers });
                setGroups(sortedGroups);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching groups:', error);
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    const filteredGroups = groups.filter(group =>
        group.groupname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastGroup = currentPage * groupsPerPage;
    const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
    const currentGroups = filteredGroups.slice(indexOfFirstGroup, indexOfLastGroup);

    const handleCreateGroup = async () => {
        try {
            const response = await axios.post(`${VITE_APP_BACKEND_URL}/group`, { groupname: newGroupName }, { headers }) ;  
            console.log('palauttaako mitään', response.data);
            const groupid = response.data[0].groupid;
            await axios.post(`${VITE_APP_BACKEND_URL}/memberstatus/${profileId}/1/${groupid}/0`);
            setNewGroupName('');
            setCreatingGroup(false);
            console.log('Uusi ryhmä luotu ja jäsen lisätty onnistuneesti');
            window.location.href = `/group/${groupid}`;

        } catch (error) {
            console.error('Virhe luodessa ryhmää ja jäsentä:', error);
        }
    };

    return (
        <div className="two-view">
            <div className="two-left">
                <h2>Ryhmät</h2>
                {loading ? (
                    <div className="loading-text">Ladataan Ryhmiä...</div>
                ) : (
                    <>
                        {groups.length > groupsPerPage && (
                            <ul className="pagination">
                                <li>
                                    <button className="buttonnext" onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}>⯇</button>
                                    &nbsp; <span className="communityBox">selaa</span> &nbsp;
                                    <button className="buttonnext" onClick={() => setCurrentPage(currentPage < Math.ceil(filteredGroups.length / groupsPerPage) ? currentPage + 1 : Math.ceil(filteredGroups.length / groupsPerPage))}>⯈</button>
                                </li>
                                <li>
                                    <input className='justMargin longInput' type="text" placeholder="Etsi ryhmiä..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                </li>
                            </ul>
                        )}

                        <div className="communityDiv">
                            {currentGroups.map(group => (
                                <table className="communityTbl" key={group.groupid}>
                                    <tbody>
                                        <tr>
                                            <td width="250px"><b><Link to={`/group/${group.groupid}`}>{group.groupname}</Link></b></td>
                                            {group.groupexplanation && (
                                            <td>{group.groupexplanation && group.groupexplanation .length > 54 ? group.groupexplanation .substring(0, 44) + '...' : group.groupexplanation }</td>
                                            )}
                                        </tr>
                                    </tbody>
                                </table>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="two-right">
                <h2>Muut ryhmätoiminnot</h2>
                
                    <>
                        <div className="communityBox">
                            Mikäs sen mukavampaa, kuin löytää samanhenkistä leffaporukkaa,<br />
                            jonka kanssa jakaa leffa-elämyksiä ja chattailla reaaliajassa. <br /><br />
                            Meillä on jo <b>{groups.length}</b> ryhmää, mistä valita <br />
                            Tai saitko uuden ryhmä-idean? Voit luoda sellaisen itsellesi ja kavereillesi <br />
                            tai koko maailman parhaalle leffakansalle! <span className='emoji uni01'></span>
                        </div> <br />
                        {(!creatingGroup && profileId !== null ) && (
                        <button id="robot01" className='basicbutton justMargin' onClick={() => setCreatingGroup(true)}>Luo uusi ryhmä</button> 
                        )}
                    </>
                
                {creatingGroup && (
                    <>
                        <input id="robot03" className='justMargin' type="text" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} placeholder="Syötä uuden ryhmän nimi" />
                        <button id="robot02" className='basicbutton justMargin' onClick={handleCreateGroup}>Luo</button> 
                        <button className='basicbutton' onClick={() => setCreatingGroup(false)}>Peruuta</button> <br/><br/>


                        
                    </>
                )}

                    <>
                        <div className="communityBox">
                            <GroupCarousel />
                        </div>
                    </>
            </div>
        </div>
    );
};

export default AllGroups;
