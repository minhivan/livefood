import React from "react";
import {auth, provider } from "../../firebase";
import {Button, TextField} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Link, Navigate} from "react-router-dom";
import {checkSignInWithGoogle, checkFirebaseAuth} from "../../hooks/services";
import {useAuthState} from "react-firebase-hooks/auth"; //import Redirect first
import { useFormik } from 'formik';
import * as yup from 'yup';


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

const validationSchema = yup.object({
    email: yup
        .string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required'),
    username: yup
        .string('Enter your display name')
        .min(6, 'Display name should be of minimum 6 characters length')
        .required('Display name is required'),
    password: yup
        .string('Enter your password')
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Password is required')

});



function PageLogin() {
    const classes = useStyles();
    const [user] = useAuthState(auth);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            username: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            // console.log(values.email);
            signUp(values.email, values.password, values.username);
        },
    });


    const signUp = (email, password, username) => {
        auth.createUserWithEmailAndPassword(email, password)
            .then((authUser) => {
                return authUser.user.updateProfile({
                    displayName: username
                }).then(function (){
                    console.log(authUser.user);
                    checkFirebaseAuth(authUser.user);
                })
            })
            .catch((error) => alert(error.message));
    }

    const signUpGoogle = (event) => {
        event.preventDefault();
        auth.signInWithPopup(provider).then(async (result) => {
            await checkSignInWithGoogle(result.user);
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
                            <form onSubmit={formik.handleSubmit} style={{width: "100%"}}>
                                <TextField
                                    name="username"
                                    label="User name"
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                    error={formik.touched.username && Boolean(formik.errors.username)}
                                    helperText={formik.touched.username && formik.errors.username}
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    placeholder="User name"
                                    autoFocus
                                />
                                <TextField
                                    name="email"
                                    label="Email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    placeholder="Email address"
                                    autoComplete="email"
                                    autoFocus
                                />
                                <TextField
                                    id="password"
                                    name="password"
                                    label="Password"
                                    type="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    placeholder="Password"
                                    autoComplete="current-password"
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                >
                                    Sign up
                                </Button>
                            </form>
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