import React, {useEffect, useState} from "react";
import {Button, CardContent, Collapse, IconButton, Modal, TextField} from "@material-ui/core";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";
import {makeStyles} from "@material-ui/core/styles";
// import {db} from "../../firebase";
// import ListComment from "../Posts/Comments";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import {Link} from "react-router-dom";
import Divider from '@material-ui/core/Divider';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {Rating, ToggleButton} from "@material-ui/lab";
import FavoriteRoundedIcon from "@material-ui/icons/FavoriteRounded";
import FavoriteBorderTwoToneIcon from "@material-ui/icons/FavoriteBorderTwoTone";
import ModeCommentOutlinedIcon from "@material-ui/icons/ModeCommentOutlined";
import BookmarkBorderOutlinedIcon from "@material-ui/icons/BookmarkBorderOutlined";
import CardActions from "@material-ui/core/CardActions";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";
import {useAuthState} from "react-firebase-hooks/auth";

import {auth, db} from "../../firebase";
import firebase from "firebase";
import ListComment from "../Comments";
import {useDocument} from "react-firebase-hooks/firestore";
import BookmarkRoundedIcon from "@material-ui/icons/BookmarkRounded";
import {handleSavePost, handleUnSavedPost, handleLikePost, handleDislikePost} from "../../hooks/services";
import CommentInput from "../Comments/CommentInput";




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
        maxHeight: "600px",
        height: "100%",
        display: "flex",
        justifyContent: "space-between",
        overflow: "hidden",
        borderRadius: "16px"
    },
    modalHeader: {
        display: "flex",
        justifyContent: "flex-start",
    },
    buttonClose: {
        position: "fixed",
        right: "0",
        top: "0"
    },
    imgHolder: {
        width: "600px",
        paddingBottom: "100%",
        position: "relative",
        overflow : "hidden",
        backgroundColor: "rgb(232, 231, 224)"
    },
    img: {
        objectFit: "contain",
        height: "100%",
        left: "0",
        position: "absolute",
        top: "0",
        width: "100%",
    },
    leftPanel: {
        height: "100%",
        maxWidth: "600px"
    },
    rightPanel: {
        width: "350px",
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
        borderBottom : "1px solid #000"
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
    cmtButton: {

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
    }
}));

function MediaViewer(props){

    const {open, handleClose, postId, post, postAuthor, userLogged} = props;
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [selected, setSelected] = useState(false);
    const [expanded, setExpanded] = useState(true);
    const [saveSelected, setSaveSelected] = useState(false);
    const [likeCount, setLikeCount] = useState(post?.likeBy?.length)

    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };


    dayjs.extend(relativeTime);
    let postCreated  = null;

    if(post?.timestamp){
        postCreated = new Date(post?.timestamp.seconds * 1000).toLocaleString();
    }

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    // Handle like and dislike action
    const likePost = () => {
        setSelected(true);
        handleLikePost(postId, userLogged.uid)
        setLikeCount((likes) => (selected ? likes - 1 : likes + 1));
    }

    const dislikePost = () => {
        setSelected(false);
        handleDislikePost(postId, userLogged.uid)
        setLikeCount((likes) => (selected ? likes - 1 : likes + 1));
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

    let media;

    if(post.mediaType === "video/mp4"){
        media = <div className={classes.imgHolder}>
            <video controls className={classes.img} muted="muted" onClick={e => e.target.play()}>
                <source src={post.mediaUrl} type="video/mp4"/>
            </video>
        </div>
    } else{
        media = <div className={classes.imgHolder}>
            <img src={post.mediaUrl} alt="" className={classes.img}/>
        </div>
    }


    useEffect(() => {
        if(userLogged){
            if(typeof post.likeBy !== 'undefined' && post.likeBy.includes(userLogged.uid)){
                setSelected(true);
            }
            if(typeof post.saveBy !== 'undefined' && post.saveBy.includes(userLogged.uid)){
                setSaveSelected(true);
            }
        }
    }, [post.likeBy, post.saveBy, userLogged])

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
                    {media}
                </div>
                <Divider orientation="vertical" flexItem />
                <div className={classes.rightPanel}>
                    <div className="review__data">
                        {/* Card header */}
                        <div className={classes.modalHeader}>
                            <CardHeader
                                avatar={
                                    <Avatar alt={postAuthor?.displayName} src={postAuthor?.photoURL}/>
                                }
                                title={
                                    <Link to={`/profile/${postAuthor?.uid}`} style={{fontWeight: "bold"}}>{postAuthor?.displayName}</Link>
                                }
                                subheader={dayjs(postCreated).fromNow()}
                            />
                            <div className={classes.buttonClose}>
                                <IconButton aria-label="Cancel" color="inherit" onClick={handleClose} >
                                    <CancelTwoToneIcon />
                                </IconButton>
                            </div>
                        </div>
                        <Divider />

                        <div className={classes.data}>
                            {/* Card body */}
                            <div className={classes.modalBody}>
                                <div className="post__caption">
                                    <Link to={`/profile/${postAuthor?.uid}`} className="post__user">{postAuthor?.displayName}</Link>
                                    {
                                        post.caption.length > 50 ? (
                                            <span className={classes.captionText} >
                                                {
                                                    isReadMore ? post.caption.slice(0, 50) : post.caption}
                                                    <span onClick={toggleReadMore} style={{fontWeight: "bold", cursor: "pointer", color: "#8e8e8e"}}>
                                                    {isReadMore ? "...read more" : null
                                                }
                                            </span>
                                            </span>
                                        ) : post.caption
                                    }
                                </div>
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
                                                        if(!selected) likePost();
                                                        else dislikePost();
                                                    }}
                                                >
                                                    {
                                                        selected ? <FavoriteRoundedIcon style={{color: "red"}}/> : <FavoriteBorderTwoToneIcon />
                                                    }
                                                </ToggleButton>

                                            </div>
                                            <div className="action__comment">
                                                <IconButton aria-label="comment">
                                                    <ModeCommentOutlinedIcon/>
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
                                                        if(!saveSelected) savePost();
                                                        else unsavedPost();
                                                    }}
                                                >
                                                    {
                                                        saveSelected ? <BookmarkRoundedIcon style={{color: "black"}}/> : <BookmarkBorderOutlinedIcon />
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
                                likeCount > 0 ? (
                                    <div className={classes.displayLike}>
                                        <span><b>{likeCount.toLocaleString()} {likeCount  === 1 ? 'Like' : 'Likes'}</b></span>
                                    </div>
                                ) : null
                            }
                            <Divider />

                            {/*Posts*/}
                            {
                                post?.data ? (
                                    <Collapse in={expanded} timeout="auto" unmountOnExit style={{minHeight: "auto"}}>
                                        <>
                                            <CardContent className="recipe_layout__content-left">
                                                <Typography paragraph className={classes.paragraphHead} style={{display: "flex", lineHeight: "30px"}}>Rating:
                                                    <Rating style={{marginLeft: "5px"}} name="read-only" value={post.rating} precision={0.1} readOnly />
                                                </Typography>
                                                <div className="recipe_layout__facts">
                                                    <div className="recipe-facts__info">
                                                        <div className="recipe-facts__details recipe-facts__prepare"><span
                                                            className="recipe-facts__title">Prepare in:</span> <span>{post?.data?.prepTime} {post?.data?.prepUnit}</span></div>
                                                        <div className="recipe-facts__details recipe-facts__cooking"><span
                                                            className="recipe-facts__title">Cook in:</span> <a
                                                            className="theme-color">{post?.data?.cookTime} {post?.data?.cookUnit}</a></div>
                                                    </div>
                                                    <div className="recipe-facts__info">
                                                        <div className="recipe-facts__details recipe-facts__servings"><span
                                                            className="recipe-facts__title">Serves:</span> <a
                                                            className="theme-color">{post?.data?.serve}</a></div>
                                                    </div>
                                                </div>
                                                <Typography paragraph className={classes.paragraphHead} >Category: <Link style={{textDecoration: "underline"}} to={`/recipe/topic/${post?.data?.category?.toLowerCase()}`}>{post?.data?.category}</Link></Typography>
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
                            <ListComment postId={postId} isPopup={`true`} />

                        </div>
                        <CommentInput user={userLogged} postId={postId} type={post.type} path={'preview'}  postAuthor={post.uid}/>

                    </div>
                </div>
            </div>
        </Modal>
    )
}
export default MediaViewer