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
import ShareIcon from "@material-ui/icons/Share";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CardActions from "@material-ui/core/CardActions";
import Divider from "@material-ui/core/Divider";


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
        borderTop: "1px solid rgba(var(--b6a,219,219,219),1)",
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
}));



export default function PostAction({id, uid, postLike, postSave, expanded, setExpanded, hasData}){
    const classes = useStyles();
    const [selected, setSelected] = useState(false);
    const [saveSelected, setSaveSelected] = useState(false);
    const [likeCount, setLikeCount] = useState(parseInt(postLike?.length));


    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    // Handle like and dislike action
    const likePost = () => {
        setSelected(true);
        handleLikePost(id, uid)
        setLikeCount((likes) => (selected ? likes - 1 : likes + 1));
    }

    const dislikePost = () => {
        setSelected(false);
        handleDislikePost(id, uid)
        setLikeCount((likes) => (selected ? likes - 1 : likes + 1));
    }

    const savePost = () => {
        // Save post id to user data, and push to post data
        setSaveSelected(true);
        handleSavePost(id, uid);
    }

    const unsavedPost = () => {
        // Save post id to user data, and push to post data
        setSaveSelected(false);
        handleUnSavedPost(id, uid);
    }

    useEffect(() => {
        if(typeof postLike !== 'undefined' && postLike.includes(uid)){
            setSelected(true);
        }

        if(typeof postSave !== 'undefined' && postSave.includes(uid)){
            setSaveSelected(true);
        }
    }, [])



    return(
        <>
            <CardActions disableSpacing className={classes.action}>
                <div className="post__button">
                    <div className="action__like">
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
                        {/*<IconButton aria-label="share">*/}
                        {/*	<BookmarkBorderOutlinedIcon />*/}
                        {/*</IconButton>*/}
                    </div>
                </div>
                {
                     hasData ? (
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

            {
                likeCount > 0 ? (<div className={classes.displayLike}>
                    <span><b>{likeCount} Likes</b></span>
                </div>) : null
            }

        </>
    )
}

PostAction.propTypes = {
    id: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
    postLike: PropTypes.array,
    postSave: PropTypes.array,
};