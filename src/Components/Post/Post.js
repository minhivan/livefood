import React, {useEffect, useState} from "react";
import './Post.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ShareIcon from '@material-ui/icons/Share';
import {makeStyles} from "@material-ui/core/styles";
import ModeCommentOutlinedIcon from '@material-ui/icons/ModeCommentOutlined';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SwapVertIcon from '@material-ui/icons/SwapVert';
import { red } from '@material-ui/core/colors';
import {Button, Collapse, TextField} from "@material-ui/core";
import {db} from "../../firebase";
import firebase from "firebase";
import clsx from "clsx";
import {Link} from "react-router-dom";
import Comment from "./Comment";


const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: "100%",
		borderRadius: "max(0px, min(8px, calc((100vw - 4px - 100%) * 9999))) / 8px",
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
	avatar: {
		backgroundColor: red[500],
	},
	displayLike: {
		padding: "0 0 20px 20px",
		borderBottom: "1px solid rgba(var(--b6a,219,219,219),1)"
	},
	action: {
		borderTop: "1px solid rgba(var(--b6a,219,219,219),1)"
	}
}));




function Post({ postId, user, username, caption, imageUrl, timestamp}) {
	dayjs.extend(relativeTime)
	let letter = username.toString().charAt(0).toUpperCase();
	let postCreated  = null;
	let cmtLetter = null;
	if(timestamp){
		postCreated = new Date(timestamp.seconds * 1000).toLocaleString();
	}
	if(user){
		if(user.displayName){
			cmtLetter = user.displayName.toString().charAt(0).toUpperCase();
		}
	}
	const classes = useStyles();
	const [comments, setComments] = useState([]);
	const [comment, setComment] = useState('');
	//const [focusComment, setFocusComment] = useState(false);
	const [expanded, setExpanded] = React.useState(false);


	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	// const handleFocusComment = () => {
	//
	// }


	useEffect(() => {
		let unsubscribe;
		if(postId) {
			unsubscribe = db
				.collection("post")
				.doc(postId)
				.collection("comments")
				.orderBy('timestamp')
				.onSnapshot((snapshot ) => {
					setComments(
						snapshot.docs.map((doc => ({
							id: doc.id,
							comment: doc.data()
						})))
					)
				})
		}

		return () => {
			unsubscribe();
		}
	}, [postId])


	const postComment = (event) => {
		event.preventDefault();
		if(comment){
			db.collection("post").doc(postId).collection("comments").add({
				text: comment,
				username: user.displayName,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			});
		}
		setComment('');
	}

	return (
		<div className="post">
				<Card className={classes.root}>
					<CardHeader
						avatar={
							<Avatar aria-label="recipe" className={classes.avatar}>
								{letter}
							</Avatar>
						}
						title={
							<Link to={{pathname:`profile/`}}>{username}</Link>
						}

						subheader={dayjs(postCreated).fromNow()}
					/>
					<div className="post__content">
						<img
							alt=""
							className="post__contentImage"
							src={imageUrl}
						/>
					</div>

					<div className="post__caption">
						<a href="#" className="post__user">{username}</a>
						<span>{caption}</span>
					</div>

					{/* Button */}
					<CardActions disableSpacing className={classes.action}>
						<div className="action__like">
							<IconButton aria-label="add to favorites">
								<FavoriteBorderIcon />
							</IconButton>
						</div>
						<div className="action__comment">
							<IconButton aria-label="comment">
								<ModeCommentOutlinedIcon/>
							</IconButton>
						</div>
						<div className="action__share">
							<IconButton aria-label="share">
								<BookmarkBorderOutlinedIcon />
							</IconButton>
						</div>
						<div className="action__share">
							<IconButton aria-label="share">
								<ShareIcon />
							</IconButton>
						</div>

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
					</CardActions>

					<div className={classes.displayLike}>
						<span><b>512 Likes</b></span>
					</div>

					{/* Comments */}
					<div className={classes.comment}>
						<Comment comments={comments} />
						{
							user &&  (
								<div className="commentContainer">
									<Avatar aria-label="recipe" className={classes.avatar}>
										{cmtLetter}
									</Avatar>
									<form onSubmit={postComment}>
										<TextField
											className="comment__input"
											placeholder="Leave a comment ... "
											value={comment}
											onChange={event => setComment(event.target.value)}
										/>
										<Button variant="contained" disabled={!comment} onClick={postComment}>
											Post
										</Button>
									</form>
								</div>
							)
						}
					</div>
				</Card>
			</div>
	)
}

export default Post