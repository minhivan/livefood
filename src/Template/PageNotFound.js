import React from "react";

import pic_404 from "../images/Icon/404_failed_loading_gray_wash.svg"
import {makeStyles} from "@material-ui/core/styles";
import {Button} from "@material-ui/core";
import {Link} from "react-router-dom";


const useStyles = makeStyles((theme) => ({
    redirect: {
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        paddingTop: "20px"
    },
    details: {
        padding: "20px 0"
    },
    title: {
        color: "#ffffff",
    },
    button: {
        padding: "10px 35px",
        background: "#1a90da"
    }
}));

function PageNotFound(){
    const classes = useStyles();
    return (
        <div className="app__bodyContainer">
            <div className="page404">
                <div className={classes.redirect}>
                    <div className={classes.image}>
                        <img src={pic_404} alt="404 error" height="90"/>
                    </div>
                    <div className={classes.details}>
                        <h1>This page doesn’t exist</h1>
                        <p>Please check your URL or return to LiveFood home.</p>
                    </div>
                    <div className={classes.return}>
                        <Button variant="contained" color="primary" className={classes.button}>
                            <Link to="/"><span className={classes.title}>Home</span></Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PageNotFound

