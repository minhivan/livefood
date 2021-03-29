import React, {useState} from "react";
import {IconButton, Modal, TextField} from "@material-ui/core";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";

import {makeStyles} from "@material-ui/core/styles";
import {green} from "@material-ui/core/colors";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import {db} from "../../firebase";
import {useCollection} from "react-firebase-hooks/firestore";



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
        width: 600,
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
        padding: "20px 0",
        alignItems: "center"
    }
}));

const CreateNewChat = (props) => {
    const [email, setEmail] = useState('');
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const userChatRef = db.collection("conversations").where('users', 'array-contains', props.user.email);
    const [chatsSnapshot] = useCollection(userChatRef);

    // perform add to database
    const handleAddChat = () => {
        if(email && email!== props.user.email && !conversationExists(email)){
            db.collection("conversations").add({
                users: [props?.user.email, email]
            })
            props.handleClose(true);
            setEmail("");
        }
        // console.log(conversationExists(email));
    }
    const conversationExists = (recipientEmail) =>
        !!chatsSnapshot?.docs.find((chat) =>
            chat.data().users.find((user) =>
                user === recipientEmail)?.length > 0)

    return (
        <Modal
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div style={modalStyle} className={classes.paper}>
                <div className={classes.modalHeader}>
                    <h2>New Message</h2>
                    <div className={classes.buttonClose}>
                        <IconButton aria-label="Cancel" color="inherit" onClick={props.handleClose} >
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
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                        InputProps={{ disableUnderline: true, style : {fontSize: "18px", fontFamily: "'Quicksand', sans-serif"}}}
                    />
                    <Button variant="contained" color="primary" onClick={handleAddChat}>
                        Next
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default CreateNewChat