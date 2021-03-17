import React, {useEffect, useState} from "react";
import {auth, provider} from "../../firebase";
import {Button, TextField} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Link, Navigate} from "react-router-dom";
//import FacebookIcon from '../../icons/Facebook';
import GoogleIcon from '../../icons/Google';
import Page from "../../components/Page";

const useStyles = makeStyles((theme) => ({
    button: {
        padding: "13px",
        fontSize: "18px",
        fontWeight: "bold",
        margin: "16px 0",
        // backgroundColor: "#006eb1",
        textTransform: "capitalize",
        // '&:hover': {
        //     backgroundColor: "#015081",
        // },
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
        paddingBottom: "20px"
    },
    forgot: {
        textAlign: "center",
        display: "block",
        color: "#00376b",
        fontWeight: "bold",
        fontSize: "13px",
        padding: "10px 0"
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
    dividerSection: {
        margin: "20px 0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    part: {
        width: "calc(100% / 2 - 50px)",
        borderTop: "1px solid #b6b6b6",
    },
    googleSignin: {
        padding: "13px",
        fontSize: "18px",
        fontWeight: "bold",
        margin: "16px 0",
        // backgroundColor: "#0095f6",
        textTransform: "capitalize",
        // '&:hover': {
        //     backgroundColor: "#0171b8",
        // },
    }



}));


function PageLogin() {
    const classes = useStyles();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);

    const signUpGoogle = (event) => {
        event.preventDefault();
        auth.signInWithPopup(provider).catch((error) =>{
            alert(error.message)
        })
    }

    const signIn = (event) => {
        event.preventDefault();
        auth.signInWithEmailAndPassword(email, password)
            .catch((error) => {
                alert(error.message);
            });
    }

    useEffect( () => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if(authUser){
                setUser(authUser);
            }else{
                setUser(null);
            }
        })
        return () => {
            unsubscribe();
        }
    }, [user])

    if(user){
        return <Navigate to="/"/>
    }

    return(
        <Page
            className={classes.root}
            title="Login"
        >
            <div className="login__container">
                <div className="login__block">
                    <div className="login__background login__article"/>
                    <div className="login__holder login__article">
                        <div className="login__authForm">
                            <div className={classes.logo}>
                                <img className="header__imageLogo" alt="LiveFood"
                                     src="/static/images/brand.png"
                                />
                            </div>
                            <div className={classes.form} >
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
                                    onClick={signIn}
                                >
                                    Log in
                                </Button>
                            </div>

                            <div className={classes.dividerSection}>
                                <div className={classes.part}/>
                                <div className={classes.split}><span>Or</span></div>
                                <div className={classes.part}/>
                            </div>
                            <Button
                                fullWidth
                                variant="contained"
                                className={classes.googleSignin}
                                onClick={signUpGoogle}
                                startIcon={<GoogleIcon />}
                            >
                                Sign up with Google
                            </Button>
                            <Link to="" className={classes.forgot}>Forgot your password ?</Link>

                            <div className={classes.divider} />
                            <div className={classes.SignUpHolder}>
                                <span>Don't have an account ?</span>
                                <Link to="/register" className={classes.SignUp}>Sign up</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Page>

    )
}
export default PageLogin;