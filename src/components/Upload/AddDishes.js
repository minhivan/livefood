import React, {useEffect, useState} from "react";
import {
    Avatar,
    Badge,
    Button,
    CardContent,
    CircularProgress,
    Collapse,
    IconButton,
    Modal,
    TextField
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";
import PhotoCameraTwoToneIcon from "@material-ui/icons/PhotoCameraTwoTone";
import VideoCallTwoToneIcon from "@material-ui/icons/VideoCallTwoTone";
import GroupAddTwoToneIcon from "@material-ui/icons/GroupAddTwoTone";
import CardHeader from "@material-ui/core/CardHeader";
import {green} from "@material-ui/core/colors";
import {db, storage} from "../../firebase";
import firebase from "firebase";

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
    root: {
        fontSize: "0.875rem"
    },
    paper: {
        position: 'absolute',
        width: 600,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 3, 3),
        borderRadius: "16px",
        maxHeight: "calc(100vh - 70px)",
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
    buttonDisable: {
        color: "#bcc0c4 !important",
        backgroundColor : "#e4e6eb !important"
    },
    input: {
        display: "none"
    },
    reviewImg: {
        width: "100%",
        objectFit: "contain",
        boxShadow: "0px 0px 2px 0px rgba(21,12,12,0.9)",
        borderRadius: "max(0px, min(8px, calc((100vw - 4px - 100%) * 9999))) / 8px"
    },
    inputText: {
        width: "100%",
        padding: "10px 0",
        minHeight: "100px",
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
    buttonRemove: {
        position: "absolute",
        top: "0px",
        right: "0"
    },
    value: {
        display: "flex",
        padding: "20px 0"
    }
}));

function AddDishes({open, handleClose, setOpenSnack, userLogged}){
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [dishName, setDishName] = useState('');
    const [dishImg, setDishImg] = useState('');
    const [price, setPrice] = useState('');
    const [disable, setDisable] = useState(true);
    const [loading, setLoading] = useState(false);


    // console.log(new Intl.NumberFormat().format(price))



    const handleUpload = () => {
        const uploadTask = storage.ref(`media/${dishImg.name}`).put(dishImg);
        uploadTask.on(
            "state_changed",
            (snapshot => {
                const progressData = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setLoading(true);
            }),
            (error => {
                console.log(error);
            }),
            () => {
                storage
                    .ref("media")
                    .child(dishImg.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection("users").doc(userLogged.uid).collection("menu").add({
                            price: price,
                            dishName: dishName,
                            mediaUrl: url,
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        })
                            .then(function(docRef) {
                                console.log("Document written with ID: ", docRef.id);
                            })
                            .catch(function(error) {
                                console.error("Error adding document: ", error);
                            });

                        setOpenSnack(true);
                        handleClose(true);
                        setDishImg("");
                        setDishName("");
                        setPrice("");
                        setLoading(false);
                    })
            }
        )
    }


    const handleChange = (event) => {
        if(event.target.files[0]){
            setDishImg(event.target.files[0]);
        }
    }

    const removeImage = () => {
        setDishImg('');
    }


    useEffect(() => {
        if(dishName.length > 0 && dishImg){
            setDisable(false);
        }else {
            setDisable(true)
        }
    },[dishName.length, dishImg])


    return (
        <Modal
            className={classes.root}
            open={open}
            onClose={handleClose}
        >
            <div style={modalStyle} className={classes.paper}>
                <div className={classes.modalHeader}>
                    <h2>Add your own dish</h2>
                    <div className={classes.buttonClose}>
                        <IconButton aria-label="Cancel" color="inherit" onClick={handleClose} >
                            <CancelTwoToneIcon />
                        </IconButton>
                    </div>
                </div>

                <div className="popup__caption">
                    <div className={classes.value}>
                        <TextField
                            required
                            label="Dish Title"
                            fullWidth variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={dishName}
                            onChange={event => setDishName(event.target.value)}

                        />
                        <TextField
                            required
                            style = {{maxWidth: "150px", marginLeft: "20px"}}
                            type="number"
                            label="Price"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{ inputProps: { min: 0 } }}
                            value={price}
                            onChange={event => {setPrice(event.target.value)}}
                            variant="outlined"
                        />

                    </div>
                    {
                        dishImg ? (
                            <div className="popup__review">
                                <>
                                    <img className={classes.reviewImg} src={window.URL.createObjectURL(dishImg)} alt="" />
                                    <div className={classes.buttonRemove}>
                                        <IconButton aria-label="Cancel" color="inherit" onClick={removeImage} >
                                            <CancelTwoToneIcon />
                                        </IconButton>
                                    </div>
                                </>
                            </div>
                        ) : null
                    }

                </div>

                <div className="popup__picker">
                    <h3 style={{textTransform: "inherit", fontSize: "1rem", letterSpacing: "0"}}>Upload picture of your dish</h3>
                    <div className="popup__iconPicker">
                        <div>
                            <input accept="image/*|video/*" type="file" onChange={handleChange} multiple="multiple" id="icon-button-file" className={classes.input}/>

                            <label htmlFor="icon-button-file" className="upload__pickerButton">
                                <IconButton color="inherit" component="span" >
                                    <Badge color="secondary">
                                        <PhotoCameraTwoToneIcon className={classes.popIcon}/>
                                    </Badge>
                                </IconButton>
                            </label>

                        </div>
                    </div>
                </div>

                <div className="upload__button">
                    <Button
                        classes={{
                            disabled: classes.buttonDisable
                        }}
                        type="submit"
                        onClick={handleUpload}
                        disabled={disable}
                    >
                        POST
                    </Button>
                    {loading && <CircularProgress size={24} className={classes.buttonProgress} /> }
                </div>
            </div>
        </Modal>
    )
}
export default AddDishes