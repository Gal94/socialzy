import { signout } from './api-auth';

const authenticate = (jwt, cb) => {
    // Ensure whoever tried to login is on a browser
    if (typeof window !== 'undefined') {
        localStorage.setItem('jwt', JSON.stringify(jwt));
    }
    cb();
};

const isAuthenticated = () => {
    // Check if on browser
    if (typeof window == 'undefined') return false;
    // Check if logged in
    if (localStorage.getItem('jwt'))
        return JSON.parse(localStorage.getItem('jwt'));
    // If not return false
    return false;
};

const clearJWT = async (cb) => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt');
    }
    cb();
    const data = await signout();
    document.cookie = 't=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};
export { authenticate, isAuthenticated };
