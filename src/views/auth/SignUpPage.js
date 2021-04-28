import React, {useEffect, useState} from "react";
import {auth, provider } from "../../firebase";
import {Button, TextField} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Link, Navigate} from "react-router-dom";
import checkFirebaseAuth from "../../hooks/firebaseAuth";
import {useAuthState} from "react-firebase-hooks/auth"; //import Redirect first



const useStyles = makeStyles((theme) => ({
    button: {
        padding: "13px",
        fontSize: "18px",
        fontWeight: "bold",
        margin: "16px 0",
        backgroundColor: "#006eb1",
        textTransform: "capitalize",
        '&:hover': {
            backgroundColor: "#015081",
        },
    },
    divider: {
        margin: "16px 0",
        borderTop: "1px solid #b6b6b6",
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    logo: {
        textAlign: "center",
        padding: "10px 0",
    },
    SignUpHolder: {
        display: "flex",
        justifyContent: "center",
    },
    SignUp: {
        padding: "0 10px",
        fontWeight: "bold",
        color: "#0095f6"
    },
    slogan: {
        color: "#8e8e8e",
        fontSize: "17px",
        fontWeight: "600",
        lineHeight: "20px",
        margin: "0 40px 10px",
        textAlign: "center"
    },
    googleSignin: {
        padding: "13px",
        fontSize: "18px",
        fontWeight: "bold",
        margin: "16px 0",
        backgroundColor: "#0095f6",
        textTransform: "capitalize",
        '&:hover': {
            backgroundColor: "#0171b8",
        },
    }

}));


function PageLogin() {
    const classes = useStyles();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [user] = useAuthState(auth);

    const signUp = (event) => {
        auth.createUserWithEmailAndPassword(email, password)
            .then((authUser) => {
                return authUser.user.updateProfile({
                    displayName: username
                }).then(function (){
                    checkFirebaseAuth(authUser.user);
                })
            })
            .catch((error) => alert(error.message));
    }

    const signUpGoogle = (event) => {
        event.preventDefault();
        auth.signInWithPopup(provider).then((result) => {
            checkFirebaseAuth(result.user);
        }).catch((error) =>{
            alert(error.message)
        })
    }


    if(user){
        return <Navigate to="/" />
    }

    return(
        <div className="login__container">
            <div className="login__block">
                <div className="login__holder login__article">
                    <div className="login__authForm">
                        <div className={classes.logo}>
                            <img className="header__imageLogo" alt="LiveFood"
                                 src="/static/images/brand.png"
                            />
                        </div>
                        <h2 className={classes.slogan}>Sign up to see photos and videos from your friends.</h2>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.googleSignin}
                            onClick={signUpGoogle}
                        >
                            Sign up with Google
                        </Button>

                        <div className={classes.divider} />

                        <div className={classes.form}>

                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Username"
                                id="username"
                                placeholder="Username"
                                value={username}
                                name="username"
                                autoComplete="false"
                                autoFocus
                                onChange={(e) => setUsername(e.target.value)}

                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Email address"
                                id="email"
                                placeholder="Email address"
                                value={email}
                                name="email"
                                autoComplete="email"
                                autoFocus
                                onChange={(e) => setEmail(e.target.value)}

                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                label="Password"
                                fullWidth
                                name="password"
                                value={password}
                                placeholder="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={(e) => setPassword(e.target.value)}

                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={signUp}
                            >
                                Sign up
                            </Button>
                        </div>
                        <div className={classes.divider} />
                        <div className={classes.SignUpHolder}>
                            <span>Have an account ?</span>
                            <Link to="/login" className={classes.SignUp}>Log in</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PageLogin;