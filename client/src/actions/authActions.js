import {GET_ERRORS, SET_CURRENT_USER} from './types';
import setAuthToken from './../utils/setAuthToken';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

//* Register User
export const registerUser = (userData,history) => dispatch =>{ //Redux Thunk
        axios.post('/api/users/register', userData)
            .then(res => history.push('/login'))
            .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            }))
}

//* Login - Get User Token
export const loginUser = userData => dispatch =>{
    axios.post('/api/users/login', userData)
    .then(res => {
        // Save to localStorage
        const {token} = res.data; //const token = res.data.token
        // Set token to ls (browser)
        localStorage.setItem('jwtToken', token); //save data across sessions
        // Set token to Auth header
        setAuthToken(token);
        // Decode token to get user data
        const decode = jwt_decode(token);
        // Set current user
        dispatch(setCurrentUser(decode));
    })
    .catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }))
};

//* log user out
export const logoutUser = () => dispatch =>{
    // Remove token from localStorage
    localStorage.removeItem('jwtToken');
    // Remove auth header for future requests
    setAuthToken(false);
    // Set current user to {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
}

// Set logged in user
export const setCurrentUser = (decoded) =>{
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}
