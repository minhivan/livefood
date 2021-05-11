import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import {Chip, Modal, Paper, TextField} from "@material-ui/core";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import {Autocomplete} from "@material-ui/lab";
import {db} from "../../firebase";


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
        maxWidth: 900,
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
        minHeight: "400px",
        minWidth: "600px",
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
        padding: "20px 50px"
    },
    selectInput: {
        fontWeight: "bold"
    },
    label: {
        display: "flex",
        position: "relative"
    },
    labelText: {
        position: "absolute",
        fontWeight: "bold",
        fontSize: "20px",
        bottom: "10px",
        left: "10px",
        color: "#fff"
    },
    pickerContainer: {
        display: "flex",
        width: "100%",
        flexWrap: "wrap",
        overflowY: "auto",
        justifyContent: "center",
    },
    optionImg: {
        width: "144px",
        height: "144px",
        borderRadius: "16px",
    },
    listChip: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: "center",
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        margin: 0,
        minHeight: "60px"
    },
    chip: {
        margin: theme.spacing(0.5),
        minWidth: "90px",
        padding: "20px",
        textTransform: "capitalize",
        fontSize: "0.9rem",
    },
}));

function getSteps() {
    return ['Step 1', "Step 2", "Step 3", "Step 4"];
}



export default function Survey({userLogged}) {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();
    const [open, setOpen] = useState(true);
    const [modalStyle] = useState(getModalStyle);
    const [gender, setGender] = React.useState('female');
    const [province, setProvince] = useState([]);
    const [region, setRegion] = useState(null);
    const [selectedChip, setSelectedChip] = useState([]);
    const [disable, setDisable] = useState(true);
    const [loadingUpload, setLoadingUpload] = useState(false);
    const listChip = [
        { key: 0, label: 'cuisine' },
        { key: 1, label: 'occasion' },
        { key: 2, label: 'preparation' },
        { key: 3, label: 'lunch' },
        { key: 4, label: 'course' },
        { key: 5, label: 'dietary' },
        { key: 6, label: 'breakfast' },
        { key: 7, label: 'cheap food shop' },
        { key: 8, label: 'coffee shop' },
        { key: 9, label: 'street food' },

    ]

    const handleSelectChip = (data) => {
        if( ! selectedChip.some(chips => chips.key === data.key)) {
            setSelectedChip([...selectedChip, data]);
        }
    };


    const handleDeleteChip = (chipToDelete) => () => {
        setSelectedChip((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
    };

    const handleChangeGender = (event) => {
        setGender(event.target.value);
    };


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
        setRegion('');
        setSelectedChip([]);
    };


    const handleSetInterested = () => {
        setLoadingUpload(true);
        db.collection("users").doc(userLogged.uid).update({
            aboutMe: {
                favorites: selectedChip.map((data) => data.label),
                location: region.province_name,
                gender: gender
            },
        }).then(function() {
            setLoadingUpload(false);
            handleReset();
            handleClose();
            console.log("Setting new data !");
        });
    }

    useEffect(() => {
        fetch('https://vapi.vnappmob.com/api/province/')
            .then(res => res.json()).then(res => {
            if (res.results && res.results.length > 0) {
                setProvince(res.results)
            }
        });
    }, [])

    useEffect(() => {
        if(selectedChip.length >= 3 && region) {
            setDisable(false);
        }
        else{
            setDisable(true)
        }
    }, [region, selectedChip.length])



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
                            <h2 className="survey__title">Pick your location</h2>
                        </div>
                        <div className={classes.stepContent}>
                            <Autocomplete
                                fullWidth
                                autoHighlight
                                options={province}
                                getOptionLabel={(option) => option.province_name}
                                value={region}
                                onChange={(event, newValue) => {
                                    setRegion(newValue);
                                }}
                                style={{ padding: "20px"}}
                                className={classes.selectInput}
                                renderInput={(params) => <TextField {...params} label="Region" variant="outlined" />}
                            />
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className={classes.stepContainer} style={{width: "800px"}}>
                        <div className={classes.stepHeader}>
                            <h2 className="survey__title">Last step! Tell us what you're interested in</h2>
                        </div>
                        <div className={classes.stepContent} style={{flex: "0"}}>
                            <Paper variant="outlined" component="ul" className={classes.listChip}>
                                {selectedChip.map((data) => {
                                    return (
                                        <li key={data.key}>
                                            <Chip
                                                label={data.label}
                                                onDelete={handleDeleteChip(data)}
                                                className={classes.chip}
                                            />
                                        </li>
                                    );
                                })}
                            </Paper>
                            <div className={classes.pickerContainer}>
                                {listChip.map((data) => {
                                    return (
                                        <Chip
                                            key={data.key}
                                            label={data.label}
                                            clickable
                                            color="primary"
                                            onClick={() => handleSelectChip(data)}
                                            className={classes.chip}
                                        />
                                    );
                                })}
                            </div>
                            {
                                selectedChip.length >= 3 ? (
                                    <h3
                                        style={{textAlign: "center", paddingBottom: "10px", textTransform: "none"}}
                                    >
                                        All done, move to next step
                                    </h3>
                                ) : (
                                    <h3
                                        style={{textAlign: "center", paddingBottom: "10px", textTransform: "none"}}
                                    >
                                        Select {3 - selectedChip.length} or more subject
                                    </h3>
                                )
                            }

                        </div>
                    </div>
                );
            default:
                return 'Unknown step';
        }
    }

    return (
        <Modal
            open={open}
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
                            <div className={classes.stepContainer} style={{width: "800px"}}>
                                <div className={classes.stepContent} >
                                    <h2 className="survey__title" style={{textAlign: "center"}}>Well done, now you can explore on our website</h2>
                                </div>
                                <div className={classes.stepButton}>
                                    <Button
                                        onClick={handleReset}
                                        className={classes.backButton}
                                        variant="outlined"
                                    >
                                        Reset
                                    </Button>
                                    <Button
                                        variant="contained"
                                        className={classes.nextButton}
                                        onClick={handleSetInterested}
                                        disabled={loadingUpload}
                                    >
                                        Start now
                                    </Button>
                                </div>
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
                                        {
                                            activeStep === steps.length - 1 ? (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleNext}
                                                    className={classes.nextButton}
                                                    disabled={disable}
                                                >
                                                    Finish
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleNext}
                                                    className={classes.nextButton}
                                                >
                                                    Next
                                                </Button>
                                            )
                                        }

                                    </div>
                                </>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
}
