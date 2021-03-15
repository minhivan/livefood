import React from "react";

import {makeStyles} from "@material-ui/core/styles";
import pic from "../../images/Background/undraw_page_not_found_su7k.svg";

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

