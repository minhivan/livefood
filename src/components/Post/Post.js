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
import {useCollection} from "react-firebase-hooks/firestore";

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
		borderTop: "1px solid rgba(var(--b6a,219,219,219),1)"
	},
	paragraph: {
		fontFamily: "'Quicksand', sans-serif",
	},
	paragraphHead: {
		fontFamily: "'Quicksand', sans-serif",
		fontWeight: "600",
		fontSize: "1rem"
	}
}));


// postId, user, caption, imageUrl, timestamp
//
function Post( {postId, post, author, ...rest} ) {
	const [user] = useAuthState(auth);
	const [userData] = useCollection(db.collection('users').where('uid', '==', author))
	const postAuthor = userData?.docs?.[0].data();

	dayjs.extend(relativeTime);
	let postCreated  = null;
	if(post?.timestamp){
		postCreated = new Date(post.timestamp.seconds * 1000).toLocaleString();
	}

	let media;
	if(post?.mediaType === "video/mp4"){
		media = <div className="post__content">
			<video controls className="post__contentImage" muted="muted">
				<source src={post.mediaUrl} type="video/mp4"/>
			</video>
		</div>
	}
	else{
		media = <div className="post__content">
			<img
				alt=""
				className="post__contentImage"
				src={post.mediaUrl}
			/>
		</div>
	}

	const classes = useStyles();
	const [comments, setComments] = useState([]);
	const [comment, setComment] = useState('');
	const [expanded, setExpanded] = React.useState(false);

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	useEffect(() => {
		let unsubscribe;
		if(postId) {
			unsubscribe = db
				.collection("posts")
				.doc(postId)
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

		return () => {
			unsubscribe();
		}
	}, [postId])


	// console.log(props.post.mediaType);

	const postComment = (event) => {
		event.preventDefault();
		if(comment){
			db.collection("posts").doc(postId).collection("comments").add({
				text: comment,
				user: db.doc('users/' + user.uid),
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
						postAuthor?.uid ? (
								<Avatar className={classes.avatar} alt={postAuthor?.displayName} src={postAuthor?.photoURL}/>
							):(
								<Skeleton animation="wave" variant="circle" width={40} height={40} />
							)
					}
					title={
						postAuthor?.uid ? (
							<Link to={`profile/${postAuthor.uid}`}>{postAuthor?.displayName}</Link>
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
						postAuthor?.uid ? (
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
								<Link to={`profile/${author?.uid}`} className="post__user">{postAuthor?.displayName}</Link>
								<span style={{whiteSpace: 'pre-line'}}>{post.caption}</span>
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
					<span><b>0 Likes</b></span>
				</div>
				{/* Post */}
				<Collapse in={expanded} timeout="auto" unmountOnExit>
					<CardContent>
						<Typography paragraph className={classes.paragraphHead}>Method:</Typography>
						<Typography paragraph className={classes.paragraph}>
							Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
							minutes.
						</Typography>
						<Typography paragraph className={classes.paragraph}>
							Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
							heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
							browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken
							and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and
							pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add
							saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
						</Typography>
						<Typography paragraph className={classes.paragraph}>
							Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
							without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
							medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook
							again without stirring, until mussels have opened and rice is just tender, 5 to 7
							minutes more. (Discard any mussels that don’t open.)
						</Typography>
						<Typography paragraph className={classes.paragraph}>
							Set aside off of the heat to let rest for 10 minutes, and then serve.
						</Typography>
					</CardContent>
				</Collapse>
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
										InputProps={{ disableUnderline: true, style : {fontFamily: "'Quicksand', sans-serif"}}}

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