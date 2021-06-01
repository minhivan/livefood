import React, {useState} from "react";

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
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import RecipeStepper from "./Stepper";
import ListUserForTag from "../Popup/ListUserForTag";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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


function Upload({userLogged}) {
    const [open, setOpen] = useState(false);
    const classes = useStyles();
    const [image, setImage] = useState('');
    const [openStep, setOpenStep] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [openTag, setOpenTag] = useState(false);
    const [tagUserData, setTagUserData] = useState(null);

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

    const handleOpenTag = () => {
        setOpenTag(true);
    }
    const handleCloseTag = () => {
        setOpenTag(false);
    }

    const handleTagUser = (data) => {
        setTagUserData(data);
    }

    const handleRemoveTagUser = () => {
        setTagUserData(null);
    }
    const handleChange = (event) => {
        const imageList = event.target.files;
        let conditions = ["image", "video"];
        const finalData = [];
        // const isValid = (imageList) => imageList['type'].includes('image');
        Array.from(imageList).forEach(file => {
            if(conditions.some(el => file['type'].split('/')[0].includes(el))){
                finalData.push(file)
            }
        });

        if(finalData){
            setImage(finalData);
            if(!openStep){
                setOpen(true);
            }
        }

    }

    const handleCloseSnack = (event) => {
        setOpenSnack(false);
    };


    return(
        <div className="upload">
            <div className="upload__container">
                <div className="upload__caption_test">
                    <div className="caption__holder" onClick={handleOpen}>
                        <CreateTwoToneIcon />
                        <span>
                            What's new, {userLogged.displayName} ?
                        </span>
                    </div>
                </div>
                <div className="upload__picker">
                    <div className="upload__pickerImage">
                        <input accept="image/*|video/*" type="file" onChange={handleChange} onClick={e => (e.target.value = null)} multiple="multiple" id="icon-button-file" className={classes.input}/>
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
            {
                open ? (
                    <Popup open={open} image={image}  handleClose={handleClose} setImage={setImage} setOpenSnack={setOpenSnack} handleOpenTag={handleOpenTag} tagUser={tagUserData} handleRemoveTagUser={handleRemoveTagUser}/>
                ) : null
            }
            {
                openStep ? (
                    <RecipeStepper open={openStep} image={image} setImage={setImage} handleClose={handleCloseStep} setOpenSnack={setOpenSnack} />
                ) : null
            }
            {
                openTag ? (
                    <ListUserForTag open={openTag} handleClose={handleCloseTag} userLogged={userLogged} handleTagUser={handleTagUser}/>
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
                            Upload successfully !
                        </Alert>
                    </Snackbar>
                ) : null
            }
        </div>
    )
}

export default Upload