import React from "react";
import IconButton from "@material-ui/core/IconButton";
import ControlPointOutlinedIcon from "@material-ui/icons/ControlPointOutlined";
import {makeStyles} from "@material-ui/core/styles";
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';

import SentimentSatisfiedRoundedIcon from '@material-ui/icons/SentimentSatisfiedRounded';
const useStyles = makeStyles((theme) => ({
    header:{
        paddingLeft: "5px"
    }
}));


function Chat(){
    const classes = useStyles();
    return (
        <div className="messenger__chat">
            <div className="navigation__header padding-10-20 messenger__header">
                <h2 className={classes.header}>User name</h2>
                <IconButton aria-label="comment" >
                    <InfoRoundedIcon />
                </IconButton>
            </div>

            <div className="chat__container">
                <div className="chat__content">

                </div>
            </div>
            <div className="chat__input">
                <form autoComplete="off">
                    <input
                        className="chat__text"
                        id="outlined-basic"
                        placeholder="Message ... "
                        type="text"
                    />
                    <SentimentSatisfiedRoundedIcon />
                </form>
            </div>

        </div>
    )
}

export default Chat