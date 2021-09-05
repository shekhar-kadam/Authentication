import { useContext, useRef, useState } from "react";
import { useHistory } from "react-router";
import AuthContext from "../../store/auth-context";
import classes from "./AuthForm.module.css";


const AuthForm = () => {

    const history =  useHistory();
    const emailInputRef = useRef();
    const passwordInputref = useRef();

    const authCtx = useContext( AuthContext );

    const [ isLogin, setisLogin ] = useState( true );
    const [ isLoadng, setIsLoading ] = useState( false );

    const switchAuthModeHandler = () => {
        setisLogin( (prevState) => !prevState)
    }

    const submitHandler = ( event ) => {
        event.preventDefault();

        const enteredEmail = emailInputRef.current.value;
        const enteredPassword = passwordInputref.current.value;
        setIsLoading( true );
        let url;
        if ( isLogin ) {
            url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBsPO0HeWQrT8E1wqysvqF6T0vlqHi5NyU";
        } else {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBsPO0HeWQrT8E1wqysvqF6T0vlqHi5NyU';
        }
        fetch( url, {
            method: 'POST',
            body: JSON.stringify( {
                email: enteredEmail,
                password: enteredPassword,
                returnSecureToken: true
            } ),
            headers: {
                "content-type": "application/json"
            }
        } ).then( ( res ) => {
            setIsLoading( false );
            if ( res.ok ) {
                return res.json();
            } else {
                return res.json().then( ( data ) => {
                    let errorMessage = "Authentication Failed";
                    console.log( data );
                    throw new Error(errorMessage)
                } );
            }
        } )
            .then( ( data ) => {
                const expirationTime = new Date(
                    new Date().getTime() + +data.expiresIn * 1000
                )
                authCtx.login( data.idToken, expirationTime.toISOString() );
                history.replace( "/" );
                console.log( data );
            } )
            .catch( ( err ) => {
                alert( err.message );
            } );
    };

    return (
        <section className={classes.auth}>
            <h1>{isLogin ? "Login": "Sign Up" }</h1>
            <form onSubmit={submitHandler}>
                <div className={classes.control}>
                    <label htmlFor="email">Your Email</label>
                    <input type="email" id="email" required ref={ emailInputRef}/>
                </div>
                <div className={classes.control}>
                    <label htmlFor="password">Your Password</label>
                    <input type="password" id="password" required ref={ passwordInputref}/>
                </div>
            
                <div className={classes.actions}>
                    {!isLoadng && <button>{isLogin ? "Login" : "Create Account"}</button>}
                    {isLoadng && <p>Sending Request...</p>}
                    <button className={classes.toggle} onClick={switchAuthModeHandler}>
                        {isLogin ? 'Create a New Account' : 'Logn With Existing Account'}
                    </button>
                </div>
        </form>
        </section>
    )
};

export default AuthForm;