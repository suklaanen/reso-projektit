import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GroupDetails';
const { VITE_APP_BACKEND_URL } = import.meta.env;
import { getHeaders } from '@auth/token';


const GroupEdit = ({ id }) => {

    const [messageGroupDelete, setMessageGroupDelete] = useState('');
    const headers = getHeaders();


    const [formData, setFormData] = useState({
        grouppicurl: '',
        groupexplanation: ''
    });
    
    const [deleteClicked, setDeleteClicked] = useState(false);

    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                const response = await axios.get(`${VITE_APP_BACKEND_URL}/group/${id}`);

                const { grouppicurl, groupexplanation } = response.data;
                setFormData({ grouppicurl, groupexplanation });
            } catch (error) {
                console.error('Hakuvirhe:', error);
            }
        };

        fetchGroupData();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${VITE_APP_BACKEND_URL}/group/${id}`, formData, );

            window.location.reload();
        } catch (error) {
            console.error('Hakuvirhe:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${VITE_APP_BACKEND_URL}/memberlist/${id}`, { headers });
            await axios.delete(`${VITE_APP_BACKEND_URL}/favoritelist/${id}` , { headers });
            await axios.delete(`${VITE_APP_BACKEND_URL}/group/${id}`, { headers });
            setMessageGroupDelete('Ryhmä poistettu, sinut ohjataan etusivulle.');
            setTimeout(() => {
                     window.location.href = '/';
                 }, 3000);

        } catch (error) {
            console.error('Virhe poistettaessa ryhmää:', error);
        }
    };

    const handleDeleteClick = () => {
        setDeleteClicked(true);
    };

    const handleCancelDelete = () => {
        setDeleteClicked(false);
    };

    return (
        <div className='form-view'>

            <h2>Muokkaa ryhmää</h2>

            <form onSubmit={handleSubmit}>
                <b>Ryhmäkuva URL</b> <br />
                <input className="veryLongInput" type="text" name="grouppicurl" value={formData.grouppicurl || ''} onChange={handleChange} /><br />
                <b>Kuvaus</b><br />
                <textarea className="textBox" name="groupexplanation" value={formData.groupexplanation || ''} onChange={handleChange} /><br /><br />
                <button className="basicbutton" type="submit">Tallenna muutokset</button>
                <button className="basicbutton" onClick={() => setEditMode(false)}>Peruuta</button>
            </form>
            <h2>Poista ryhmä</h2>
                    <div className="gform-view">
                        {!deleteClicked ? (
                            <button className="basicbutton confirm" onClick={handleDeleteClick}>Poista ryhmä</button>
                        ) : (
                            <div>
                                <b>Haluatko varmasti poistaa tämän ryhmän?</b> <br />
                                <button className="basicbutton confirm" onClick={handleDelete}>Kyllä, poista ryhmä</button>
                                <button className="basicbutton" onClick={handleCancelDelete}>En, peruuta</button>
                            </div>
                        )}
                        <p>Jos poistat ryhmän, niin kaikki ryhmän tiedot poistetaan pysyvästi.</p>
                        {messageGroupDelete && <span className='userinfo'>{messageGroupDelete}</span>}
                    </div>
        </div>
    );
};

export default GroupEdit;
