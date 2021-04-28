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
import {ToggleButton} from "@material-ui/lab";
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
        width: "335px",
        height: "100%",
        overflowY: "auto",
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
    }
}));

function MediaViewer(props){

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [selected, setSelected] = useState(false);
    const [expanded, setExpanded] = useState(true);
    const [user] = useAuthState(auth);
    const postRef = db.collection('posts').doc(props.id);

    const [postSnapshot] = useDocument(postRef);
    const [saveSelected, setSaveSelected] = useState(false);

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    let likeCount = 0
    if(typeof postSnapshot?.data()?.likeBy !== 'undefined'){
        likeCount = postSnapshot.data().likeBy.length;
    }


    dayjs.extend(relativeTime);
    let postCreated  = null;

    if(props?.post?.timestamp){
        postCreated = new Date(props?.post?.timestamp.seconds * 1000).toLocaleString();
    }

    const postComment = (event) => {
        event.preventDefault();
        if(comment){
            db.collection("posts").doc(props.id).collection("comments").add({
                text: comment,
                user: db.doc('users/' + user.uid),
                uid: user.uid,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
        }
        setComment('');
    }

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    // Handle like and dislike action
    const likePost = () => {
        setSelected(true);
        handleLikePost(props.id, user.uid)
    }

    const dislikePost = () => {
        setSelected(false);
        handleDislikePost(props.id, user.uid)
    }

    const savePost = () => {
        // Save post id to user data, and push to post data
        setSaveSelected(true);
        handleSavePost(props.id, user.uid);
    }

    const unsavedPost = () => {
        // Save post id to user data, and push to post data
        setSaveSelected(false);
        handleUnSavedPost(props.id, user.uid);
    }



    let media;

    if(props.post.mediaType === "video/mp4"){
        media = <div className={classes.imgHolder}>
            <video controls className={classes.img} muted="muted" onClick={e => e.target.play()}>
                <source src={props.post.mediaUrl} type="video/mp4"/>
            </video>
        </div>
    } else{
        media = <div className={classes.imgHolder}>
            <img src={props.post.mediaUrl} alt="" className={classes.img}/>
        </div>
    }




    useEffect(() => {
        if(props.id && user) {

            if(typeof props.post.likeBy !== 'undefined' && props.post.likeBy.includes(user.uid)){
                setSelected(true);
            }

            if(typeof props.post.saveBy !== 'undefined' && props.post.saveBy.includes(user.uid)){
                setSaveSelected(true);
            }
        }

    }, [props.id])

    return (
        <Modal
            className={classes.root}
            open={props.open}
            onClose={props.handleClose}
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
                        <div className={classes.modalHeader}>
                            <CardHeader
                                avatar={
                                    <Avatar alt={props.postAuthor?.displayName} src={props.postAuthor.photoURL}/>
                                }
                                title={
                                    <Link to={`/profile/${props.postAuthor?.uid}`}>{props.postAuthor?.displayName}</Link>
                                }
                                subheader={dayjs(postCreated).fromNow()}
                            />
                            <div className={classes.buttonClose}>
                                <IconButton aria-label="Cancel" color="inherit" onClick={props.handleClose} >
                                    <CancelTwoToneIcon />
                                </IconButton>
                            </div>
                        </div>
                        <Divider />
                        <div className={classes.modalBody}>
                            <div className="post__caption">
                                <Link to={`/profile/${props.postAuthor?.uid}`} className="post__user">{props.postAuthor?.displayName}</Link>
                                <span className={classes.captionText}>{props.post.caption}</span>
                            </div>
                        </div>
                        <Divider />
                        {/* Card action */}
                        <CardActions disableSpacing>
                            {
                                user ? (
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
                                props?.post?.data ? (
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
                                    <span><b>{likeCount.toLocaleString()} Likes</b></span>

                                </div>
                            ) : null
                        }
                        <Divider />

                        {/*Posts*/}
                        {
                            props?.post?.data ? (
                                <Collapse in={expanded} timeout="auto" unmountOnExit style={{minHeight: "auto"}}>
                                    <>
                                        <CardContent className="recipe_layout__content-left">
                                            <div className="recipe_layout__facts">
                                                <div className="recipe-facts__info">
                                                    <div className="recipe-facts__details recipe-facts__prepare"><span
                                                        className="recipe-facts__title">Prepare in:</span> <span>{props?.post?.data?.prepTime} {props?.post?.data?.prepUnit}</span></div>
                                                    <div className="recipe-facts__details recipe-facts__cooking"><span
                                                        className="recipe-facts__title">Cook in:</span> <a
                                                        className="theme-color">{props?.post?.data?.cookTime} {props?.post?.data?.cookUnit}</a></div>
                                                </div>
                                                <div className="recipe-facts__info">
                                                    <div className="recipe-facts__details recipe-facts__servings"><span
                                                        className="recipe-facts__title">Serves:</span> <a
                                                        className="theme-color">{props?.post?.data?.serve}</a></div>
                                                </div>
                                            </div>
                                            <Typography paragraph className={classes.paragraphHead}>Ingredients:</Typography>
                                            <Typography paragraph className={classes.paragraph}>{props?.post?.data?.ingredient}</Typography>
                                        </CardContent>
                                        <CardContent className="recipe_layout__content-right">
                                            <Typography paragraph className={classes.paragraphHead}>Direction:</Typography>
                                            <Typography paragraph className={classes.paragraph}>{props?.post?.data?.direction}</Typography>
                                        </CardContent>
                                    </>
                                    <Divider />
                                </Collapse>
                            ) : null
                        }

                        {/*<ListComment comments={comments} />*/}
                        <ListComment id={props.id} />

                        <div className="commentContainer commentViewer ">
                            <Divider />
                            {
                                user &&  (
                                    <form onSubmit={postComment} >
                                        <TextField
                                            className="comment__input"
                                            placeholder="Leave a comment ... "
                                            value={comment}
                                            onChange={event => setComment(event.target.value)}
                                            InputProps={{ disableUnderline: true}}
                                        />
                                        <Button
                                            variant="contained"
                                            disabled={!comment}
                                            onClick={postComment}
                                            classes={{
                                                root: classes.cmtButton,
                                                label: classes.cmtButtonLabel
                                            }}
                                        >
                                            Post
                                        </Button>
                                    </form>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
export default MediaViewer