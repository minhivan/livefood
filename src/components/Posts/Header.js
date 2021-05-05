import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Skeleton from "@material-ui/lab/Skeleton";
import {Link} from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import dayjs from "dayjs";
import CardHeader from "@material-ui/core/CardHeader";
import relativeTime from "dayjs/plugin/relativeTime";
import PropTypes from "prop-types";
import MoreHorizRoundedIcon from "@material-ui/icons/MoreHorizRounded";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
    root: {
        borderTop: "4px solid #0095A3",
        borderRadius: "16px"
    },
}));


export default function PostHeader({author, handleClickOpen, postDate, type}){
    const classes = useStyles();

    // day ago
    dayjs.extend(relativeTime);
    let postCreated  = null;

    if(postDate){
        postCreated = new Date(postDate.seconds * 1000).toLocaleString();
    }


    return (
        <CardHeader
            className={`${type==="recipe" && classes.root}`}
            avatar={
                author?.uid ? (
                    <Avatar alt={author?.displayName} src={author?.photoURL}/>
                ):(
                    <Skeleton animation="wave" variant="circle" width={40} height={40} />
                )
            }
            title={
                author?.uid ? (
                    <>
                        <Link to={`/profile/${author.uid}`}><span style={{fontWeight: "bold"}}>{author?.displayName}</span></Link>
                    </>
                ) : (
                    <Skeleton animation="wave" height={10} width="30%" style={{ marginBottom: 6 }} />
                )
            }
            action={
                <IconButton aria-label="settings" onClick={handleClickOpen}>
                    <MoreHorizRoundedIcon />
                </IconButton>
            }
            subheader={
                author?.uid ? (
                    <>
                        <span>{dayjs(postCreated).fromNow()}</span>
                    </>
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