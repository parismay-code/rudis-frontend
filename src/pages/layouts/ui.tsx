import { useEffect } from 'react';
import { LoginPopUp } from '~widgets/login-pop-up';
import { Navigate, Outlet, useSearchParams } from 'react-router-dom';
import { useSuspenseQuery } from '@tanstack/react-query';
import { sessionService } from '~entities/session';
import { pathKeys } from '~shared/lib/react-router';
import { Header } from '~widgets/header';
import { PopUp, usePopUpStore } from '~shared/lib/pop-up';
import './styles.scss';

function Layout() {
  return (<>
      <div className="layout">
        <Header />
        <div className="container">
          <Outlet />
        </div>
      </div>
      <PopUp />
    </>
  );
}

export function GenericLayout() {
  const { data: user } = useSuspenseQuery(sessionService.queryOptions());

  if (!user) {
    return <Navigate to={pathKeys.landing()} />;
  }

  return <Layout />;
}

export function GuestLayout() {
  const [params] = useSearchParams();

  const { openPopUp } = usePopUpStore();

  useEffect(() => {
    if (params.get('unauthorized')) {
      openPopUp({ Component: LoginPopUp, title: 'Sign In' });
    }
  }, [params, openPopUp]);

  return <Layout />;
}

export function NakedLayout() {
  return <Outlet />;
}