const listNewsFeed = async (params, credentials, signal) => {
    try {
        let response = await fetch(
            'http://localhost:5000/api/posts/feed/' + params.userId,
            {
                method: 'GET',
                signal: signal,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + credentials.t,
                },
            }
        );
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

// Fetches all posts by a single user
const postsByUser = async (params, credentials) => {
    try {
        let response = await fetch(
            'http://localhost:5000/api/posts/by/' + params.userId,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + credentials.t,
                },
            }
        );
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

// Invoke a POST request to create a new post. post param is a formData(might contain image) object
const createNewPost = async (params, credentials, post) => {
    try {
        let response = await fetch(
            'http://localhost:5000/api/posts/new/' + params.userId,
            {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + credentials.t,
                    Accept: 'application/json',
                },
                body: post,
            }
        );
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

const like = async (params, credentials, postId) => {
    try {
        let response = await fetch('http://localhost:5000/api/posts/like', {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + credentials.t,
            },
            body: JSON.stringify({ userId: params.userId, postId: postId }),
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

const unlike = async (params, credentials, postId) => {
    try {
        let response = await fetch('http://localhost:5000/api/posts/unlike', {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + credentials.t,
            },
            body: JSON.stringify({ userId: params.userId, postId: postId }),
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

const remove = async (params, credentials) => {
    try {
        let response = await fetch(
            'http://localhost:5000/api/posts/' + params.postId,
            {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + credentials.t,
                },
            }
        );
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

const addComment = async (params, credentials, postId, comment) => {
    try {
        let response = await fetch('http://localhost:5000/api/posts/comment', {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + credentials,
            },
            body: JSON.stringify({
                userId: params.userId,
                postId: postId,
                comment: comment,
            }),
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

const removeComment = async (params, credentials, postId, comment) => {
    try {
        let response = await fetch(
            'http://localhost:5000/api/posts/uncomment/',
            {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + credentials.t,
                },
                body: JSON.stringify({
                    userId: params.userId,
                    postId: postId,
                    comment: comment,
                }),
            }
        );
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

export {
    listNewsFeed,
    postsByUser,
    createNewPost,
    like,
    unlike,
    remove,
    addComment,
    removeComment,
};
