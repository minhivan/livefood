import React, {useState} from "react";
import {auth, provider} from "../../firebase";
import {Button, TextField} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Link, Navigate} from "react-router-dom";
//import FacebookIcon from '../../icons/Facebook';
import GoogleIcon from '../../icons/Google';
import Page from "../../components/Page";
import checkFirebaseAuth from "../../hooks/firebaseAuth";
import {useAuthState} from "react-firebase-hooks/auth";
import AlertPopup from "../../components/Popup/AlertPopup";
import firebase from "firebase";

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


function PageForgotPassword() {
    const classes = useStyles();
    const [email, setEmail] = useState('');
    const [user] = useAuthState(auth);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('')

    const handleClosePopup = (event) => {
        setOpen(false);
    };


    if(user){
        return <Navigate to="/"/>
    }

    const handleForgot = () => {
        var auth = firebase.auth();
        auth.sendPasswordResetEmail(email).then(function() {
            setOpen(true);
            setMessage("An email has been sent for verification. Please check your email !");
        }).catch(function(error) {
            setOpen(true);
            setMessage(error.message)
        });
    }


    return(
        <Page
            className={classes.root}
            title="Forgot your password"
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

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    onClick={handleForgot}
                                >
                                    Send email
                                </Button>
                            </div>

                            <div className={classes.dividerSection}>
                                <div className={classes.part}/>
                                <div className={classes.split}><span>Or</span></div>
                                <div className={classes.part}/>
                            </div>

                            <div className={classes.SignUpHolder}>
                                <span>Already do it ? Heading back</span>
                                <Link to="/login" className={classes.SignUp}>Sign in</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AlertPopup open={open} handleClose={handleClosePopup} title="LiveFood" message={message}/>
        </Page>

    )
}
export default PageForgotPassword;