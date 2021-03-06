import React, {useEffect, useRef, useState} from 'react';
import {useForm} from "react-hook-form";
import {requestLogin, validateAuthToken, validateRefreshToken} from "../api/loginAPI";
import {useDispatch} from "react-redux";
import {logIn, logOut} from "../actions";
import bluemarlin from "../icons/bluemarlin.png"
import {useCookies} from "react-cookie";
import {openPopup} from "../actions/PopupActions";
import {KEYWORD_CREATE, TOAST_OPTION} from "../constant/constants";
import RegisterPopup from "./popups/RegisterPopup";
import {toast} from "react-toastify";


const Login = () => {
    const dispatch = useDispatch();
    const {register, handleSubmit, watch, errors} = useForm();
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const [cookies, setCookie, removeCookie] = useCookies(['access-token']);
    const [registerClick, setRegisterClick] = useState(false);

    const validateLogin = async() => {
        let token = await cookies['access-token'];
        let response  = await validateAuthToken(token);
        return response;
    }

    useEffect(()=>{
        validateLogin()
            .then(res=>{
                let {status, data} = res;
                if(status === 200){
                    dispatch(logIn(data));
                }
            })
            .catch(async(e)=>{
                if(e.response.status === 500){
                    let refreshToken = localStorage.getItem('refresh-token');
                    let response = await validateRefreshToken(refreshToken);
                    await setCookie('access-token', response.headers["x-auth-token"], {'httoOnly':true})
                }
            });
    });

    const onSubmit = async () => {
        let username = usernameRef.current.value;
        let password = passwordRef.current.value;

        const result = await requestLogin(username, password);
        if(result === 'Authentication failure'){
            toast.error('Login failed', TOAST_OPTION);
            dispatch(logOut());
        }else {
            const {status, access_token, refresh_token} = result;
            if(status === 'success'){
                await setCookie('access-token', access_token, {'httoOnly':true})
                await localStorage.setItem('refresh-token', refresh_token);
                await dispatch(logIn(username));
            }
        }
    }

    const onRegisterButtonClick = () => {
        dispatch(openPopup(
            KEYWORD_CREATE, {
                title: 'bluemarlin',
                contentComponent: ()=>RegisterPopup(),
                disableFooter: true,
                width: 700,
                height: 500
            }
        ));
    }

    return (
        <div className={"ui center aligned grid"} style={{"marginTop":"100px"}}>
            <div className={"column"}>
                <img className={"logo"} src={bluemarlin}/>
                <form className={"ui large form form-margin"} onSubmit={handleSubmit(onSubmit)}>
                    <div className={"field"}>
                        <div className={"ui left icon input"}>
                            <input type={"text"} name={"username"} placeholder={"Enter ID"}
                                ref={usernameRef}
                            />
                        </div>
                    </div>
                    <div className={"field"}>
                        <div className={"ui left icon input"}>
                            <input type={"password"} name={"password"} placeholder={"Enter password"}
                                ref={passwordRef}
                            />
                        </div>
                    </div>

                    <button className={"ui large red forgot button"}>Forgot ID/Password?</button><br/>
                    <div className="ui horizontal divider"></div>
                    <input type={"submit"} value={"Login"} className={"ui large green login button"}/>
                </form>
                <div className={"ui message"}>
                    <button className={"ui large blue register button"} onClick={onRegisterButtonClick}>New to us? Register!</button>
                </div>
            </div>
        </div>
    )
}

export default Login;