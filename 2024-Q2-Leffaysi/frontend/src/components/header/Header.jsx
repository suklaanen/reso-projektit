import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Login from './Login';

const Header = ({ user, setUser, handleLogout, toggleTheme, showLogin, setShowLogin, isburgerOpen, setIsburgerOpen }) => {
  
  const toggleburger = () => {
    setIsburgerOpen(!isburgerOpen);
  };

  const toggleLogin = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div id="header">
      <div id="header-bar">
        <div className="header-container">
          <h2><Link className="mobile-menu-icon" onClick={toggleburger}>☰</Link></h2>
          <Link to="/"><span className="logo"></span></Link>

          <div className={`burger-items ${isburgerOpen ? 'open' : ''}`}>
            <ul className="sideLinks">
              <li><Link to="/">Etusivu</Link></li>
              <li><Link to="/search">Leffahaku</Link></li>
              <li><Link to="/events">Näytösajat</Link></li>
              <li><Link to="/community">Yhteisö</Link></li>
              <li><Link to="/about">FAQ</Link></li>
              
              <br/><br/>
              {!user && <li><Link to="/login">Kirjautuminen</Link></li>}
              
              {user && <li>Kirjautunut:</li>} 
              {user && <li>{user.user}</li> } <br/>

              {user && user.usertype === 'admin' && <li><Link to={`/admin`}>Ylläpito</Link></li>}
              {user && <li><Link to={`/profile/${user.user}`}>Oma profiili</Link></li>}
              {user && <li><Link to="/myaccount">Tilinhallinta</Link></li>}
              {user && <li><Link onClick={handleLogout}>Kirjaudu ulos</Link></li>}

              <button className="basicbutton" onClick={toggleTheme}>Vaihda teemaa</button>
            </ul>
          </div>

          <div className="menu-items">
            <div className="menu-items-left">
              <ul className="whiteLinks">
                <li><Link to="/search"><img src="/search.png" className='emoji' />Leffat ja sarjat</Link></li>
                <li><Link id="link01" to="/community">Yhteisö</Link></li>
              </ul>
            </div>

            <ul className="menu-items-right username">
              {user && <li><i>Tervetuloa, <b>{user.user}</b> !</i></li> }
            </ul>

            <ul className="menu-items-right whiteLinks">
              {!user && <li className="lilogin"><Link onClick={toggleLogin}>Kirjautuminen</Link></li>}
              {!user && showLogin && <Login setUser={setUser} window={true} />}

              {user && <li><Link id="link03" to={`/profile/${user.user}`}>Profiili</Link></li>}
              {user && <li><Link id="link02"  to="/myaccount">Tili</Link></li>}
              {user && <li className="lilogin"><Link onClick={handleLogout}>Kirjaudu ulos</Link></li>}
            </ul>

          </div>
        </div>
        </div>
      </div>
  );
};

export default Header;