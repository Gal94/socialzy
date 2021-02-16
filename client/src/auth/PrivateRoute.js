import { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from './auth-helper';

// Components will only load when user is authenticated
const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={(props) =>
            isAuthenticated() ? (
                <Component {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: '/signin',
                        state: { from: props.location },
                    }}
                />
            )
        }
    />
);

export default PrivateRoute;
