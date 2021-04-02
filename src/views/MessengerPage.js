import React, {useState} from "react";

import "../components/Messenger/Messenger.css";
import SidebarChat from "../components/Messenger/Sidebar/SidebarChat";
import Chat from "../components/Messenger/Chat";
import Page from "../components/Page";
import {useParams} from "react-router";


import IconButton from "@material-ui/core/IconButton";
import ControlPointOutlinedIcon from "@material-ui/icons/ControlPointOutlined";
import {makeStyles} from "@material-ui/core/styles";
import CreateNewChat from "../components/Messenger/Sidebar/CreateNewChat";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../firebase";
import {useCollection} from "react-firebase-hooks/firestore";
import {List} from "@material-ui/core";
import {useDispatch} from "react-redux";
import {removeChat} from "../features/chatSlice";



const useStyles = makeStyles((theme) => ({
    header:{
        paddingLeft: "5px"
    },
    root: {
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
        width: '100%'
    },
    list: {
        padding: 0
    }
}));

function PageMessenger() {
    const dispatch = useDispatch();


    let { id } = useParams();
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [user] = useAuthState(auth);
    const userChatRef = db.collection("conversations").where('users', 'array-contains', user.email);
    const [chatsSnapshot] = useCollection(userChatRef);


    if(typeof id === 'undefined'){
        dispatch(removeChat());
    }

    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    };


    return(
        <Page
            title="Messenger | LiveFood"
            className="app__bodyContainer"
        >
            <div className="messenger">
                <section className="messenger__navigation">
                    <div className="navigation__header padding-10-20 messenger__header" >
                        <h2 className={classes.header}>Message</h2>
                        <IconButton aria-label="comment" onClick={handleOpen}>
                            <ControlPointOutlinedIcon />
                        </IconButton>
                    </div>
                    <div className="messenger__inbox">
                        <List className={classes.list}>
                        {
                            chatsSnapshot?.docs.map((chat) => (
                                <SidebarChat
                                    key={chat.id}
                                    id={chat.id}
                                    users={chat.data().users}
                                />
                            ))
                        }
                        </List>
                    </div>
                </section>

                <Chat id={id}/>
            </div>


            {/*  Create chat  */}
            <CreateNewChat open={open} handleClose={handleClose} user={user}/>
        </Page>
    )
}

export default PageMessenger