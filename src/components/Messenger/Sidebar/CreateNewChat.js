import React, {useEffect, useState} from "react";
import {IconButton, Modal, TextField} from "@material-ui/core";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";

import {makeStyles} from "@material-ui/core/styles";
import {green} from "@material-ui/core/colors";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import {db} from "../../../firebase";
import {useCollection} from "react-firebase-hooks/firestore";
import Avatar from "@material-ui/core/Avatar";
import firebase from "firebase";
import {useNavigate} from "react-router-dom";
import {handleCreateChat} from "../../../hooks/services";



function getModalStyle() {
    const top = 50 ;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}


const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 500,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 3, 3),
        borderRadius: "8px",
        maxHeight: "740px",
        "&:focus": {
            outline: "none"
        },
        display: "flex",
        flexDirection: "column"
    },
    modalHeader: {
        display: "flex",
        justifyContent: "center",
        padding: "10px 0 20px 0",
        borderBottom: "1px solid #39CCCC"
    },
    buttonClose: {
        position: "fixed",
        right: "20px",
        top: "17px"
    },
    inputText: {
        width: "100%",
        padding: "10px 0",
        minHeight: "100px",
        maxHeight: "250px",
        fontFamily: "'Quicksand', sans-serif"
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    input: {
        display: "flex",
        padding: "20px 10px",
        alignItems: "center"
    },
    suggest: {
        display: "flex",
        padding: "20px 0",
        overflowY: "auto",
        flexDirection: "column",
    },
    userToChat: {
        padding: "10px 10px 10px 0 ",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        justifyContent: "space-between"
    },
    left: {
        display: "flex",
        alignItems: "center",
    },
    buttonFind: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#454444",
        minWidth: "80px",
        // "&:hover": {
        //     backgroundColor: "#c3d6fa",
        // },
        textTransform: "capitalize"
    },
    buttonChat: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        position: "relative",
        display: "flex",
        minWidth: "80px",
        alignItems: "center",
        color: "white",
        backgroundColor: "#0095f6",
        "&:hover": {
            backgroundColor: "#0186db",
        },
        textTransform: "capitalize"
    },
    button: {
        marginTop: "20px",
        position: "relative",
        display: "flex",
        color: "white",
        backgroundColor: "#0095f6",
        "&:hover": {
            backgroundColor: "#0186db",
        },
        textTransform: "capitalize"
    },

}));

const CreateNewChat = (props) => {
    const {userLogged, handleClose, open} = props;
    const [name, setName] = useState('')
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [limit, setLimit] = useState(5);


    const userChatRef = db.collection("conversations").where('users', 'array-contains', userLogged.email);
    const [chatsSnapshot] = useCollection(userChatRef);
    let navigate = useNavigate();

    // const userRef = db.collection("users").where('uid', '!=', props.user.uid).limit(4);
    // const [usersSnapshot] = useCollection(userRef);
    const [userToChat, setUserToChat] = useState([]);

    useEffect(() => {
        if(!name){
            return db.collection("users")
                .where('follower', 'array-contains', userLogged.uid)
                .limit(30)
                .get().then(snapshot => {
                    setUserToChat(snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: {
                            photoURL: doc.data().photoURL,
                            email: doc.data().email,
                            uid: doc.data().uid,
                            displayName: doc.data().displayName
                        },
                    })));
                })
        }
    },[userLogged, name])



    // perform add to database
    const handleAddChat = (email, displayName) => {
        if(email && email!== userLogged.email){
            if(!conversationExists(email)){
                db.collection("conversations").add({
                    users: [userLogged.email, email],
                    lastUpdate: firebase.firestore.FieldValue.serverTimestamp(),
                    isSeen: false,
                    lastSend: userLogged.email,
                    createdBy: userLogged.email,
                    initialization: true,
                }).then(function(docRef) {
                    handleClose(true);
                    setName("");
                    return navigate({
                        pathname: `/messages/t/${docRef.id}`,
                        state: {
                            recipientName: displayName
                        }
                    });
                }).catch((error) => {
                    console.error("Error ", error);
                });
            }
            else{
                const room = getRoom(email);
                handleClose(true);
                setName("");
                return navigate({
                    pathname: `/messages/t/${room}`,
                    state: {
                        recipientName: displayName
                    }
                });
            }
        }
        // handleCreateChat(email, userLogged.email).then(r => console.log(r));
    }
    const conversationExists = (recipientEmail) =>
        !!chatsSnapshot?.docs.find((chat) =>
            chat.data().users.find((user) =>
                user === recipientEmail)?.length > 0)


    const getRoom = (recipientEmail) => {
        const rs = chatsSnapshot?.docs.find((chat) =>
            chat.data().users.find((user) =>
                user === recipientEmail))
        return rs.id;
    }


    const handleViewMore = () => {

        setLimit(prevState => prevState + 5);
    }

    const handleNext =  () => {
        return db.collection("users")
            .where('uid', '!=', userLogged.uid)
            .limit(30)
            .get().then(snapshot => {
                let data = [];
                snapshot.forEach(doc => {
                    if(doc.data()?.displayName?.toLowerCase().includes(name)){
                        data.push({id: doc.id, data: doc.data()})
                    }
                })
                setUserToChat(data);
            })
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div style={modalStyle} className={classes.paper}>
                <div className={classes.modalHeader}>
                    <h2>New Message</h2>
                    <div className={classes.buttonClose}>
                        <IconButton aria-label="Cancel" color="inherit" onClick={handleClose} >
                            <CancelTwoToneIcon />
                        </IconButton>
                    </div>
                </div>
                <Divider />

                <div className={classes.input}>
                    <span style={{paddingRight: "20px"}}>To: </span>
                    <TextField
                        style={{width: "100%"}}
                        id="standard-basic"
                        value={name}
                        onChange={event => setName(event.target.value)}
                        InputProps={{ disableUnderline: true, style : {fontSize: "18px", fontFamily: "'Quicksand', sans-serif"}}}
                    />
                    <Button variant="outlined" onClick={handleNext} className={classes.buttonFind}>
                        Find
                    </Button>
                </div>
                <Divider />
                <div className={classes.suggest}>
                    <div className={classes.item}>
                        {
                            userToChat ? (
                                userToChat?.slice(0, limit).map(({id, data}) => (
                                    <div
                                        className={classes.userToChat}
                                        key={id}
                                    >
                                        <div className={classes.left}>
                                            <Avatar alt={data?.displayName} src={data?.photoURL} />
                                            <h4 style={{padding: "0 10px"}}>{data?.displayName}</h4>
                                        </div>
                                        <Button variant="contained" className={classes.buttonChat} onClick={() => handleAddChat(data?.email, data?.displayName)} style={{textTransform: "capitalize"}}>
                                            Chat
                                        </Button>
                                    </div>
                                ))
                            ) : null
                        }
                    </div>

                    {
                        userToChat?.length < limit ? null : (
                            <Button variant="contained" color="primary" className={classes.button} onClick={handleViewMore}>
                                See More
                            </Button>
                        )
                    }

                </div>
            </div>
        </Modal>
    )
}

export default CreateNewChat