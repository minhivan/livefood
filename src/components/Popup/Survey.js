import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {InputLabel, Modal, Select} from "@material-ui/core";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

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
        width: '100%',
    },
    backButton: {
        marginTop: theme.spacing(2),
        marginRight: theme.spacing(1),
        width: "40%",
        minHeight: "48px",
        borderRadius: "16px",
        fontWeight: "bold",
    },
    nextButton: {
        marginTop: theme.spacing(2),
        backgroundColor: "#e60023",
        color: "#fff",
        width: "40%",
        minHeight: "48px",
        borderRadius: "16px",
        fontWeight: "bold",
        "&:hover": {
            backgroundColor: "#a3021a"
        },
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
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
    stepHeader: {
        padding: "32px",
        width: "100%",
        textAlign: "center",
        marginTop : "32px"
    },
    stepContainer: {
        width : "100%",
        height: "450px",
        display: "flex",
        flexDirection: "column"
    },
    stepButton: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        gap: "20px"
    },
    stepContent: {
        flex: "1 1 auto",
        display: "flex",
        justifyContent : "center",
        flexDirection: "column",
        gap: "30px"
    },
    genderSelect: {
        padding: "50px"
    },
    selectInput: {
        fontWeight: "bold"
    }
}));

function getSteps() {
    return ['Step 1', "Step 2", "Step 3", "Step 4"];
}



export default function Survey() {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();
    const [open, setOpen] = useState(true);
    const [modalStyle] = useState(getModalStyle);
    const [gender, setGender] = React.useState('female');
    const [province, setProvince] = useState([]);
    const [region, setRegion] = useState('');

    const handleChangeGender = (event) => {
        setGender(event.target.value);
    };

    useEffect(() => {
        fetch('https://vapi.vnappmob.com/api/province/')
            .then(res => res.json()).then(res => {
            if (res.results && res.results.length > 0) {
                setProvince(res.results)
            }
        });
    }, [])


    function getStepContent(stepIndex) {
        switch (stepIndex) {
            case 0:
                return (
                    <div className={classes.stepContainer}>
                        <div className={classes.stepHeader}>
                            <h2 className="survey__title">First start of Livefood</h2>
                        </div>
                        <div className={classes.stepContent}>
                            <h3 style={{textAlign: "center"}}>Here is a quick survey to gather your opinions</h3>
                            <p style={{textAlign: "center"}}>Connect with us to discover more about our dishes</p>
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div className={classes.stepContainer}>
                        <div className={classes.stepHeader}>
                            <h2 className="survey__title">How do you identify?</h2>
                        </div>
                        <div className={classes.stepContent}>
                            <FormControl component="fieldset" className={classes.genderSelect}>
                                <RadioGroup aria-label="gender" name="gender1" value={gender} onChange={handleChangeGender}>
                                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="other" control={<Radio />} label="Other" />
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className={classes.stepContainer}>
                        <div className={classes.stepHeader}>
                            <h2 className="survey__title">Pick your region</h2>
                        </div>
                        <div className={classes.stepContent}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel htmlFor="region">Region</InputLabel>
                                <Select
                                    native
                                    labelId="region"
                                    fullWidth
                                    value={region}
                                    onChange={event => setRegion(event.target.value)}
                                    label="Category"
                                    classes={{
                                        root: classes.selectInput
                                    }}
                                >
                                    {
                                        province?.map((doc) => (
                                            <option key={doc.province_id} value={doc.province_name}>{doc.province_name}</option>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className={classes.stepContainer}>
                        <div className={classes.stepHeader}>
                            <h2 className="survey__title">Last step! Tell us what you're interested in</h2>
                        </div>
                        <div className={classes.stepContent}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel htmlFor="region">Region</InputLabel>
                                <Select
                                    native
                                    labelId="region"
                                    fullWidth
                                    value={region}
                                    onChange={event => setRegion(event.target.value)}
                                    label="Category"
                                    classes={{
                                        root: classes.selectInput
                                    }}
                                >
                                    {
                                        province?.map((doc) => (
                                            <option key={doc.province_id} value={doc.province_name}>{doc.province_name}</option>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                );
            default:
                return 'Unknown stepIndex';
        }
    }


    const handleClose = () => {
        setOpen(false);
    }

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
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div style={modalStyle} className={classes.paper}>
                <div className={classes.root}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel />
                            </Step>
                        ))}
                    </Stepper>
                    <div>
                        {activeStep === steps.length ? (
                            <div>
                                <Typography className={classes.instructions}>All steps completed</Typography>
                                <Button onClick={handleReset}>Reset</Button>
                            </div>
                        ) : (
                                <>
                                    {getStepContent(activeStep)}
                                    <div className={classes.stepButton}>
                                        <Button
                                            disabled={activeStep === 0}
                                            onClick={handleBack}
                                            className={classes.backButton}
                                            variant="outlined"
                                        >
                                            Back
                                        </Button>
                                        <Button variant="contained" className={classes.nextButton} onClick={handleNext}>
                                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                        </Button>
                                    </div>
                                </>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
}
