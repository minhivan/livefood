import React from "react";

import pic_404 from "../images/Icon/404_failed_loading_gray_wash.svg"
import {makeStyles} from "@material-ui/core/styles";
import {Button} from "@material-ui/core";
import {Link} from "react-router-dom";
import pic from "../images/Background/undraw_page_not_found_su7k.svg";

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
    img: {
        width: "560px",
        display: "inline-block",
        maxWidth: "100%",
        marginTop: "50px"
    },
    imgHolder: {
        textAlign: "center"
    }

}));

function PageNotFound(){
    const classes = useStyles();
    return (
        <div className="app__bodyContainer">
            <div className="page404">
                <div className={classes.redirect}>
                    <div className={classes.details}>
                        <h1>This page doesn’t exist</h1>
                        <p>Please check your URL or return to LiveFood home.</p>
                    </div>
                    <div className={classes.imgHolder}>
                        <img src={pic} alt="404" className={classes.img}/>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PageNotFound

