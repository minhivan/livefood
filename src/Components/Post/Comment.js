import React from "react";
import Avatar from "@material-ui/core/Avatar";
import dayjs from "dayjs";
import IconButton from "@material-ui/core/IconButton";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import SwapVertIcon from "@material-ui/icons/SwapVert";
import {makeStyles} from "@material-ui/core/styles";
import {red} from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({

    avatar: {
        backgroundColor: red[500],
    },
    displayCmt: {
        padding: "10px 20px",
        textAlign: "right",
        color: "#8e8e8e"
    }

}));



function Comment({comments}){
    const classes = useStyles();
    let count = 0;
    comments.map((comment) => {
        return count++
    })

    return(
        <div className="listComments">
            {
                count > 0 && (
                    <h5 className={classes.displayCmt}>Displaying {count} comments</h5>
                )
            }
            {
                comments.map((comment) => (
                    <div className="commentDetails" key={comment.id}>
                        <Avatar aria-label="recipe" className={classes.avatar}>
                            {comment.comment.username.toString().charAt(0).toUpperCase()}
                        </Avatar>
                        <div className="comment__content">
                            <div className="comment__block">
                                <div className="comment__sub">
                                    <a href="#" className="post__user">{comment.comment.username}</a>
                                    {
                                        comment.comment.timestamp ? (
                                            <span>{
                                                dayjs(new Date(comment.comment.timestamp.seconds * 1000).toLocaleString()).fromNow()}</span>
                                        ) : null
                                    }

                                    <p>{comment.comment.text}</p>
                                </div>
                                <div className="comment__action">
                                    <div className="action__like">
                                        <IconButton aria-label="add to favorites">
                                            <FavoriteBorderIcon />
                                        </IconButton>
                                        <span>123 likes</span>
                                    </div>

                                    <div className="action__reply">
                                        <IconButton aria-label="comment">
                                            <SwapVertIcon />
                                        </IconButton>
                                        <span>4 replies</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                ))
            }
        </div>
    )
}

export default Comment