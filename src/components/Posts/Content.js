import React, {useState} from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import {Link} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import {IconButton, Tooltip} from "@material-ui/core";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import {blue} from "@material-ui/core/colors";
import CheckCircleTwoToneIcon from "@material-ui/icons/CheckCircleTwoTone";

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: "100%",
        borderRadius: "max(0px, min(8px, calc((100vw - 4px - 100%) * 9999))) / 8px",
        boxShadow: "0px 0px 5px 0px #ddc4c4bf"
    },
    media: {
        height: 400
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    action: {
        borderTop: "1px solid rgba(var(--b6a,219,219,219),1)",
        justifyContent: "space-between"
    },
    paragraph: {
        lineHeight: "26px",
        textAlign: "justify",
        whiteSpace: "pre-line",
        fontSize: "14px"
    },
    paragraphHead: {
        fontWeight: "600",
        fontSize: "1rem",
        marginBottom: "10px",
        padding: "5px 0",
        textTransform: "uppercase",
        borderBottom : "1px solid #000"
    },
    captionText: {
        marginLeft: "5px",
        whiteSpace: "pre-line",
        lineHeight: "26px"
    },
    actionButton: {
        border: "0",
        backgroundColor: "none",
        borderRadius: "50%",
        color: "rgba(0, 0, 0, 0.54)",
        '&:hover': {
            color: 'black',
        }
    },
    dataContent: {
        display: "flex"
    },
    selected: {
        backgroundColor: "unset !important"
    },
    comment:{
        display: "block"
    },
    buttonNext: {
        position: "absolute",
        top: "50%",
        right: "10px",
        borderRadius: "50%",
        padding: "5px",
        backgroundColor: "#fff",
        '&:hover': {
            backgroundColor: "#fff"
        }
    },
    buttonBack: {
        position: "absolute",
        top: "50%",
        left: "10px",
        borderRadius: "50%",
        padding: "5px",
        backgroundColor: "#fff",
        '&:hover': {
            backgroundColor: "#fff"
        }
    },
    displayName: {
        display: "inline-flex",
        alignItems: "center",
        fontSize: "14px",
        gap: "5px"
    }
}));


export default function PostContent({caption, author, postMedia,  ...rest}) {
    const classes = useStyles();
    // let media;
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = postMedia?.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const [isReadMore, setIsReadMore] = useState(true);

    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };

    return (
        <>
            {
                postMedia.length > 0 ? (
                        <div className="post__content">
                        {
                            postMedia[activeStep]?.type === "video/mp4" ? (
                                <video controls className="post__contentImage" muted="muted" >
                                    <source src={postMedia[activeStep]?.mediaPath} type="video/mp4"/>
                                </video>
                            ) : (
                                <img
                                    alt=""
                                    className="post__contentImage"
                                    src={postMedia[activeStep]?.mediaPath}
                                />
                            )
                        }
                            {
                                postMedia.length > 1 ? (
                                    <>
                                        <IconButton onClick={handleNext} aria-label="Next" disabled={activeStep === maxSteps - 1} className={classes.buttonNext}>
                                            <KeyboardArrowRight />
                                        </IconButton>

                                        <IconButton onClick={handleBack} disabled={activeStep === 0} className={classes.buttonBack} aria-label="Back">
                                            <KeyboardArrowLeft />
                                        </IconButton>
                                    </>
                                ) : null
                            }

                    </div>
                ) : <Skeleton animation="wave" variant="rect" className={classes.media} />
            }

            {/* Caption */}
            {
                caption.length > 0 ? (
                    <div className="post__caption">
                        <h2 className={classes.displayName}>
                            <Link to={`/profile/${author?.uid}`} className="post__user">{author?.displayName} </Link>
                            {
                                author?.accountVerified ? (
                                    <Tooltip title="Verified" arrow>
                                        <CheckCircleTwoToneIcon style={{ color: blue[700]}} fontSize={"small"}/>
                                    </Tooltip>
                                ) : null
                            }
                        </h2>
                        {
                            caption.length > 100 ? (
                                <span className={classes.captionText} >
                                    {isReadMore ? caption.slice(0, 100) : caption}
                                    <span onClick={toggleReadMore} style={{fontWeight: "bold", cursor: "pointer", color: "#8e8e8e"}}>
                                        {isReadMore ? "...read more" : null}
                                    </span>
                                 </span>
                            ) : (
                                <span className={classes.captionText} >{caption}</span>
                            )
                        }
                    </div>
                ) : null
            }

        </>
    )
}
