import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import { isAuthenticated } from '../auth/auth-helper';
import { read, updateUser } from './api-user';
import { Redirect } from 'react-router';

const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: 600,
        margin: 'auto',
        textAlign: 'center',
        marginTop: theme.spacing(5),
        paddingBottom: theme.spacing(2),
    },
    title: {
        margin: theme.spacing(2),
        color: theme.palette.protectedTitle,
    },
    error: {
        verticalAlign: 'middle',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300,
    },
    submit: {
        margin: 'auto',
        marginBottom: theme.spacing(2),
    },
}));

export default function EditProfile({ match }) {
    const classes = useStyles();
    const [values, setValues] = useState({
        name: '',
        password: '',
        email: '',
        open: false,
        error: '',
        redirectToProfile: false,
    });

    const jwt = isAuthenticated();

    const fetchUser = async () => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        const data = await read(
            { userId: match.params.userId },
            { t: jwt.token },
            signal
        );

        // user gets back the new name, email
        if (data && data.error) {
            setValues({ ...values, error: data.error });
        } else {
            setValues({ ...values, name: data.name, email: data.email });
        }

        return function cleanup() {
            abortController.abort();
        };
    };

    useEffect(() => {
        fetchUser();
    }, [match.params.userId]);

    const clickSubmit = async () => {
        const user = {
            name: values.name || undefined,
            email: values.email || undefined,
            password: values.password || undefined,
        };
        const data = await updateUser(
            { userId: match.params.userId },
            { t: jwt.token },
            user
        );

        if (data && data.error) {
            setValues({ ...values, error: data.error });
        } else {
            setValues({ ...values, userId: data._id, redirectToProfile: true });
        }
    };

    const handleChange = (fieldName, e) => {
        setValues({ ...values, [fieldName]: e.target.value });
    };

    if (values.redirectToProfile) {
        return <Redirect to={`/user/${match.params.userId}`} />;
    }

    return (
        <Card className={classes.card}>
            <CardContent>
                <Typography variant='h6' className={classes.title}>
                    Edit Profile
                </Typography>
                <TextField
                    id='name'
                    label='Name'
                    className={classes.textField}
                    value={values.name}
                    onChange={(e) => handleChange('name', e)}
                    margin='normal'
                />
                <br />
                <TextField
                    id='email'
                    type='email'
                    label='Email'
                    className={classes.textField}
                    value={values.email}
                    onChange={(e) => handleChange('email', e)}
                    margin='normal'
                />
                <br />
                <TextField
                    id='password'
                    type='password'
                    label='Password'
                    className={classes.textField}
                    value={values.password}
                    onChange={(e) => handleChange('password', e)}
                    margin='normal'
                />
                <br />{' '}
                {values.error && (
                    <Typography component='p' color='error'>
                        <Icon color='error' className={classes.error}>
                            error
                        </Icon>
                        {values.error}
                    </Typography>
                )}
            </CardContent>
            <CardActions>
                <Button
                    color='primary'
                    variant='contained'
                    onClick={clickSubmit}
                    className={classes.submit}
                >
                    Submit
                </Button>
            </CardActions>
        </Card>
    );
}
