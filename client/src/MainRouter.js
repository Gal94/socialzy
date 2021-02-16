import { Route, Switch } from 'react-router-dom';
import Home from './core/Home';
import Signup from './user/Signup';
import Users from './user/Users';
import Signin from './auth/Signin';
const MainRouter = () => {
    return (
        <div>
            <Switch>
                <Route path='/users' component={Users} />
                <Route path='/signup' component={Signup} />
                <Route exact path='/' component={Home} />
                <Route path='/signin' component={Signin} />
            </Switch>
        </div>
    );
};

export default MainRouter;
