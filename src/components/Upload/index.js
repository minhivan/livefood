import React, {useState} from "react";
import './Upload.css';

import {Button} from "@material-ui/core";
// import {storage, db, auth} from "../../firebase";
// import firebase from "firebase";
import {makeStyles} from "@material-ui/core/styles";
// import CircularProgress from '@material-ui/core/CircularProgress';
import CreateTwoToneIcon from '@material-ui/icons/CreateTwoTone';
import PhotoSizeSelectActualIcon from '@material-ui/icons/PhotoSizeSelectActual';
import SentimentSatisfiedTwoToneIcon from '@material-ui/icons/SentimentSatisfiedTwoTone';
import EmojiObjectsTwoToneIcon from '@material-ui/icons/EmojiObjectsTwoTone';
import Popup from "./Popup";
import VerticalLinearStepper from "./Stepper";


const useStyles = makeStyles((theme) => ({
    divider: {
        height: 1,
        width: "50%",
        background: "#39CCCC",
        margin: "15px auto"
    },
    input: {
        display: "none"
    },

    photoIcon: {
        color: "#ff6932"
    },
    fellingIcon: {
        color : "#7543e8"
    },
    ideaIcon: {
        color: "#edb602"
    }

}));


function Upload({username}) {
    const [open, setOpen] = useState(false);
    const classes = useStyles();
    // const [caption, setCaption] = useState('');
    const [image, setImage] = useState('');
    // const [progress, setProgress] = useState('');
    const [openStep, setOpenStep] = useState(false);



    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    };

    const handleOpenStep = () => {
        setOpenStep(true);
    }
    const handleCloseStep = () => {
        setOpenStep(false);
    };

    const handleChange = (event) => {
        if(event.target.files[0]){
            setImage(event.target.files[0]);
            setOpen(true);
        }
    }

    // const handleUpload = () => {
    //     const uploadTask = storage.ref(`images/${image.name}`).put(image);
    //     uploadTask.on(
    //         "state_changed",
    //         (snapshot => {
    //             const progress = Math.round(
    //                 (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    //             );
    //             setProgress(progress);
    //         }),
    //         (error => {
    //             console.log(error);
    //         }),
    //         () => {
    //             storage
    //                 .ref("images")
    //                 .child(image.name)
    //                 .getDownloadURL()
    //                 .then(url => {
    //                     db.collection("post").add({
    //                         timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    //                         caption: caption,
    //                         imageUrl: url,
    //                         username: username
    //                     })
    //                         .then(function(docRef) {
    //                             console.log("Document written with ID: ", docRef.id);
    //                         })
    //                         .catch(function(error) {
    //                             console.error("Error adding document: ", error);
    //                         });
    //                     setProgress('0');
    //                     setCaption("");
    //                     setImage(null);
    //                     setOpen(false);
    //                 })
    //         }
    //     )
    // }
    return(
        <div className="upload">
            <div className="upload__container">
                <div className="upload__caption_test">
                    <div className="caption__holder" onClick={handleOpen}>
                        <CreateTwoToneIcon />
                        <span>
                            What's on your mind ?
                        </span>
                    </div>
                </div>

                <div className="upload__picker">
                    <div className="upload__pickerImage">
                        <input accept="image/*" type="file" onChange={handleChange} id="icon-button-file" className={classes.input}/>
                        <label htmlFor="icon-button-file" className="upload__pickerButton">
                            <PhotoSizeSelectActualIcon className={classes.photoIcon}/>
                            <span className="upload__buttonLabel">Photo</span>
                        </label>
                    </div>
                    <div className="upload__pickButton button__felling">
                        <Button onClick={handleOpen}>
                            <SentimentSatisfiedTwoToneIcon className={classes.fellingIcon}/>
                            <span className="upload__buttonLabel">Felling</span>
                        </Button>
                    </div>
                    <div className="upload__pickButton button__idea">
                        <Button onClick={handleOpenStep}>
                            <EmojiObjectsTwoToneIcon className={classes.ideaIcon}/>
                            <span className="upload__buttonLabel">Idea</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/*<div className="">*/}
            {/*    <CircularProgress variant="determinate" value={Number(progress)} />*/}
            {/*</div>*/}

            <Popup open={open} image={image}  handleClose={handleClose} setImage={setImage}/>
            <VerticalLinearStepper open={openStep} image={image} setImage={setImage} handleClose={handleCloseStep}/>

        </div>
    )
}

export default Upload