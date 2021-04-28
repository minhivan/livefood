import React, {useEffect, useState} from "react";

import PostComment from "../Comments";
import Card from '@material-ui/core/Card';
import {makeStyles} from "@material-ui/core/styles";
import {db, auth} from "../../firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import PostUtil from "./Util";
import PostAction from "./Action";
import PostContent from "./Content";
import PostHeader from "./Header";
import PostRecipeData from "./RecipeData";
import CommentInput from "../Comments/CommentInput";




const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: "100%",
		boxShadow: "none"
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
	action: {
		borderTop: "1px solid rgba(var(--b6a,219,219,219),1)",
		justifyContent: "space-between"
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

	const classes = useStyles();
	const [expanded, setExpanded] = useState(false);

	// auth user data
	const [user] = useAuthState(auth);


	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};


	return (
		<div className="post">
			<Card className={classes.root} >
				<PostHeader author={author} handleClickOpen={handleClickOpen} postDate={post.timestamp} type={post.type}/>
				{/*Media*/}
				<PostContent author={author} mediaUrl={post.mediaUrl} caption={post.caption} mediaType={post.mediaType} />
				{/* Post Action*/}
				<PostAction id={id} uid={user.uid} postLike={post.likeBy} postSave={post.saveBy} expanded={expanded} setExpanded={setExpanded} hasData={!!post?.data}/>
				{/* Recipe data */}
				<PostRecipeData postData={post.data} expanded={expanded}/>
				{/* Comments */}
				<PostComment id={id} />
				{/* Comments input */}
				<CommentInput user={user} id={id}/>
			</Card>

			<PostUtil open={open} handleClose={handleClose} uid={user.uid} opponentID={post.uid} postID={id} isSave={false}/>

		</div>
	)
}

export default Post