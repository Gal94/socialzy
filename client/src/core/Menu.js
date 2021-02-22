import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import Button from '@material-ui/core/Button';
import { isAuthenticated, clearJWT } from './../auth/auth-helper';
import { Link, withRouter } from 'react-router-dom';

const isActive = (history, path) => {
    if (history.location.pathname == path) return { color: '#ff4081' };
    else return { color: '#ffffff' };
};

const Menu = withRouter(({ history }) => (
    <AppBar position='static'>
        <Toolbar>
            <Typography variant='h6' color='inherit'>
                MERN Skeleton
            </Typography>
            <Link to='/'>
                <IconButton aria-label='Home' style={isActive(history, '/')}>
                    <HomeIcon />
                </IconButton>
            </Link>
            <Link to='/users' style={{ textDecoration: 'none' }}>
                <Button style={isActive(history, '/users')}>Users</Button>
            </Link>
            {!isAuthenticated() && (
                <span>
                    <Link to='/signup' style={{ textDecoration: 'none' }}>
                        <Button style={isActive(history, '/signup')}>
                            Sign up
                        </Button>
                    </Link>
                    <Link to='/signin' style={{ textDecoration: 'none' }}>
                        <Button style={isActive(history, '/signin')}>
                            Sign In
                        </Button>
                    </Link>
                </span>
            )}
            {isAuthenticated() && (
                <span>
                    <Link
                        to={'/user/' + isAuthenticated().user._id}
                        style={{ textDecoration: 'none' }}
                    >
                        <Button
                            style={isActive(
                                history,
                                '/user/' + isAuthenticated().user._id
                            )}
                        >
                            My Profile
                        </Button>
                    </Link>
                    <Button
                        color='inherit'
                        onClick={() => {
                            clearJWT(() => history.push('/'));
                        }}
                    >
                        Sign out
                    </Button>
                </span>
            )}
        </Toolbar>
    </AppBar>
));

export default Menu;
