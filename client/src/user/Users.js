import { useState, useEffect } from 'react';
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
import ArrowForward from '@material-ui/icons/ArrowForward';
import Person from '@material-ui/icons/Person';
import { Link } from 'react-router-dom';
import { getList } from './api-user';

const useStyles = makeStyles((theme) => ({
    root: theme.mixins.gutters({
        padding: theme.spacing(1),
        margin: theme.spacing(5),
    }),
    title: {
        margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
        color: theme.palette.openTitle,
    },
    text: {
        textDecoration: 'none',
    },
}));

export default function Users() {
    const classes = useStyles();
    const [users, setUsers] = useState([1]);

    // if the component unmounts before request has been completed, it will be aborted
    const fetchUsers = async () => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        const data = await getList(signal);
        if (data && data.error) {
            console.log(data.error);
        } else {
            setUsers(data);
        }

        return function cleanup() {
            abortController.abort();
        };
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <Paper className={classes.root} elevation={4}>
            <Typography variant='h6' className={classes.title}>
                All Users
            </Typography>
            <List dense>
                {users.map((user, index) => {
                    return (
                        <Link
                            to={`/user/${user._id}`}
                            key={index}
                            className={classes.text}
                        >
                            <ListItem button>
                                <ListItemAvatar>
                                    <Avatar
                                        src={
                                            `http://localhost:5000/api/users/photo/${
                                                user._id
                                            }?${new Date().getTime()}` ||
                                            'http://localhost:5000/api/users/defaultphoto'
                                        }
                                    >
                                        <Person />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={user.name} />
                                <ListItemSecondaryAction>
                                    <IconButton>
                                        <ArrowForward />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </Link>
                    );
                })}
            </List>
        </Paper>
    );
}
