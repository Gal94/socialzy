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

export { listNewsFeed, postsByUser, createNewPost };
