import React, {useEffect, useState} from "react";
import './Post.css';
import {Link} from "react-router-dom";
import ListComment from "../Comments";
import handleDislikePost from "../../utils/handleDislikePost";
import handleSavePost from "../../utils/handleSavePost";
import handleUnsavedPost from "../../utils/handleUnsavedPost";


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
import FavoriteBorderTwoToneIcon from '@material-ui/icons/FavoriteBorderTwoTone';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
import BookmarkRoundedIcon from '@material-ui/icons/BookmarkRounded';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {Button, CardContent, Collapse,TextField} from "@material-ui/core";
import {db, auth} from "../../firebase";
import firebase from "firebase";
import clsx from "clsx";

import {useAuthState} from "react-firebase-hooks/auth";
import Typography from "@material-ui/core/Typography";
// import Upload from "../Upload";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Skeleton from "@material-ui/lab/Skeleton";
import {useDocument} from "react-firebase-hooks/firestore";
import {ToggleButton} from "@material-ui/lab";
import Divider from "@material-ui/core/Divider";
import handleLikePost from "../../utils/handleLikePost";
import PostAction from "./PostAction";
import Popup from "../Upload/Popup";




const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: "100%",
		borderRadius: "max(0px, min(8px, calc((100vw - 4px - 100%) * 9999))) / 8px",
		boxShadow: "0px 0px 5px 0px #ddc4c4bf"
	},
	media: {
		height: 400
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
	displayLike: {
		padding: "0 0 20px 20px",
		borderBottom: "1px solid rgba(var(--b6a,219,219,219),1)"
	},
	action: {
		borderTop: "1px solid rgba(var(--b6a,219,219,219),1)",
		justifyContent: "space-between"
	},
	paragraph: {
		lineHeight: "26px",
		textAlign: "justify",
		whiteSpace: "pre-line",
		fontSize: "14px"
	},
	paragraphHead: {
		fontWeight: "600",
		fontSize: "1rem",
		marginBottom: "10px",
		padding: "5px 0",
		textTransform: "uppercase",
		borderBottom : "1px solid #000"
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
	dataContent: {
		display: "flex"
	},
	selected: {
		backgroundColor: "unset !important"
	},
	comment:{
		display: "block"
	}
}));


// id, user, caption, imageUrl, timestamp
//
function Post( {id, post, author, ...rest} ) {

	const postRef = db.collection('posts').doc(id);
	const classes = useStyles();
	const [comments, setComments] = useState([]);
	const [comment, setComment] = useState('');
	const [expanded, setExpanded] = useState(false);

	// post author data
	const [postAuthor] = useDocument(author && db.collection('users').doc(author))
	const postAuthorSnapshot = postAuthor?.data();

	// auth user data
	const [user] = useAuthState(auth);
	const authUserRef = user.uid && db.collection("users").doc(user.uid);

	const [selected, setSelected] = useState(false);
	const [saveSelected, setSaveSelected] = useState(false);

	let likeCount = 0;
	let media;

	// day ago

	dayjs.extend(relativeTime);
	let postCreated  = null;

	if(post?.timestamp){
		postCreated = new Date(post.timestamp.seconds * 1000).toLocaleString();
	}

	if(typeof post.likeBy !== 'undefined'){
		likeCount = post.likeBy.length;
	}

	// Render media
	if(post?.mediaType === "video/mp4"){
		media = <div className="post__content">
			<video controls className="post__contentImage" muted="muted" >
				<source src={post?.mediaUrl} type="video/mp4"/>
			</video>
		</div>
	} else {
		media = <div className="post__content">
			<img
				alt=""
				className="post__contentImage"
				src={post?.mediaUrl}
			/>
		</div>
	}

	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};


	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	// Handle like and dislike action
	const likePost = () => {
		setSelected(true);
		handleLikePost(postRef, user.uid)
	}

	const dislikePost = () => {
		setSelected(false);
		handleDislikePost(postRef, user.uid)
	}

	const savePost = () => {
		// Save post id to user data, and push to post data
		setSaveSelected(true);
		handleSavePost(postRef, authUserRef, user.uid, id);
	}

	const unsavedPost = () => {
		// Save post id to user data, and push to post data
		setSaveSelected(false);
		handleUnsavedPost(postRef, authUserRef, user.uid, id);
	}


	const postComment = (event) => {
		event.preventDefault();
		if(comment){
			db.collection("posts").doc(id).collection("comments").add({
				text: comment,
				user: db.doc('users/' + user.uid),
				uid: user.uid,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			});
		}
		setComment('');
	}

	// get comments
	useEffect(() => {
		if(id && user) {
			if(typeof post.likeBy !== 'undefined' && post.likeBy.includes(user.uid)){
				setSelected(true);
			}

			if(typeof post.saveBy !== 'undefined' && post.saveBy.includes(user.uid)){
				setSaveSelected(true);
			}

			postRef
				.collection("comments")
				.orderBy('timestamp', "desc")
				.onSnapshot((snapshot ) => {
					// var userProfile = {};
					setComments(
						snapshot.docs.map((doc => ({
							id: doc.id,
							comment: doc.data(),
							cmtAuthor: doc.data().user.get().then( cmtAuthor => {
								return cmtAuthor.data();
								// return Object.assign(userProfile, author.data());
							})
						})))
					);
				})
		}
	}, [id, user])

	return (
		<div className="post">
			<Card className={classes.root} >
				<CardHeader
					avatar={
						postAuthorSnapshot?.uid ? (
								<Avatar alt={postAuthorSnapshot?.displayName} src={postAuthorSnapshot?.photoURL}/>
							):(
								<Skeleton animation="wave" variant="circle" width={40} height={40} />
							)
					}
					title={
						postAuthorSnapshot?.uid ? (
							<Link to={`profile/${postAuthorSnapshot.uid}`}><span style={{fontWeight: "bold"}}>{postAuthorSnapshot?.displayName}</span></Link>
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
						postAuthorSnapshot?.uid ? (
							dayjs(postCreated).fromNow()
						) : (
							<Skeleton animation="wave" height={10} width="10%" style={{ marginBottom: 6 }} />
						)
					}
				/>

				{/*Media*/}
				{
					post?.mediaUrl ? (
						media
					) : (
						<Skeleton animation="wave" variant="rect" className={classes.media} />
					)
				}

				{/* Caption */}
				{
					post?.caption ? (
							<div className="post__caption">
								<Link to={`profile/${postAuthorSnapshot?.uid}`} className="post__user">{postAuthorSnapshot?.displayName}</Link>
								<span className={classes.captionText} >{post.caption}</span>
							</div>
					) : (
						<div className="post__caption">
							<Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} />
							<Skeleton animation="wave" height={10} width="80%" />
						</div>
					)
				}


				{/* Button */}
				<CardActions disableSpacing className={classes.action}>
					{
						user ? (
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
								<div className="action__share">
									<IconButton aria-label="share">
										<ShareIcon />
									</IconButton>
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

				{
					likeCount > 0 ? (
							<div className={classes.displayLike}>
								<span><b>{likeCount} Likes</b></span>
							</div>
					) : <Divider />
				}

				{/* Posts */}
				{
					post?.data ? (
							<Collapse in={expanded} timeout="auto" unmountOnExit >
								<div className="recipe_layout">
									<CardContent className="recipe_layout__content-left">
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
										<Typography paragraph className={classes.paragraphHead}>Ingredients:</Typography>
										<Typography paragraph className={classes.paragraph}>{post?.data?.ingredient}</Typography>
									</CardContent>
									<CardContent className="recipe_layout__content-right">
										<Typography paragraph className={classes.paragraphHead}>Direction:</Typography>
										<Typography paragraph className={classes.paragraph}>{post?.data?.direction}</Typography>
									</CardContent>
								</div>
								<Divider />
							</Collapse>
					) : null
				}

				{/* Comments */}

				<div className={classes.comment}>
					<ListComment comments={comments} />
					{
						user &&  (
							<div className="commentContainer">
								<Avatar alt={user?.displayName} src={user?.photoURL} />

								<form onSubmit={postComment}>
									<TextField
										className="comment__input"
										placeholder="Leave a comment ... "
										value={comment}
										onChange={event => setComment(event.target.value)}
										InputProps={{ disableUnderline: true}}

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

			<PostAction open={open} handleClose={handleClose} uid={user.uid} opponentID={post.uid} postID={id} isSave={saveSelected}/>

		</div>
	)
}

export default Post