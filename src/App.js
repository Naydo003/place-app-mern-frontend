import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook'
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

// lazy loading routes makes webpack bundle into smaller chuncks so that initila page load file size will be smaller
const Users = React.lazy(() => import('./user/pages/Users'))              // This one didn't need to be lazy loaded as it is our home screen but having the code doesn't matter
const NewPlace = React.lazy(() => import('./places/pages/NewPlace'))
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'))
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'))
const Auth = React.lazy(() => import('./user/pages/Auth'))


const App = () => {
  const { token, login, logout, userId } = useAuth()

  let routes;

  if (token) {
    routes = (             // switch makes it so that only one will be selected so that the redirects won't run
      <Switch>                         
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{ 
        isLoggedIn: !!token,        //    !!token converts to true/false  ,   this is a convenience prop as we already have subsequent functions written with isLoggedIn
        token: token,
        userId: userId, 
        login: login, 
        logout: logout 
      }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Suspense fallback={
            <div className='center'>
              <LoadingSpinner />
            </div>
          }>
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
