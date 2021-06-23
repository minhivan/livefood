import React, {useEffect, useState} from "react";
import clsx from "clsx";
import PropTypes from 'prop-types';
import {handleDislikePost, handleLikePost, handleSavePost, handleUnSavedPost} from "../../hooks/services";
import {makeStyles} from "@material-ui/core/styles";
import {ToggleButton} from "@material-ui/lab";
import FavoriteRoundedIcon from "@material-ui/icons/FavoriteRounded";
import FavoriteBorderTwoToneIcon from "@material-ui/icons/FavoriteBorderTwoTone";
import IconButton from "@material-ui/core/IconButton";
import ModeCommentOutlinedIcon from "@material-ui/icons/ModeCommentOutlined";
import BookmarkRoundedIcon from "@material-ui/icons/BookmarkRounded";
import BookmarkBorderOutlinedIcon from "@material-ui/icons/BookmarkBorderOutlined";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CardActions from "@material-ui/core/CardActions";
import ListUserLikePost from "../Popup/ListUserLikePost";
import {Tooltip} from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
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
        // borderTop: "1px solid rgba(var(--b6a,219,219,219),1)",
        justifyContent: "space-between"
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
    selected: {
        backgroundColor: "unset !important"
    },
    displayLike: {
        padding: "0 0 20px 20px",
        borderBottom: "1px solid rgba(var(--b6a,219,219,219),1)"
    },
    likesCount: {
        cursor: "pointer",
        '&:hover': {
            textDecoration: "underline",
        }
    }


}));



export default function PostAction({postId, post, expanded, setExpanded, handleFocus, userLogged, setSavePost}){
    const classes = useStyles();
    const [selected, setSelected] = useState(false);
    const [saveSelected, setSaveSelected] = useState(false);
    const [openLikesList, setOpenLikesList] = useState(false);
    const [userLoggedData, setUserLoggedData] = useState({});

    useEffect(() => {
        if(userLogged){
            setUserLoggedData({
                uid: userLogged.uid,
                photoURL: userLogged.photoURL,
                displayName: userLogged.displayName
            })
        }
    }, [userLogged])

    const handleOpenLikesList = () => {
        setOpenLikesList(true);
    }

    const handleCloseLikesList = () => {
        setOpenLikesList(false);
    }


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
        handleDislikePost(postId, userLogged.uid)
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

    useEffect(() => {
        if(userLogged){
            if(typeof post?.likeBy !== 'undefined' && post?.likeBy?.includes(userLogged.uid)){
                setSelected(true);
            }

            if(typeof post?.saveBy !== 'undefined' && post?.saveBy?.includes(userLogged.uid)){
                setSaveSelected(true);
                setSavePost(true);
            }
        }
    }, [post?.likeBy, post?.saveBy, userLogged])


    return(
        <>
            {
                userLogged ? (
                    <div className="post__action no-print">
                        <CardActions disableSpacing className={classes.action}>
                            <div className="post__button">
                                <div className="action__like">
                                    <Tooltip title="Love" arrow>
                                        <ToggleButton
                                            value="check"
                                            selected={selected}
                                            // className={classes.likeButton}
                                            classes={{
                                                root: classes.actionButton,
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
                                    </Tooltip>

                                </div>
                                <div className="action__comment">
                                    <Tooltip title="Comment" arrow>
                                        <IconButton aria-label="comment" onClick={handleFocus}>
                                            <ModeCommentOutlinedIcon/>
                                        </IconButton>
                                    </Tooltip>
                                </div>
                                <div className="action__save">
                                    <Tooltip title="Save" arrow>
                                        <ToggleButton
                                            value="check"
                                            selected={saveSelected}
                                            // className={classes.likeButton}
                                            classes={{
                                                root: classes.actionButton,
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
                                    </Tooltip>
                                    {/*<IconButton aria-label="share">*/}
                                    {/*	<BookmarkBorderOutlinedIcon />*/}
                                    {/*</IconButton>*/}
                                </div>
                            </div>
                            {
                                post?.data ? (
                                    <div className="action__expand">
                                        <Tooltip title="More" arrow>
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
                                        </Tooltip>
                                    </div>
                                ) : null
                            }
                        </CardActions>
                        {
                            post?.likeCount > 0 ? (
                                <div className={classes.displayLike}>
                                    <span className={classes.likesCount} onClick={handleOpenLikesList}><b>{post?.likeCount?.toLocaleString()} {post?.likeCount === 1 ? 'Like' : 'Likes'}</b></span>
                                </div>
                            ) : null
                        }
                        {
                            openLikesList ? (
                                <ListUserLikePost open={openLikesList} handleClose={handleCloseLikesList} userLogged={userLogged} postLike={post?.likeBy} likesCount={post?.likeCount}/>
                            ) : null
                        }
                    </div>
                ) : null
            }
        </>
    )
}

// PostAction.propTypes = {
//     postId: PropTypes.string.isRequired,
//     uid: PropTypes.string.isRequired,
//     postLike: PropTypes.array,
//     postSave: PropTypes.array,
// };