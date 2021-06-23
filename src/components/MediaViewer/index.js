import React, { useRef, useEffect, useState } from "react";
import { CardContent, Collapse, IconButton, Modal, Tooltip } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from "@material-ui/core/styles";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import { Link } from "react-router-dom";
import Divider from '@material-ui/core/Divider';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Rating, ToggleButton } from "@material-ui/lab";
import FavoriteRoundedIcon from "@material-ui/icons/FavoriteRounded";
import FavoriteBorderTwoToneIcon from "@material-ui/icons/FavoriteBorderTwoTone";
import ModeCommentOutlinedIcon from "@material-ui/icons/ModeCommentOutlined";
import BookmarkBorderOutlinedIcon from "@material-ui/icons/BookmarkBorderOutlined";
import CardActions from "@material-ui/core/CardActions";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";

import ListComment from "../Comments/Comments";
import BookmarkRoundedIcon from "@material-ui/icons/BookmarkRounded";
import { handleSavePost, handleUnSavedPost, handleLikePost, handleDislikePost } from "../../hooks/services";
import CommentInput from "../Comments/CommentInput";
import ListUserLikePost from "../Popup/ListUserLikePost";
import { db } from "../../firebase";
import { useDocument } from "react-firebase-hooks/firestore";
// import MobileStepper from "@material-ui/core/MobileStepper";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import Skeleton from "@material-ui/lab/Skeleton";
import MoreHorizRoundedIcon from "@material-ui/icons/MoreHorizRounded";
import PostUtil from "../Popup/PostUtil";
import EditPost from "../Popup/EditPost";
import Report from "../Popup/Report";
// import LocationOnIcon from "@material-ui/icons/LocationOn";
import CheckCircleTwoToneIcon from "@material-ui/icons/CheckCircleTwoTone";
import { blue } from "@material-ui/core/colors";




function getModalStyle() {
    const top = 50;
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
    label: {
        paddingLeft: "10px"
    },
    paper: {
        position: 'absolute',
        maxWidth: 950,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        "&:focus": {
            outline: "none"
        },
        maxHeight: "700px",
        height: "100%",
        display: "flex",
        justifyContent: "space-between",
        overflow: "hidden",
        borderRadius: "16px"
    },
    // modalHeader: {
    //     display: "flex",
    //     justifyContent: "flex-start",
    // },
    buttonClose: {
        position: "absolute",
        left: "15px",
        top: "15px",

    },
    leftPanel: {
        height: "auto",
        minWidth: "550px",
        maxWidth: "600px",
        position: "relative"
    },

    imgHolder: {
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "rgba(0,0,0,0.91)"
    },
    img: {
        objectFit: "contain",
        height: "100%",
        left: "0",
        position: "absolute",
        top: "0",
        width: "100%",
    },

    rightPanel: {
        width: "400px",
        height: "100%",
        position: "relative"
    },
    captionText: {
        whiteSpace: "pre-line",
        lineHeight: "26px",

    },
    modalBody: {
        height: "auto"
    },
    displayLike: {
        padding: "0 0 20px 20px",
    },
    likeButton: {
        border: "0",
        backgroundColor: "none",
        borderRadius: "50%",
        '&:hover': {
            color: 'red',
        }
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
    paragraph: {
        lineHeight: "26px",
        textAlign: "justify",
        whiteSpace: "pre-line",
        fontSize: "0.875rem"
    },
    paragraphHead: {
        fontWeight: "600",
        fontSize: "0.875rem",
        marginBottom: "10px",
        padding: "5px 0",
        textTransform: "uppercase",
        borderBottom: "1px solid #000"
    },
    selected: {
        backgroundColor: "unset !important"
    },
    commentContainer: {
        marginTop: "auto",
        padding: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    cmtButtonLabel: {
        fontWeight: "bold",
        textTransform: "capitalize",
        fontSize: "14px"
    },
    direction: {
        minHeight: "auto"
    },
    data: {
        overflowY: "auto"
    },
    likesCount: {
        cursor: "pointer",
        '&:hover': {
            textDecoration: "underline",
        }
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
        },

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
        },
    },
    displayName: {
        display: "inline-flex",
        alignItems: "center",
        fontSize: "14px",
        gap: "5px"
    }
}));

function MediaViewer(props) {

    const { open, handleClose, postId, post, postAuthor, userLogged, setOpenSnack } = props;
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [selected, setSelected] = useState(false);
    const [expanded, setExpanded] = useState(true);
    const [saveSelected, setSaveSelected] = useState(false);
    const [openLikesList, setOpenLikesList] = useState(false);
    const [isReadMore, setIsReadMore] = useState(true);
    const [userLoggedData, setUserLoggedData] = useState({});
    const [postSnapshot] = useDocument(postId && db.collection('posts').doc(postId));
    const [openUtil, setOpenUtil] = useState(false);
    const [activeStep, setActiveStep] = React.useState(0);
    const [openEdit, setOpenEdit] = useState(false);
    const [replyComment, setReplyComment] = useState(null);
    const [openReport, setOpenReport] = useState(false)
    const [isFollow, setIsFollow] = useState(false);
    const searchInput = useRef([]);


    function handleFocus(){
		searchInput.current[postId].focus();
	}

    const maxSteps = post?.media?.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleClickUtil = () => {
        setOpenUtil(true);
    };

    const handleCloseUtil = () => {
        setOpenUtil(false);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
    };
    const handleOpenEdit = () => {
        setOpenEdit(true)
    }

    const handleCloseReport = () => {
        setOpenReport(false);
        handleClose();
    };

    const handleOpenReport = () => {
        setOpenReport(true)
    }

    const handleOpenLikesList = () => {
        setOpenLikesList(true);
    }

    const handleCloseLikesList = () => {
        setOpenLikesList(false);
    }

    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };


    // Handle like and dislike action
    const likePost = () => {
        setSelected(true);
        handleLikePost(postId, userLoggedData, post.uid)
    }

    const dislikePost = () => {
        setSelected(false);
        handleDislikePost(postId, userLogged.uid, post.uid)
    }

    const savePost = () => {
        // Save post id to user data, and push to post data
        setSaveSelected(true);
        handleSavePost(postId, userLogged.uid);
    }

    const unsavedPost = () => {
        // Save post id to user data, and push to post data
        setSaveSelected(false);
        handleUnSavedPost(postId, userLogged.uid);
    }

    const handleReplying = (data) => {
        handleFocus();
        setReplyComment(data);

    }

    const handleRemoveReply = () => {
        setReplyComment(null);
    }

    useEffect(() => {
        if (userLogged) {
            setUserLoggedData({
                uid: userLogged.uid,
                photoURL: userLogged.photoURL,
                displayName: userLogged.displayName
            })
        }
    }, [userLogged])


    useEffect(() => {
        if (userLogged) {
            if (postAuthor?.follower?.includes(userLogged.uid)) {
                setIsFollow(true);
            }
            else {
                setIsFollow(false)
            }
        }
    }, [postAuthor?.follower, userLogged])

    dayjs.extend(relativeTime);
    let postCreated = null;

    if (post?.timestamp) {
        postCreated = new Date(post?.timestamp.seconds * 1000).toLocaleString();
    }


    useEffect(() => {
        if (userLogged) {
            if (typeof postSnapshot?.data()?.likeBy !== 'undefined' && postSnapshot?.data()?.likeBy.includes(userLogged.uid)) {
                setSelected(true);
            }
            if (typeof postSnapshot?.data()?.saveBy !== 'undefined' && postSnapshot?.data()?.saveBy.includes(userLogged.uid)) {
                setSaveSelected(true);
            }
        }
    }, [postSnapshot, userLogged])

    return (
        <Modal
            className={classes.root}
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div style={modalStyle} className={classes.paper}>
                <div className={classes.leftPanel}>
                    {
                        post?.media?.length > 0 ? (
                            <>
                                {
                                    post?.media[activeStep]?.type === "video/mp4" ? (
                                        <div className={classes.imgHolder}>
                                            <video controls className={classes.img} muted="muted" onClick={e => e.target.play()}>
                                                <source src={post?.media[activeStep]?.mediaPath} type="video/mp4" />
                                            </video>
                                        </div>
                                    ) : (
                                        <div className={classes.imgHolder}>
                                            <img src={post?.media[activeStep]?.mediaPath} alt="" className={classes.img} />
                                        </div>
                                    )
                                }
                                {
                                    post?.media?.length > 1 ? (
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
                            </>
                        ) : <Skeleton animation="wave" variant="rect" className={classes.media} />
                    }
                    <div className={classes.buttonClose}>
                        <IconButton aria-label="Cancel" style={{ backgroundColor: "#fff", padding: "5px" }} color="inherit" onClick={handleClose} >
                            <CloseIcon />
                        </IconButton>
                    </div>
                </div>
                <Divider orientation="vertical" flexItem />
                <div className={classes.rightPanel}>
                    <div className="review__data">
                        {/* Card header */}
                        <div className={classes.modalHeader}>
                            <CardHeader
                                avatar={
                                    <Avatar alt={postAuthor?.displayName} src={postAuthor?.photoURL} />
                                }
                                title={
                                    <>
                                        <h4 className={classes.displayName}>
                                            <Link to={`/profile/${postAuthor?.uid}`}
                                                style={{ fontWeight: "bold", maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                                            >
                                                {postAuthor?.displayName}
                                            </Link>
                                            {
                                                postAuthor?.accountVerified ? (
                                                    <Tooltip title="Verified" arrow>
                                                        <CheckCircleTwoToneIcon style={{ color: blue[700] }} fontSize={"small"} />
                                                    </Tooltip>
                                                ) : null
                                            }
                                        </h4>

                                        {
                                            post?.tag ? (
                                                <span> with
                                                    <Link to={`/profile/${post?.tag?.uid}`} style={{ paddingLeft: "5px", fontWeight: "bold" }}>{post?.tag?.displayName}</Link>
                                                </span>
                                            ) : null
                                        }
                                        {
                                            post?.checkIn ? (
                                                <span> is at
                                                    <Link to={`/profile/${post?.checkIn?.uid}`} style={{ paddingLeft: "5px", fontWeight: "bold" }}>
                                                        {post?.checkIn?.displayName}

                                                    </Link>
                                                </span>
                                            ) : null
                                        }
                                    </>

                                }
                                subheader={dayjs(postCreated).fromNow()}
                                action={
                                    <IconButton aria-label="settings" onClick={handleClickUtil}>
                                        <MoreHorizRoundedIcon />
                                    </IconButton>
                                }
                            />
                        </div>
                        <Divider />

                        <div className={classes.data}>
                            {/* Card body */}
                            <div className={classes.modalBody}>
                                {
                                    post.caption ? (
                                        <div className="post__caption">
                                            {
                                                post.caption.length > 50 ? (
                                                    <span className={classes.captionText} >
                                                        {
                                                            isReadMore ? post.caption.slice(0, 50) : post.caption}
                                                        <span onClick={toggleReadMore} style={{ fontWeight: "bold", cursor: "pointer", color: "#8e8e8e" }}>{isReadMore ? "...read more" : null}</span>
                                                    </span>
                                                ) : <span className={classes.captionText}>{post.caption}</span>
                                            }
                                        </div>
                                    ) : null
                                }
                            </div>
                            <Divider />

                            {/* Card action */}
                            <CardActions disableSpacing>
                                {
                                    userLogged ? (
                                        <div className="post__button">
                                            <div className="action__like">
                                                <ToggleButton
                                                    value="check"
                                                    selected={selected}
                                                    classes={{
                                                        root: classes.likeButton,
                                                        selected: classes.selected,
                                                    }}
                                                    onClick={() => {
                                                        if (!selected) likePost();
                                                        else dislikePost();
                                                    }}
                                                >
                                                    {
                                                        selected ? <FavoriteRoundedIcon style={{ color: "red" }} /> : <FavoriteBorderTwoToneIcon />
                                                    }
                                                </ToggleButton>

                                            </div>
                                            <div className="action__comment">
                                                <IconButton aria-label="comment" onClick={handleFocus} >
                                                    <ModeCommentOutlinedIcon />
                                                </IconButton>
                                            </div>
                                            <div className="action__share">
                                                <ToggleButton
                                                    value="check"
                                                    selected={saveSelected}
                                                    // className={classes.likeButton}
                                                    classes={{
                                                        root: classes.likeButton,
                                                        selected: classes.selected,
                                                    }}
                                                    onClick={() => {
                                                        if (!saveSelected) savePost();
                                                        else unsavedPost();
                                                    }}
                                                >
                                                    {
                                                        saveSelected ? <BookmarkRoundedIcon style={{ color: "black" }} /> : <BookmarkBorderOutlinedIcon />
                                                    }
                                                </ToggleButton>
                                            </div>
                                        </div>
                                    ) : null

                                }

                                {
                                    post?.data ? (
                                        <div className="action__expand">
                                            <IconButton
                                                className={clsx(classes.expand, {
                                                    [classes.expandOpen]: expanded,
                                                })}
                                                onClick={handleExpandClick}
                                                aria-expanded={expanded}
                                                aria-label="show more"
                                            >
                                                <ExpandMoreIcon />
                                            </IconButton>
                                        </div>
                                    ) : null
                                }

                            </CardActions>
                            {/* Like count */}
                            {
                                postSnapshot?.data()?.likeCount > 0 ? (
                                    <div className={classes.displayLike}>
                                        <span className={classes.likesCount} onClick={handleOpenLikesList}><b>{postSnapshot?.data()?.likeCount.toLocaleString()} {postSnapshot?.data()?.likeCount === 1 ? 'Like' : 'Likes'}</b></span>
                                    </div>
                                ) : null
                            }
                            <Divider />

                            {/*Posts*/}
                            {
                                post?.data ? (
                                    <Collapse in={expanded} timeout="auto" unmountOnExit style={{ minHeight: "auto" }}>
                                        <>
                                            <CardContent className="recipe_layout__content-left">
                                                <Typography paragraph className={classes.paragraphHead} style={{ display: "flex", lineHeight: "30px" }}>Rating:
                                                    <Rating style={{ marginLeft: "5px" }} name="read-only" value={post.rating} precision={0.1} readOnly />
                                                </Typography>
                                                <div className="recipe_layout__facts">
                                                    <div className="recipe-facts__info">
                                                        <div className="recipe-facts__details recipe-facts__prepare"><span
                                                            className="recipe-facts__title">Prepare in:</span> <span>{post?.data?.prepTime} {post?.data?.prepUnit}</span></div>
                                                        <div className="recipe-facts__details recipe-facts__cooking"><span
                                                            className="recipe-facts__title">Cook in:</span> <span
                                                                className="theme-color">{post?.data?.cookTime} {post?.data?.cookUnit}</span></div>
                                                    </div>
                                                    <div className="recipe-facts__info">
                                                        <div className="recipe-facts__details recipe-facts__servings"><span
                                                            className="recipe-facts__title">Serves:</span> <span
                                                                className="theme-color">{post?.data?.serve}</span></div>
                                                    </div>
                                                </div>
                                                <Typography paragraph className={classes.paragraphHead} >Category: <Link style={{ textDecoration: "underline" }} to={`/recipe/topic/${post?.data?.category?.toLowerCase()}`}>{post?.data?.category}</Link></Typography>
                                                <Typography paragraph className={classes.paragraphHead}>Ingredients:</Typography>
                                                <Typography paragraph className={classes.paragraph}>{post?.data?.ingredient}</Typography>
                                            </CardContent>
                                            <CardContent className="recipe_layout__content-right">
                                                <Typography paragraph className={classes.paragraphHead}>Direction:</Typography>
                                                <Typography paragraph className={classes.paragraph}>{post?.data?.direction}</Typography>
                                            </CardContent>
                                        </>
                                        <Divider />
                                    </Collapse>
                                ) : null
                            }

                            {/* Comment*/}
                            <ListComment postId={postId} isPopup={`true`} postUid={post.uid} userLogged={userLogged} commentsCount={postSnapshot?.data()?.commentsCount} handleReplying={handleReplying} />

                        </div>
                        {
                            userLogged ? (
                                <CommentInput
                                    user={userLogged}
                                    postId={postId}
                                    type={post.type}
                                    path={'preview'}
                                    postAuthor={post.uid}
                                    replyComment={replyComment}
                                    handleRemoveReply={handleRemoveReply}
                                    refInput={el => searchInput.current[postId] = el}
                                />
                            ) : null
                        }
                        {
                            openLikesList ? (
                                <ListUserLikePost 
                                    open={openLikesList} 
                                    handleClose={handleCloseLikesList} 
                                    userLogged={userLogged} 
                                    postLike={postSnapshot?.data()?.likeBy} 
                                    likesCount={postSnapshot?.data()?.likeCount} 
                                />
                            ) : null
                        }
                        {
                            userLogged && openUtil ? (
                                <PostUtil open={openUtil} handleClose={handleCloseUtil} handleOpenEdit={handleOpenEdit} uid={userLogged.uid} opponentID={post.uid} postID={postId} savePost={saveSelected} handleReport={handleOpenReport} setOpenSnack={setOpenSnack} isFollow={isFollow} userLoggedData={userLoggedData} />
                            ) : null
                        }
                        {
                            openEdit ? (
                                <EditPost open={openEdit} handleClose={handleCloseEdit} post={post} postId={postId} />
                            ) : null
                        }
                        {
                            openReport ? (
                                <Report open={openReport} handleClose={handleCloseReport} postId={postId} userLogged={userLogged} setOpenSnack={setOpenSnack} />
                            ) : null
                        }

                    </div>
                </div>
            </div>
        </Modal>
    )
}
export default MediaViewer