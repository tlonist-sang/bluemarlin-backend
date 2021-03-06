import bluemarlinAPI from "./baseApi";

const queryString = require('querystring');

export const requestLogin = async (username, password) => {
    let url = '/auth';
    let option = {
        method: 'POST',
        url: url,
        params: {
            username: username,
            password: password
        }
    }
    let response = await bluemarlinAPI(option).catch(e=>{
        return e.response;
    })
    return response.data;
}

export const validateAuthToken = async (token)=> {
    let url = '/login-validation';
    let option = {
        method: 'GET',
        url: url,
        headers: {
            "X-AUTH-TOKEN":token
        }
    }
    let response = await bluemarlinAPI(option);
    return response;
}

export const validateRefreshToken = async (token) => {
    let url = '/login-validation';
    let option = {
        method: 'GET',
        url: url,
        headers: {
            "X-REFRESH-TOKEN":token
        }
    }
    let response = await bluemarlinAPI(option);
    return response;
}

export const registerUser = async(userId, email, password) => {
    let url = '/register';
    let option = {
        method: 'POST',
        url: url,
        data: {
            userId: userId,
            email: email,
            password: password,
            passwordConfirm: password
        }
    }
    let response = await bluemarlinAPI(option);
    return response;
}

export const checkUserNameExist = async (userId) => {
    let url = `/name`;
    let option = {
        method: 'GET',
        url: url,
        params: {
            userId: userId
        }
    }
    let response = await bluemarlinAPI(option);
    return response.data;
}