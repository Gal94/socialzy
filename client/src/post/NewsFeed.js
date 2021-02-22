import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { isAuthenticated } from './../auth/auth-helper';
import PostList from './PostList';
import { listNewsFeed } from './api-post.js';
import NewPost from './NewPost';

const useStyles = makeStyles((theme) => ({
    card: {
        margin: 'auto',
        paddingTop: 0,
        paddingBottom: theme.spacing(3),
    },
    title: {
        padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(
            2
        )}px`,
        color: theme.palette.openTitle,
        fontSize: '1em',
    },
    media: {
        minHeight: 330,
    },
}));
export default function Newsfeed() {
    const classes = useStyles();
    const [posts, setPosts] = useState([]);
    const jwt = isAuthenticated();

    // Fetch newsfeed and update the posts list
    const fetchNewsFeed = async () => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        const data = await listNewsFeed(
            {
                userId: jwt.user._id,
            },
            {
                t: jwt.token,
            },
            signal
        );

        if (data.error) {
            console.log(data.error);
        } else {
            setPosts(data);
        }

        return function cleanup() {
            abortController.abort();
        };
    };

    useEffect(() => {
        fetchNewsFeed();
    }, []);

    // Executed after adding a post to the db
    const addPost = (post) => {
        const updatedPosts = [...posts];
        updatedPosts.unshift(post);
        setPosts(updatedPosts);
    };

    // Executed after deleting the post from the db
    const removePost = (post) => {
        const updatedPosts = [...posts];
        const index = updatedPosts.indexOf(post);
        updatedPosts.splice(index, 1);
        setPosts(updatedPosts);
    };

    return (
        <Card className={classes.card}>
            <Typography type='title' className={classes.title}>
                Newsfeed
            </Typography>
            <Divider />
            <NewPost addUpdate={addPost} />
            <Divider />
            {/* Passes all posts and a method to remove a post */}
            <PostList removeUpdate={removePost} posts={posts} />
        </Card>
    );
}
