// Send HTTP request to create a user
const createUser = async (user) => {
    try {
        let response = await fetch('http://localhost:5000/api/users/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

const getList = async (signal) => {
    try {
        let response = await fetch('http://localhost:5000/api/users/', {
            method: 'GET',
            signal: signal,
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

const read = async (params, credentials, signal) => {
    try {
        let response = await fetch(
            'http://localhost:5000/api/users/' + params.userId,
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

const updateUser = async (params, credentials, user) => {
    try {
        let response = await fetch(
            'http://localhost:5000/api/users/' + params.userId,
            {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + credentials.t,
                },
                body: JSON.stringify(user),
            }
        );
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

const deleteUser = async (params, credentials) => {
    try {
        let response = await fetch(
            'http://localhost:5000/api/users/' + params.userId,
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

export { createUser, getList, read, updateUser, deleteUser };
