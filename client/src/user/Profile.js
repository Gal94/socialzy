import { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Edit from '@material-ui/icons/Edit';
import Person from '@material-ui/icons/Person';
import Divider from '@material-ui/core/Divider';
import DeleteUser from './DeleteUser';
import { isAuthenticated } from '../auth/auth-helper';
import { read } from './api-user';

const useStyles = makeStyles((theme) => ({
    root: theme.mixins.gutters({
        maxWidth: 600,
        margin: 'auto',
        padding: theme.spacing(3),
        marginTop: theme.spacing(5),
    }),
    title: {
        marginTop: theme.spacing(3),
        color: theme.palette.protectedTitle,
    },
}));

export default function Profile({ match }) {
    const classes = useStyles();
    const [user, setUser] = useState({ name: '', email: '', about: '' });
    const [redirectToSignin, setRedirectToSignin] = useState(false);
    const jwt = isAuthenticated;

    // Fetch user, if failed instruct to redirect
    const fetchUser = async () => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        const data = await read(
            { userId: match.params.userId },
            { t: jwt.token },
            signal
        );

        if (data && data.error) {
            setRedirectToSignin(true);
        } else {
            setUser(data);
        }

        return function cleanup() {
            abortController.abort();
        };
    };

    const photoUrl = user._id
        ? `http://localhost:5000/api/users/photo/${
              user._id
          }?${new Date().getTime()}`
        : 'http://localhost:5000/api/users/defaultphoto';

    useEffect(() => {
        fetchUser();
    }, [match.params.userId]);

    if (redirectToSignin) {
        return <Redirect to='/signin' />;
    }
    console.log(photoUrl);
    return (
        <Paper className={classes.root} elevation={4}>
            <Typography variant='h6' className={classes.title}>
                Profile
            </Typography>
            <List dense>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar src={photoUrl}>
                            <Person />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={user.name} secondary={user.email} />{' '}
                    {/* Render the edit profile option if that is the logged in user */}
                    {isAuthenticated().user &&
                        isAuthenticated().user._id == user._id && (
                            <ListItemSecondaryAction>
                                <Link to={'/user/edit/' + user._id}>
                                    <IconButton
                                        aria-label='Edit'
                                        color='primary'
                                    >
                                        <Edit />
                                    </IconButton>
                                </Link>
                                <DeleteUser userId={user._id} />
                            </ListItemSecondaryAction>
                        )}
                </ListItem>
                <ListItem>
                    {' '}
                    <ListItemText primary={user.about} />{' '}
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText
                        primary={
                            'Joined: ' + new Date(user.created).toDateString()
                        }
                    />
                </ListItem>
            </List>
        </Paper>
    );
}
