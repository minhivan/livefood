import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Skeleton from "@material-ui/lab/Skeleton";
import {Link} from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import dayjs from "dayjs";
import CardHeader from "@material-ui/core/CardHeader";
import relativeTime from "dayjs/plugin/relativeTime";
import PropTypes from "prop-types";

export default function PostHeader({author, handleClickOpen, postDate}){
    // day ago
    dayjs.extend(relativeTime);
    let postCreated  = null;

    if(postDate){
        postCreated = new Date(postDate.seconds * 1000).toLocaleString();
    }


    return (
        <CardHeader
            avatar={
                author?.uid ? (
                    <Avatar alt={author?.displayName} src={author?.photoURL}/>
                ):(
                    <Skeleton animation="wave" variant="circle" width={40} height={40} />
                )
            }
            title={
                author?.uid ? (
                    <Link to={`/profile/${author.uid}`}><span style={{fontWeight: "bold"}}>{author?.displayName}</span></Link>
                ) : (
                    <Skeleton animation="wave" height={10} width="30%" style={{ marginBottom: 6 }} />
                )
            }
            action={
                <IconButton aria-label="settings" onClick={handleClickOpen}>
                    <MoreVertIcon />
                </IconButton>
            }
            subheader={
                author?.uid ? (
                    dayjs(postCreated).fromNow()
                ) : (
                    <Skeleton animation="wave" height={10} width="10%" style={{ marginBottom: 6 }} />
                )
            }
        />
    )
}

PostHeader.propTypes = {
    handleClickOpen: PropTypes.func,
    postDate: PropTypes.object,
};