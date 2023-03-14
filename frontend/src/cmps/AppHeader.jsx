import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, NavLink, Link } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import { ImTrello } from 'react-icons/im';

// Services
import { userService } from '../services/user.service';

// Actions
import { loadUsers, setUser } from '../store/user/user.actions.js';
import { toggleModal } from '../store/app/app.action';
import { loadBoards } from '../store/board/board.action';

// cmps
import { SkellMicAssistant } from './SkellMicAssistence';

export function AppHeader() {
  const dispatch = useDispatch();
  let location = useLocation();
  const isModalOpen = useSelector(state => state.appModule.popupModal.isModalOpen)
  const user = useSelector(state => state.userModule.loggedinUser)

  useEffect(() => {
    getLoggedInUser()
    dispatch(loadUsers())
    onLoadBoards()
  }, [])

  const onLoadBoards = async () => {
    await dispatch(loadBoards());
  }

  const getLoggedInUser = async () => {
    const loggedInUser = userService.getLoggedinUser() || await userService.loginAsGuest()
    dispatch(setUser(loggedInUser))
  }

  const onUserClick = event => {
    dispatch(toggleModal({ event, type: 'profile', posXAddition: -300, isShown: !isModalOpen }));
  };

  const onClickBoards = (ev) => {
    dispatch(toggleModal({ event: ev, type: 'profile', posYAddition: 20, isShown: !isModalOpen }));
  }

  const getAvatarByUser = () => {
    return { background: `url(${user?.imgUrl}) center center / cover` };
  };

  const isHome = location.pathname === '/';
  const isLoginSignup = location.pathname === '/login' || location.pathname === '/signup' ? true : false;
  const isBoard = location.pathname.includes('board');

  if (!user) return <></>

  return (
    <header
      className={`app-header ${isBoard ? 'board' : ''} ${isHome ? 'home' : 'general'} ${isLoginSignup ? 'login-signup' : ''
        }`}>
      <section className="nav-options">
        {!isHome && !user && (
          <NavLink className="home-icon-container" exact to="/">
            <AiFillHome className="home-icon" />
          </NavLink>
        )}
        <NavLink className="logo-container clean-link" exact to="/workspace">
          <ImTrello className="trello-icon" />
          <p className="logo">Skello</p>
        </NavLink>
      </section>

      {/* STT */}
      {/* <SkellMicAssistant /> */}

      {/* HOME */}
      {(user && user.fullname !== 'Guest' && isHome) && (
        <section className="login-signup-container">
          <Link to={'/signup'}>
            <button className="signup-btn">Log out</button>
          </Link>
        </section>
      )}
      {((!user || user.fullname === 'Guest') && isHome) && (
        <section className="login-signup-container">
          <Link to={'/login'}>
            <button className="login-btn">Log in</button>
          </Link>
          <Link to={'/signup'}>
            <button className="signup-btn">Sign up</button>
          </Link>
        </section>
      )}
      {user && !isHome && (
        <section className="user-section">
          <div
            className={`${user?.imgUrl ? 'avatar-image' : 'member-avatar'}`}
            style={getAvatarByUser()}
            onClick={event => {
              onUserClick(event);
            }}>
          </div>
        </section>
      )}
    </header>
  );
}
