import './styles.scss';
import { sessionService } from '~entities/session';
import { Link, useNavigate } from 'react-router-dom';
import { pathKeys } from '~shared/lib/react-router';
import { UserBlock } from '~widgets/user-block';
import { usePopUpStore } from '~shared/lib/pop-up';
import { LoginPopUp } from '~widgets/login-pop-up';
import { RegisterPopUp } from '~widgets/register-pop-up';

export function Header() {
  const user = sessionService.getCache();

  const navigate = useNavigate();

  const { openPopUp } = usePopUpStore();

  return <header className="header">
    <nav className="header-nav">
      <Link to={pathKeys.home()}>Home</Link>
    </nav>

    <div className="header__auth">
      {user && <>
        <UserBlock user={user} />

        <button className="header__button header__button_logout" type="button" onClick={() => {
          localStorage.removeItem('token');
          sessionService.removeCache();
          navigate(pathKeys.landing());
        }}>
          Logout
        </button>
      </>}

      {!user && <>
        <button className="header__button header__button_sign-in" type="button" onClick={() => {
          openPopUp({ Component: LoginPopUp, title: 'Sign In' });
        }}>
          Sign In
        </button>

        <button className="header__button header__button_sign-up" type="button" onClick={() => {
          openPopUp({ Component: RegisterPopUp, title: 'Sign Up' });
        }}>
          Sign Up
        </button>
      </>}
    </div>
  </header>;
}