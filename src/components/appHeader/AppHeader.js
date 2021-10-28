import { Link, NavLink, useLocation } from 'react-router-dom';

import './appHeader.scss';

const AppHeader = () => {
  const { pathname } = useLocation();

  return (
    <header className='app__header'>
      <h1 className='app__title'>
        <Link to='/'>
          <span>Marvel</span> information portal
        </Link>
      </h1>
      <nav className='app__menu'>
        <ul>
          <li>
            <NavLink isActive={() => pathname !== '/comics'} activeClassName='active' to='/'>
              Characters
            </NavLink>
          </li>
          /
          <li>
            <NavLink activeClassName='active' to='/comics'>
              Comics
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default AppHeader;
