import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { jwtToken, usertype } from '../auth/authSignal';
const { VITE_APP_BACKEND_URL } = import.meta.env;


export default function Login({ setUser, window, fullpage }) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [messageLogin, setMessageLogin] = useState('');
  const [messageRegister, setMessageRegister] = useState('');
  const [messagePassword, setMessagePassword] = useState('');

  const [formData, setFormData] = useState({
    profilename: null,
    email: null,
    password: null
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${VITE_APP_BACKEND_URL}/auth/login`, {
        username: username,
        password: password
      });

      if (response.status === 200) {
        jwtToken.value = response.data.jwtToken;
        usertype.value = response.data.usertype;
        const profileid = response.data.profileid;
        setUser({ user: username, usertype: usertype.value, profileid: profileid });
        navigate('/myaccount');
        setMessageLogin('');
      }
    } catch (error) {
      console.error('Kirjautumisvirhe:', error);
      setMessageLogin('Tarkista käyttäjätunnus ja salasana');
      setTimeout(() => {
        setMessageLogin('');
      }, 3000);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const profilename = formData.profilename;
    const password = formData.password;
    const email = formData.email;
    // salasanan tulee olla vähintään 4 merkkiä pitkä
    if (password.length < 4) {
      setMessageRegister('Salasanan tulee olla vähintään 4 merkkiä pitkä');
      registerTimeout();
    }
    try {
      const response = await axios.post(`${VITE_APP_BACKEND_URL}/auth/register`, {
        username: profilename,
        password: password,
        email: email
      });

      if (response.status === 201) {
        setMessageRegister('Rekisteröinti onnistui, voit nyt kirjautua sisään');
        registerTimeout();
        setShowRegisterForm(false);
        setUsername(profilename);
        setPassword(password);
      }

    } catch (error) {
      console.error('Virhe käyttäjän luomisessa:', error);
      if (error.response && error.response.status === 400) {
        setMessageRegister('Tarkista antamasi tiedot ja yritä uudelleen');
        registerTimeout();
      } else if (error.response && error.response.status === 500) {
        setMessageRegister('Rekisteröinti epäonnistui, yritä uudelleen');
        registerTimeout();
      }
    }
  };

  const registerTimeout = () => {
    setTimeout(() => {
      setMessageRegister('');
    }, 3000);
  };

  const handleToggleRegisterForm = () => {
    setShowRegisterForm(!showRegisterForm);
  };

  const handleToggleForgotPasswordForm = () => {
    setShowForgotPassword(!showForgotPassword);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      // Tarkistetaan, onko sähköposti olemassa järjestelmässä
      const response = await axios.post(`${VITE_APP_BACKEND_URL}/auth/forgot-password`, { email });

      if (response.status === 200) {
        setMessagePassword('Uusi salasana on lähetetty sähköpostiisi.');
        setTimeout(() => {
          setMessagePassword('');
        }, 3000);
        setShowForgotPassword(false);
      }
    } catch (error) {
      console.error('Virhe unohtuneen salasanan käsittelyssä:', error);
      setMessagePassword('Sähköpostiosoitetta ei löytynyt. Tarkista antamasi sähköpostiosoite.');
      setTimeout(() => {
        setMessagePassword('');
      }, 3000);
    }
  };

  if (window) {
    return (
      <div className="login-window">
        {showRegisterForm ? (
          <form onSubmit={handleRegister}>
            <input className="field" type="text" name="profilename" value={formData.profilename || ''} onChange={handleChange} placeholder="Käyttäjänimi" /><br />
            <input className="field" type='email' name="email" value={formData.email || ''} onChange={handleChange} placeholder="Sähköposti" /><br />
            <input className="field" type='password' name="password" value={formData.password || ''} onChange={handleChange} placeholder="Salasana" /><br />
            <button className="formButton" type="submit">Rekisteröidy</button>
            <button className="formButton" type="button" onClick={(e) => { handleToggleRegisterForm(); e.stopPropagation(); }}>Peruuta</button>
          </form>
        ) : showForgotPassword ? (
          <form onSubmit={handleForgotPassword}>
            <input className="field" type="email" name="email" value={email} onChange={handleEmailChange} placeholder="Sähköpostiosoite" required />
            <button className="formButton" type="submit">Palauta salasana</button>
            <button className="formButton" onClick={(e) => { handleToggleForgotPasswordForm(); e.stopPropagation(); }}>Peruuta</button>
            {messagePassword && <span className='login-window-info'>{messagePassword}</span>}
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <input className="field" value={username} onChange={e => setUsername(e.target.value)} placeholder="Käyttäjänimi"></input>
            <input className="field" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Salasana"></input>
            <button className="formButton" type="submit">Kirjaudu sisään</button> <br />
            {messageLogin && <span className='login-window-info'>{messageLogin}</span>}
            <hr />

            <button className="formButton" onClick={(e) => { handleToggleRegisterForm(); e.stopPropagation(); }}>Rekisteröidy</button>

            <button className="formButton" onClick={(e) => { handleToggleForgotPasswordForm(); e.stopPropagation(); }}>Unohtuiko salasana?</button>

          </form>

        )}

        <div className='lilInfoBox'>{messageRegister && <span className='login-window-info'>{messageRegister}</span>}</div>
      </div>
    );
  } else {
    return (
      <div className='content'>

        <div className="section2">
          <h2>Kirjautuminen</h2>
          <div className='form-view'>
            <span className="userinfo">Älä koskaan jaa käyttäjätunnustasi ja salasanaasi muille</span><br /><br />

            <form onSubmit={handleLogin}>
              <b>Käyttäjätunnus:</b> <br />
              <input id="robot01" className="field" value={username} onChange={e => setUsername(e.target.value)} placeholder="Käyttäjänimi"></input>
              <br />
              <b>Salasana:</b> <br />
              <input id="robot02" className="field" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Salasana"></input> <br />
              <button id="robot03" className="basicbutton" type="submit">Kirjaudu sisään</button>
            </form>
            {messageLogin && <p className='userinfo'>{messageLogin}</p>}
          </div>


          <h2>Unohtuiko salasana?</h2>
          <div className='form-view'>
            <span className="userinfo">Syötä sähköpostiosoitteesi, niin lähetämme sinulle uuden salasanan.</span>
            <form onSubmit={handleForgotPassword}>
              <input type="email" value={email} onChange={handleEmailChange} placeholder="Sähköpostiosoite" required /> <br />
              <button className="basicbutton" type="submit">Palauta salasana</button>
            </form>
            {messagePassword && <p className='userinfo'>{messagePassword}</p>}
          </div>

          <h2>Rekisteröidy käyttäjäksi</h2>
          <div className='form-view'>
            <form onSubmit={handleRegister}>
              <span className="userinfo">Kaikki kentät ovat pakollisia, sähköposti ei saa olla jo käytössä jollain käyttäjällä.</span> <br /><br />
              <b>Käyttäjänimi</b> <br />
              <input id="robot04" className="field" type="text" name="profilename" value={formData.profilename || ''} onChange={handleChange} /><br />
              <b>Sähköposti</b><br />
              <input id="robot05" className="field" type='text' name="email" value={formData.email || ''} onChange={handleChange} /><br />
              <b>Salasana</b><br />
              <input id="robot06" className="field" type='password' name="password" value={formData.password || ''} onChange={handleChange} /><br />
              <button id="robot07" className="basicbutton" type="submit">Rekisteröidy</button> <br />
              {messageRegister && <span className='communityinfo'>{messageRegister}</span>}
            </form>
          </div>
        </div>
      </div>
    );
  }
}