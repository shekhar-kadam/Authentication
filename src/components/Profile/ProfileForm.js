import { useContext, useRef } from "react";
import classes from "./ProfileForm.module.css";
import AuthContext from "../../store/auth-context";
import { useHistory } from "react-router";

const ProfileForm = () => {

    const history =  useHistory();
    const newPasswordInputRef = useRef();

    const authCtx = useContext( AuthContext )
    console.log( authCtx );

    const submitHandler = ( event ) => {
        event.preventDefault();

        const enteredNewPassword = newPasswordInputRef.current.value;

        fetch( "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBsPO0HeWQrT8E1wqysvqF6T0vlqHi5NyU", {
            method: 'POST',
            body: JSON.stringify( {
                idToken: authCtx.token,
                password: enteredNewPassword,
                returnSecureToken: false
            } ),
            headers: {
                "Content-Type" : "application/json"
            }
        } ).then( res => {
            history.replace( "/" );
            console.log(res.data)
        })
    }
    
    return (
        <form className={classes.form} onSubmit={submitHandler}>
            <div className={classes.control}>
                <label htmlFor="new-password">New Password</label>
                <input type="password" id="new-passsword" ref={newPasswordInputRef} required />
            </div>
            <div className={classes.action}>
                <button>Change Password</button>
            </div>
            </form>
    );
};

export default ProfileForm;