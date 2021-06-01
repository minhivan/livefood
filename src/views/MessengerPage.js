import React, {useEffect, useState} from "react";

import SidebarChat from "../components/Messenger/Sidebar/SidebarChat";
import Chat from "../components/Messenger/Chat";
import Page from "../components/Page";

import IconButton from "@material-ui/core/IconButton";
import ControlPointOutlinedIcon from "@material-ui/icons/ControlPointOutlined";
import {makeStyles} from "@material-ui/core/styles";
import CreateNewChat from "../components/Messenger/Sidebar/CreateNewChat";
import { db} from "../firebase";
import {List} from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";




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

function PageMessenger(props) {
    const {userLogged} = props;
    const [chatList, setChatList] = useState([]);
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    // const userChatRef = db.collection("conversations").where('users', 'array-contains', user.email)
    const [recipientData, setRecipientData] = useState({});
    const [openSnack, setOpenSnack] = useState(false);

    const handleCloseSnack = (event) => {
        setOpenSnack(false);
    };


    useEffect(() => {
        const unsubscribe = db.collection("conversations")
            .where('users', 'array-contains', userLogged.email)
            .orderBy('lastUpdate', 'desc')
            .onSnapshot((snapshot) => {
                setChatList(snapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data(),
                })));
            });

        return () => {
            unsubscribe();
        }
    }, [userLogged])



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
                            chatList ? (
                                chatList.map(({id, data}) => (
                                    <SidebarChat
                                        key={id}
                                        id={id}
                                        participants={data.users}
                                        sender={data.lastSend}
                                        status={data.isSeen}
                                        userLogged={userLogged}
                                        setRecipientData={setRecipientData}
                                        lastMessage={data.lastMessage}
                                    />
                                ))
                            ) : null
                        }
                        </List>
                    </div>
                </section>

                <Chat userLogged={userLogged} recipientData={recipientData} setOpenSnack={setOpenSnack} />
            </div>


            {/*  Create chat  */}
            {
                open ? (
                    <CreateNewChat open={open} handleClose={handleClose} userLogged={props.userLogged}/>
                ) : null
            }

            {
                openSnack ? (
                    <Snackbar
                        open={openSnack}
                        autoHideDuration={6000}
                        onClose={handleCloseSnack}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                    >
                        <Alert variant="filled" onClose={handleCloseSnack} severity="success">
                            Successfully !
                        </Alert>
                    </Snackbar>
                ) : null
            }

        </Page>
    )
}

export default PageMessenger