import React, {useState} from "react";
import {auth, provider} from "../../firebase";
import {Button, TextField} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Link, Navigate} from "react-router-dom";
//import FacebookIcon from '../../icons/Facebook';
import GoogleIcon from '../../images/icons/Google';
import Page from "../../components/Page";
import {checkSignInWithGoogle} from "../../hooks/services";
import {useAuthState} from "react-firebase-hooks/auth";
import AlertPopup from "../../components/Popup/AlertPopup";
import {useFormik} from "formik";
import * as yup from "yup";

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



const validationSchema = yup.object({
    email: yup
        .string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required'),
    password: yup
        .string('Enter your password')
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Password is required')

});


function PageLogin() {
    const classes = useStyles();
    const [user] = useAuthState(auth);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('')

    const handleClosePopup = (event) => {
        setOpen(false);
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log(values.email);
            signIn(values.email, values.password);
        },
    });

    const signUpGoogle = (event) => {
        event.preventDefault();
        auth.signInWithPopup(provider).then(async (result) => {
             await checkSignInWithGoogle(result.user);
        }).catch((error) =>{
            setOpen(true);
            setMessage(error.message)
        })
    }

    const signIn = (email, password) => {
        auth.signInWithEmailAndPassword(email, password)
            .catch((error) => {
                // alert(error.message);
                setOpen(true);
                setMessage(error.message)
            });
    }

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
                                <form onSubmit={formik.handleSubmit} style={{width: "100%"}}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Email address"
                                        id="email"
                                        placeholder="Email address"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        error={formik.touched.email && Boolean(formik.errors.email)}
                                        helperText={formik.touched.email && formik.errors.email}
                                        name="email"
                                        autoComplete="email"
                                        autoFocus

                                    />
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        label="Password"
                                        fullWidth
                                        name="password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        error={formik.touched.password && Boolean(formik.errors.password)}
                                        helperText={formik.touched.password && formik.errors.password}
                                        placeholder="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"

                                    />

                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}

                                    >
                                        Log in
                                    </Button>
                                </form>
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
                            <Link to="/forgot" className={classes.forgot}>Forgot your password ?</Link>

                            <div className={classes.divider} />
                            <div className={classes.SignUpHolder}>
                                <span>Don't have an account ?</span>
                                <Link to="/register" className={classes.SignUp}>Sign up</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AlertPopup open={open} handleClose={handleClosePopup} title="LiveFood" message={message}/>
        </Page>

    )
}
export default PageLogin;