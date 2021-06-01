import React, {useEffect, useState} from "react";
import {Button, IconButton, Modal, TextField} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import {makeStyles} from "@material-ui/core/styles";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";
import {db} from "../../firebase";
import Avatar from "@material-ui/core/Avatar";

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


export default function ListUserForTag(props) {

    const {open, handleClose, userLogged, handleTagUser} = props;

    const [modalStyle] = useState(getModalStyle);
    const [name, setName] = useState('')
    const [userToTag, setUserToTag] = useState([]);
    const [limit, setLimit] = useState(5);
    const classes = useStyles();


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
                    if(doc.data()?.displayName?.toLowerCase().includes(name) && doc.data()?.accountType !== "foodshop"){
                        data.push({id: doc.id, data: doc.data()})
                    }
                })
                setUserToTag(data);
            })
    }


    useEffect(() => {
        if(!name){
            return db.collection("users")
                .where('follower', 'array-contains', userLogged.uid)
                .limit(30)
                .get().then(snapshot => {
                    setUserToTag(snapshot.docs.map(doc => ({
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




    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div style={modalStyle} className={classes.paper}>
                <div className={classes.modalHeader}>
                    <h2>Tag People</h2>
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
                    <Button variant="outlined" className={classes.buttonFind} onClick={handleNext}>
                        Find
                    </Button>
                </div>
                <Divider />
                <div className={classes.suggest}>
                    <div className={classes.item}>
                        {
                            userToTag ? (
                                userToTag?.slice(0, limit).map(({id, data}) => (
                                    <div
                                        className={classes.userToChat}
                                        key={id}
                                    >
                                        <div className={classes.left}>
                                            <Avatar alt={data?.displayName} src={data?.photoURL} />
                                            <h4 style={{padding: "0 10px"}}>{data?.displayName}</h4>
                                        </div>
                                        <Button
                                            variant="contained"
                                            className={classes.buttonChat}
                                            style={{textTransform: "capitalize"}}
                                            onClick={() => {
                                                handleTagUser({
                                                    displayName: data?.displayName,
                                                    uid: data?.uid
                                                })
                                                handleClose();
                                            }}
                                        >

                                            Tag
                                        </Button>
                                    </div>
                                ))
                            ) : null
                        }
                    </div>

                    {
                        userToTag?.length < limit ? null : (
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