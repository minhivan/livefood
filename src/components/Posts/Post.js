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
import FavoriteBorderTwoToneIcon from '@material-ui/icons/FavoriteBorderTwoTone';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { red } from '@material-ui/core/colors';
import {Button, CardContent, Collapse, TextField} from "@material-ui/core";
import {db, auth} from "../../firebase";
import firebase from "firebase";
import clsx from "clsx";
import {Link} from "react-router-dom";
import ListComment from "../Comments";
import {useAuthState} from "react-firebase-hooks/auth";
import Typography from "@material-ui/core/Typography";
// import Upload from "../Upload";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Skeleton from "@material-ui/lab/Skeleton";
import {useCollection, useDocument} from "react-firebase-hooks/firestore";
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: "100%",
		borderRadius: "max(0px, min(8px, calc((100vw - 4px - 100%) * 9999))) / 8px",
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
	avatar: {
		backgroundColor: red[500],
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
	imgHolder: {
		backgroundColor: "#efefef",
		display: "block",
		width: "100%",
		position: "relative"
	},
	imgPlace: {
		paddingBottom: "100%",
		overflow: "hidden"
	},
	likeButton: {
		border: "0",
		backgroundColor: "none",
		borderRadius: "50%",
		'&:hover': {
			color: 'red',
		}
	},
	dataContent: {
		display: "flex"
	},
	selected: {
		backgroundColor: "unset !important"
	}
}));


// id, user, caption, imageUrl, timestamp
//
function Post( {id, post, author, ...rest} ) {


	const postData = db.collection('posts').doc(id);
	const classes = useStyles();
	const [comments, setComments] = useState([]);
	const [comment, setComment] = useState('');
	const [expanded, setExpanded] = useState(false);
	const [user] = useAuthState(auth);
	const [postAuthor] = useCollection(db.collection('users').where('uid', '==', author))
	const postAuthorSnapshot = postAuthor?.docs?.[0].data();
	const [selected, setSelected] = useState(false);
	// day ago
	dayjs.extend(relativeTime);
	let postCreated  = null;
	if(post?.timestamp){
		postCreated = new Date(post.timestamp.seconds * 1000).toLocaleString();
	}

	// Render media
	let media;
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

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	// Handle like and dislike action
	const handleLikePost = () => {
		setSelected(true);
		postData.update({
			likeBy: firebase.firestore.FieldValue.arrayUnion(user.uid)
		});
	}

	const handleDislikePost = () => {
		setSelected(false);
		postData.update({
			likeBy: firebase.firestore.FieldValue.arrayRemove(user.uid)
		});
	}

	let likeCount = 0
	if(typeof post.likeBy !== 'undefined'){
		likeCount = post.likeBy.length;
	}


	// get comments
	useEffect(() => {
		if(id && user) {
			if(typeof post.likeBy !== 'undefined' && post.likeBy.includes(user.uid)){
				setSelected(true);
			}

			postData
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

	}, [id])


	// console.log(props.post.mediaType);

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


	return (
		<div className="post">
			<Card className={classes.root} variant="outlined">
				<CardHeader
					avatar={
						postAuthorSnapshot?.uid ? (
								<Avatar className={classes.avatar} alt={postAuthorSnapshot?.displayName} src={postAuthorSnapshot?.photoURL}/>
							):(
								<Skeleton animation="wave" variant="circle" width={40} height={40} />
							)
					}
					title={
						postAuthorSnapshot?.uid ? (
							<Link to={`profile/${postAuthorSnapshot.uid}`}>{postAuthorSnapshot?.displayName}</Link>
						) : (
							<Skeleton animation="wave" height={10} width="30%" style={{ marginBottom: 6 }} />
							)
					}
					action={
						<IconButton aria-label="settings">
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
											root: classes.likeButton,
											selected: classes.selected,
										}}
										onClick={() => {
											if(!selected) handleLikePost();
											else handleDislikePost();
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
									<IconButton aria-label="share">
										<BookmarkBorderOutlinedIcon />
									</IconButton>
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
								<Avatar className={classes.avatar} alt={user?.displayName} src={user?.photoURL} />

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
		</div>
	)
}

export default Post