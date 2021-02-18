import { Route, Switch } from 'react-router-dom';
import Home from './core/Home';
import Signup from './user/Signup';
import Users from './user/Users';
import Signin from './auth/Signin';
import Profile from './user/Profile';
import PrivateRoute from './auth/PrivateRoute';
import EditProfile from './user/EditProfile';
import Menu from './core/Menu';
const MainRouter = () => {
    return (
        <div>
            <Menu />
            <Switch>
                <Route path='/users' component={Users} />
                <PrivateRoute
                    path='/user/edit/:userId'
                    component={EditProfile}
                />
                <Route path='/user/:userId' component={Profile} />
                <Route path='/signup' component={Signup} />
                <Route path='/signin' component={Signin} />
                <Route exact path='/' component={Home} />
            </Switch>
        </div>
    );
};

export default MainRouter;
