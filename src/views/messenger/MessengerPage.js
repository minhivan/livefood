import React from "react";
import "../../components/Messenger/Messenger.css";
import SidebarChat from "../../components/Messenger/SidebarChat";
import Chat from "../../components/Messenger/Chat";
import IconButton from "@material-ui/core/IconButton";
import ControlPointOutlinedIcon from "@material-ui/icons/ControlPointOutlined";
import {makeStyles} from "@material-ui/core/styles";
import {useParams} from "react-router";

const useStyles = makeStyles((theme) => ({
    header:{
        paddingLeft: "5px"
    }
}));

function PageMessenger() {
    let { id } = useParams();
    const classes = useStyles();
    return(
        <div className="app__bodyContainer">
            <div className="messenger">
                <section className="messenger__navigation">
                    <div className="navigation__header padding-10-20 messenger__header" >
                        <h2 className={classes.header}>Message</h2>
                        <IconButton aria-label="comment" >
                            <ControlPointOutlinedIcon />
                        </IconButton>
                    </div>
                    <div className="messenger__inbox">
                        <SidebarChat />
                        <SidebarChat />
                        <SidebarChat />
                        <SidebarChat />
                        <SidebarChat />
                        <SidebarChat />
                        <SidebarChat />
                    </div>
                </section>

                <Chat/>
            </div>
        </div>
    )
}

export default PageMessenger