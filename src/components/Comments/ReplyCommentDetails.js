import React, {useState} from "react";
import Avatar from "@material-ui/core/Avatar";
import {Link} from "react-router-dom";
import {Rating, ToggleButton} from "@material-ui/lab";
import dayjs from "dayjs";
import IconButton from "@material-ui/core/IconButton";
import MoreHorizRoundedIcon from "@material-ui/icons/MoreHorizRounded";
import {Tooltip} from "@material-ui/core";
import FavoriteRoundedIcon from "@material-ui/icons/FavoriteRounded";
import FavoriteBorderTwoToneIcon from "@material-ui/icons/FavoriteBorderTwoTone";
import CommentUtil from "../Popup/CommentUtil";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    more: {
        marginLeft: "auto",
        position: "absolute",
        padding: "5px",
        top: "-5px",
        right: 0
    },
    captionText: {
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
    selected: {
        backgroundColor: "unset !important"
    },
    reply: {
        color: "rgb(84, 110, 122)",
        fontSize: "12px !important",
        fontWeight: 'bold',
        "&:hover": {
            color: "rgb(46,61,68)",
            transform: "0,2s all ease",
        },
    },
    customDivider:{
        border: "none",
        height: "1px",
        margin: 0,
        width: "50px",
        flexShrink: 0,
        backgroundColor: "rgba(0, 0, 0, 0.12)",
    }
}));
export default function ReplyCommentDetails(props) {
    const {userLogged, data, replyId} = props;
    const classes = useStyles();
    const [isReadMore, setIsReadMore] = useState(true);

    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };


    return(
        <div className="sub-comment-details">
            <Avatar alt={data?.userDisplayName} src={data?.userAvt}/>
            <div className="comment__content">
                <div className="comment__block">
                    <div className={`comment__sub`}>
                        <Link to={`/profile/${data?.uid}`}>{data?.userDisplayName}</Link>
                        <div style={{display: "flex"}}>
                            <span style={{color: "#546e7a", fontSize: "12px", }}>{dayjs(new Date(data?.timestamp?.seconds * 1000).toLocaleString()).fromNow()}</span>
                        </div>
                        <IconButton className={classes.more} aria-label="Util">
                            <MoreHorizRoundedIcon />
                        </IconButton>
                    </div>
                    <div className="comment__caption">
                        {
                            data?.text.length > 100 ? (
                                <p>
                                    {isReadMore ? data?.text.slice(0, 100) : data?.text}
                                    <span onClick={toggleReadMore} style={{fontWeight: "bold", cursor: "pointer", color: "#8e8e8e"}}>
                                        {isReadMore ? "...read more" : null}
                                    </span>
                                </p>
                            ) : (<p>{data?.text}</p>)
                        }
                    </div>
                    <div className="comment__action">
                        <div className="comment__action-like">
                            <Tooltip title="Like" arrow>
                                <ToggleButton
                                    size="small"
                                    value="check"
                                    selected={true}
                                    // className={classes.likeButton}
                                    classes={{
                                        root: classes.actionButton,
                                        selected: classes.selected,
                                    }}
                                >
                                    {
                                        1 === 1 ? <FavoriteRoundedIcon style={{color: "red"}} fontSize="inherit"/> : <FavoriteBorderTwoToneIcon />
                                    }
                                </ToggleButton>
                            </Tooltip>
                            <span className={classes.reply}>120 likes</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}