import React, {useEffect, useState} from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {
    Badge, CircularProgress,
    FormControl,
    IconButton, InputLabel,
    Modal,
    Select,
    TextField
} from "@material-ui/core";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";
import PhotoCameraTwoToneIcon from "@material-ui/icons/PhotoCameraTwoTone";
import VideoCallTwoToneIcon from "@material-ui/icons/VideoCallTwoTone";
import {auth, db, storage} from "../../firebase";
import firebase from "firebase";
import {useCollection} from "react-firebase-hooks/firestore";
import {useAuthState} from "react-firebase-hooks/auth";
import {green} from "@material-ui/core/colors";


function getModalStyle() {
    const top = 50 ;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}



const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        button: {
            marginTop: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
        actionsContainer: {
            marginBottom: theme.spacing(2),
        },
        resetContainer: {
            paddingLeft: theme.spacing(3),
        },
        paper: {
            position: 'absolute',
            width: 600,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
            borderRadius: "16px",
            maxHeight: "calc(100vh - 70px)",
            overflowY: "auto",
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
        reviewImg: {
            width: "100%",
            objectFit: "cover",
            marginTop: "10px",
            borderRadius: "10px"
        },
        popIcon: {
            height: "28px",
            width: "28px",
            color: "#00000099"
        },
        form:{
            padding: "24px 0"
        },
        formControl: {
            margin: "0 10px",
            minWidth: "120px"
        },
        amount: {
            padding: "10px 0",
        },
        prepData: {
            display: "flex",
            padding: "10px 0"
        },
        cookData: {
            display: "flex",
            padding: "10px 0"
        },
        serveYield: {
            padding: "10px 0"
        },
        formControlFullWidth: {
            width: "100%"
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
            top: "10px",
            right: "0"
        }
    }),

);

function getSteps() {
    return ['Recipe details', 'Select category', 'Ingredients', 'Directions', 'Gallery'];
}



export default function RecipeStepper(props) {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();
    const [authUser] = useAuthState(auth);

    // Init state
    const [modalStyle] = useState(getModalStyle);
    const [category, setCategory] = useState('');
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [prep, setPrep] = useState('');
    const [prepUnit, setPrepUnit] = useState('Minute');
    const [cook, setCook] = useState('');
    const [cookUnit, setCookUnit] = useState('Minute');
    const [serve, setServe] = useState('');
    const [ingredient, setIngredient] = useState('');
    const [direction, setDirection] = useState('');
    const [progress, setProgress] = useState('');
    const [postLoading, setPostLoading] = useState(false);

    const [disable, setDisable] = useState(true);

    const [cate] = useCollection(db.collection("category"))

    const removeImage = () => {
        props.setImage('');
    }

    const GetStepContent = (step) => {
        const classes = useStyles();
        switch (step) {
            case 0:
                return (
                    <div className="stepper__details step">
                        <TextField
                            required
                            placeholder="Recipe Title"
                            fullWidth variant="outlined"
                            value={title}
                            onChange={event => setTitle(event.target.value)}

                        />
                        <TextField
                            // className={classes.inputText}
                            placeholder="Description"
                            variant="outlined"
                            multiline
                            rows={4}
                            fullWidth
                            margin="normal"
                            value={desc}
                            onChange={event => setDesc(event.target.value)}

                        />

                        <div className={classes.amount}>
                            <div className={classes.prepData}>
                                <TextField
                                    style = {{maxWidth: "100px"}}
                                    type="number"
                                    label="Prep time"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={prep}
                                    onChange={event => setPrep(event.target.value)}
                                    variant="outlined"


                                />
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <Select
                                        inputProps={{
                                            id: 'prep-time'
                                        }}
                                        value={prepUnit}
                                        onChange={event => setPrepUnit(event.target.value)}
                                    >
                                        <option value={'Minute'}>Minute</option>
                                        <option value={'Hour'}>Hour</option>
                                        <option value={'Day'}>Day</option>
                                    </Select>
                                </FormControl>
                            </div>
                            <div className={classes.cookData}>
                                <TextField
                                    style = {{maxWidth: "100px"}}
                                    label="Cook time"
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={cook}
                                    onChange={event => setCook(event.target.value)}

                                    variant="outlined"


                                />
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <Select
                                        inputProps={{
                                            id: 'cook-time'
                                        }}
                                        value={cookUnit}
                                        onChange={event => setCookUnit(event.target.value)}
                                    >
                                        <option value={'Minute'}>Minute</option>
                                        <option value={'Hour'}>Hour</option>
                                        <option value={'Day'}>Day</option>
                                    </Select>
                                </FormControl>
                            </div>
                            <div className={classes.serveYield}>
                                <TextField
                                    style = {{maxWidth: "100px"}}
                                    label="Serves"
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={serve}
                                    onChange={event => setServe(event.target.value)}
                                    variant="outlined"

                                />
                            </div>

                        </div>
                    </div>
                );
            case 1:
                return (
                    <div className="stepper__category step">
                        <FormControl fullWidth variant="outlined">
                            <InputLabel htmlFor="grouped-native-select">Category</InputLabel>
                            <Select
                                native
                                id="grouped-native-select"
                                labelId="grouped-native-select"
                                fullWidth
                                value={category}
                                onChange={event => setCategory(event.target.value)}
                                label="Category"
                                style={{textTransform: "uppercase", fontWeight: "bold"}}
                            >
                                <option aria-label="None" value="" disabled/>
                                {
                                    cate?.docs?.map((doc) => (
                                        <option key={doc.id} value={doc.data().title}>{doc.data().title}</option>
                                    ))
                                }
                                {/*<optgroup label="Category 1">*/}
                                {/*    <option value={1}>Option 1</option>*/}
                                {/*    <option value={2}>Option 2</option>*/}
                                {/*</optgroup>*/}
                            </Select>
                        </FormControl>
                    </div>
                );
            case 2:
                return (
                    <div className="stepper__ingredients">
                        <TextField
                            variant="outlined"
                            // className={classes.inputText}
                            placeholder="Ingredients"
                            InputProps={{style: {lineHeight: "26px"}}}
                            multiline
                            rows={10}
                            fullWidth
                            margin="normal"
                            value={ingredient}
                            onChange={event => setIngredient(event.target.value)}

                        />
                    </div>
                );
            case 3:
                return (
                    <div className="stepper__details">
                        <TextField
                            variant="outlined"
                            // className={classes.inputText}
                            placeholder="Description"
                            multiline
                            rows={10}
                            fullWidth
                            InputProps={{style: {lineHeight: "26px"}}}
                            value={direction}
                            onChange={event => setDirection(event.target.value)}

                        />
                    </div>
                );

            case 4:
                return (
                    <>
                        {
                            props.image ? (
                                <div className="popup__review">
                                    {/*<img className={classes.reviewImg} src={URL.createObjectURL(props.image)} alt="" />*/}
                                    {media}
                                    {/*<div className={classes.buttonClose}>*/}
                                    {/*    <IconButton aria-label="Cancel" color="inherit" >*/}
                                    {/*        <CancelTwoToneIcon />*/}
                                    {/*    </IconButton>*/}
                                    {/*</div>*/}
                                </div>
                            ) : null
                        }
                        <div className="popup__picker">
                            <h3 style={{textTransform: "inherit", fontSize: "1rem", letterSpacing: "0"}}>Add more media</h3>
                            <div className="popup__iconPicker">
                                <div>
                                    <label htmlFor="icon-button-file" className="upload__pickerButton">
                                        <IconButton color="inherit" component="span" >
                                            <Badge color="secondary">
                                                <PhotoCameraTwoToneIcon className={classes.popIcon}/>
                                            </Badge>
                                        </IconButton>
                                    </label>
                                </div>
                                <div>
                                    <IconButton color="inherit" component="span" >
                                        <Badge color="secondary">
                                            <VideoCallTwoToneIcon className={classes.popIcon}/>
                                        </Badge>
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                    </>

                )
            default:
                return 'Unknown step';
        }
    }


    let media;
    if(props.image){
        if(props.image.type === "video/mp4" ){
            media = <video controls className={classes.reviewImg} muted="muted">
                <source src={window.URL.createObjectURL(props.image)} type="video/mp4"/>
            </video>
        } else {
            media = <>
                <img className={classes.reviewImg} src={window.URL.createObjectURL(props.image)} alt="" />
                <div className={classes.buttonRemove}>
                    <IconButton aria-label="Cancel" color="inherit" onClick={removeImage} >
                        <CancelTwoToneIcon />
                    </IconButton>
                </div>
            </>
        }
    }


    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
        setCategory(''); setDirection(''); setIngredient(''); setCook(''); setDesc(''); setServe(''); setPrep(''); setTitle('');
    };

    const handleUpload = (event) => {
        event.preventDefault();

        const uploadTask = storage.ref(`images/${props.image.name}`).put(props.image);
        uploadTask.on(
            "state_changed",
            (snapshot => {
                const progressData = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(parseInt(progressData));
                setPostLoading(true);
            }),
            (error => {
                console.log(error);
            }),
            () => {
                storage
                    .ref("images")
                    .child(props.image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            hasImage: true,
                            caption: title,
                            type: "recipe",
                            data: {
                                title: title,
                                note: desc,
                                ingredient: ingredient,
                                direction: direction,
                                cookTime: cook,
                                cookUnit: cookUnit,
                                prepTime: prep,
                                prepUnit: prepUnit,
                                serve: serve,
                                category: category,
                            },
                            mediaUrl: url,
                            user: db.doc('users/' + authUser.uid),
                            mediaType: props.image.type,
                            uid: authUser.uid
                        })
                            .then(function(docRef) {
                                console.log("Document written with ID: ", docRef.id);
                                db.collection("users").doc(authUser.uid).update({
                                    post: firebase.firestore.FieldValue.arrayUnion(docRef.id)
                                })
                            })
                            .catch(function(error) {
                                console.error("Error adding document: ", error);
                            });
                        props.setOpenSnack(true);
                        props.setImage(null);
                        props.handleClose(true);
                        setProgress('0');
                        handleReset();
                    })
            }
        )
    }


    useEffect(() => {
        if(category && title && direction && ingredient && props.image){
            setDisable(false);
        }else {
            setDisable(true)
        }
    },[category, direction, ingredient, props.image, title])

    return (
        <Modal
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div style={modalStyle} className={classes.paper}>
                <div className={classes.modalHeader}>
                    <h2>Add a recipe</h2>
                    <div className={classes.buttonClose}>
                        <IconButton aria-label="Cancel" color="inherit" onClick={props.handleClose} >
                            <CancelTwoToneIcon />
                        </IconButton>
                    </div>
                </div>
                <div className={classes.root}>
                    <form noValidate autoComplete="off" onSubmit={handleUpload}>
                        <Stepper activeStep={activeStep} orientation="vertical" className={classes.form}>
                            {steps.map((label, index) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                    <StepContent>
                                        <>
                                            {GetStepContent(index)}
                                        </>
                                        <div className={classes.actionsContainer}>
                                            <div>
                                                <Button
                                                    disabled={activeStep === 0}
                                                    onClick={handleBack}
                                                    className={classes.button}
                                                >
                                                    Back
                                                </Button>
                                                {
                                                    activeStep === steps.length - 1 ? (
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={handleNext}
                                                            className={classes.button}
                                                            disabled={disable}
                                                        >
                                                            Finish
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={handleNext}
                                                            className={classes.button}
                                                        >
                                                            Next
                                                        </Button>
                                                    )
                                                }

                                            </div>
                                        </div>
                                    </StepContent>
                                </Step>
                            ))}
                        </Stepper>

                        {activeStep === steps.length && (
                            <Paper square elevation={0} className={classes.resetContainer}>
                                <Typography>All steps completed</Typography>
                                <div className="handle__button">
                                    <div className="handle__reset">
                                        <Button onClick={handleReset}>Reset</Button>
                                    </div>
                                    <div className="handle__upload">
                                        <Button
                                            type="submit"
                                            onClick={handleUpload}
                                            disabled={postLoading}
                                        >
                                            Create
                                        </Button>
                                        {postLoading && <CircularProgress size={24} value={parseInt(progress)} className={classes.buttonProgress} /> }
                                    </div>

                                </div>
                            </Paper>
                        )}
                    </form>
                </div>
            </div>
        </Modal>
    );
}
