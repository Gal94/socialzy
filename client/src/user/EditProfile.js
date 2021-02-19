import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import FileUpload from '@material-ui/icons/AddPhotoAlternate';
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
    bigAvatar: {
        width: 60,
        height: 60,
        margin: 'auto',
    },
    input: {
        display: 'none',
    },
    filename: {
        marginLeft: '10px',
    },
}));

export default function EditProfile({ match }) {
    const classes = useStyles();
    const [values, setValues] = useState({
        name: '',
        password: '',
        email: '',
        about: '',
        photo: '',
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
            setValues({
                ...values,
                name: data.name,
                email: data.email,
                about: data.about,
            });
        }

        return function cleanup() {
            abortController.abort();
        };
    };

    useEffect(() => {
        fetchUser();
    }, [match.params.userId]);

    const clickSubmit = async () => {
        let userData = new FormData();
        values.name && userData.append('name', values.name);
        values.email && userData.append('email', values.email);
        values.password && userData.append('password', values.password);
        values.about && userData.append('about', values.about);
        values.photo && userData.append('photo', values.photo);
        const data = await updateUser(
            { userId: match.params.userId },
            { t: jwt.token },
            userData
        );

        if (data && data.error) {
            setValues({ ...values, error: data.error });
        } else {
            setValues({ ...values, userId: data._id, redirectToProfile: true });
        }
    };

    const handleChange = (fieldName, e) => {
        const value =
            fieldName === 'photo' ? e.target.files[0] : e.target.value;
        setValues({ ...values, [fieldName]: value });
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
                <span className={classes.filename}>
                    {values.photo ? values.photo.name : ''}
                </span>
                <br />
                <input
                    accept='image/*'
                    onChange={(e) => handleChange('photo', e)}
                    className={classes.input}
                    id='icon-button-file'
                    type='file'
                />
                <label htmlFor='icon-button-file'>
                    <Button
                        variant='contained'
                        color='default'
                        component='span'
                    >
                        Upload
                        <FileUpload />
                    </Button>
                </label>
                <br />
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
                    id='multiline-flexible'
                    label='About'
                    multiline
                    rows='2'
                    margin='normal'
                    className={classes.textField}
                    value={values.about}
                    onChange={(e) => handleChange('about', e)}
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
