import React, {useState} from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {
    Badge,
    FormControl,
    IconButton,
    Modal,
    Select,
    TextField
} from "@material-ui/core";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";
import PhotoCameraTwoToneIcon from "@material-ui/icons/PhotoCameraTwoTone";
import VideoCallTwoToneIcon from "@material-ui/icons/VideoCallTwoTone";


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
            borderRadius: "8px",
            minHeight: "500px",
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
            objectFit: "contain",
            padding: "15px 0"
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
            padding: "0 10px",
            minWidth: "150px"
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
        }
    }),

);

function getSteps() {
    return ['Recipe details', 'Select category', 'Ingredients', 'Directions', 'Gallery'];
}

function GetStepContent(step: number) {
    const classes = useStyles();
    switch (step) {
        case 0:
            return (
                <div className="stepper__details">
                    <TextField
                        required
                        placeholder="Recipe Title"
                        fullWidth variant="outlined"
                        InputProps={{ disableUnderline: true, style : {fontFamily: "'Quicksand', sans-serif"}}}
                    />
                    <TextField
                        // className={classes.inputText}
                        placeholder="Description"
                        multiline
                        rows={4}
                        fullWidth
                        margin="normal"
                        InputProps={{ disableUnderline: true, style : {fontFamily: "'Quicksand', sans-serif"}}}
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
                                variant="outlined"
                                InputProps={{ disableUnderline: true, style : {fontFamily: "'Quicksand', sans-serif"}}}

                            />
                            <FormControl variant="outlined" className={classes.formControl}>
                                <Select
                                    native
                                    inputProps={{
                                        id: 'prep-time',
                                        style : {fontFamily: "'Quicksand', sans-serif"}
                                    }}

                                >
                                    <option value={10}>Minute</option>
                                    <option value={20}>Hour</option>
                                    <option value={30}>Day</option>
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
                                variant="outlined"
                                InputProps={{ disableUnderline: true, style : {fontFamily: "'Quicksand', sans-serif"}}}

                            />
                            <FormControl variant="outlined" className={classes.formControl}>
                                <Select
                                    native
                                    inputProps={{
                                        id: 'cook-time',
                                        style : {fontFamily: "'Quicksand', sans-serif"}
                                    }}
                                >
                                    <option value={10}>Minute</option>
                                    <option value={20}>Hour</option>
                                    <option value={30}>Day</option>
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
                                variant="outlined"
                                InputProps={{ disableUnderline: true, style : {fontFamily: "'Quicksand', sans-serif"}}}
                            />
                        </div>

                    </div>
                </div>
            );
        case 1:
            return (
                <div className="stepper__category">
                    <Select
                        native
                        defaultValue="Category"
                        fullWidth variant="outlined"
                        inputProps={{
                            id: 'category',
                            style : {fontFamily: "'Quicksand', sans-serif"}
                        }}
                    >
                        <option aria-label="None" value="" />
                        <optgroup label="Category 1">
                            <option value={1}>Option 1</option>
                            <option value={2}>Option 2</option>
                        </optgroup>
                        <optgroup label="Category 2">
                            <option value={3}>Option 3</option>
                            <option value={4}>Option 4</option>
                        </optgroup>
                    </Select>
                </div>
            );
        case 2:
            return (
                <div className="stepper__ingredients">
                    <TextField
                        variant="outlined"
                        // className={classes.inputText}
                        placeholder="Ingredients"
                        multiline
                        rows={10}
                        fullWidth
                        margin="normal"
                        InputProps={{ disableUnderline: true, style : {fontFamily: "'Quicksand', sans-serif"}}}
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
                        margin="normal"
                        InputProps={{ disableUnderline: true, style : {fontFamily: "'Quicksand', sans-serif"}}}
                    />
                </div>
            );

        case 4:
            return (
                <div className="popup__picker">
                    <h3>Add more media</h3>
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
            )
        default:
            return 'Unknown step';
    }
}

export default function VerticalLinearStepper(props) {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();
    const [modalStyle] = useState(getModalStyle);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

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
                    <form noValidate autoComplete="off" >
                        <Stepper activeStep={activeStep} orientation="vertical" className={classes.form}>
                            {steps.map((label, index) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                    <StepContent>
                                        <Typography>{GetStepContent(index)}</Typography>
                                        <div className={classes.actionsContainer}>
                                            <div>
                                                <Button
                                                    disabled={activeStep === 0}
                                                    onClick={handleBack}
                                                    className={classes.button}
                                                >
                                                    Back
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleNext}
                                                    className={classes.button}
                                                >
                                                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                                </Button>
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
                                        <Button onClick={props.handleUpload}>Create</Button>
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
