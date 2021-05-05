import React, {useEffect, useState} from "react";

import PostComment from "../Comments";
import Card from '@material-ui/core/Card';
import {makeStyles} from "@material-ui/core/styles";
import {auth, db} from "../../firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import PostUtil from "./Util";
import PostAction from "./Action";
import PostContent from "./Content";
import PostHeader from "./Header";
import PostRecipeData from "./RecipeData";
import CommentInput from "../Comments/CommentInput";
import {useDocument} from "react-firebase-hooks/firestore";




const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: "100%",
		boxShadow: "none"
	},
}));


function Post( {id, post, handleRemove, handleReport, isSinglePage, ...rest} ) {

	const classes = useStyles();
	const [expanded, setExpanded] = useState(true);
	// auth user data
	const [user] = useAuthState(auth);
	const [open, setOpen] = React.useState(false);

	const [postAuthor] = useDocument(post.uid && db.collection('users').doc(post.uid))
	const author = postAuthor?.data();

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};



	return (
		<div className="post" id={id}>
			<Card className={classes.root} >
				<PostHeader author={author} handleClickOpen={handleClickOpen} postDate={post.timestamp} type={post.type} />
				{/*Media*/}
				<PostContent author={author} mediaUrl={post.mediaUrl} caption={post.caption} mediaType={post.mediaType}/>
				{/* Post Action*/}
				<PostAction id={id} uid={user.uid} postLike={post.likeBy} postSave={post.saveBy} expanded={expanded} setExpanded={setExpanded} hasData={!!post?.data} />
				{/* Recipe data */}
				<PostRecipeData id={id} postData={post.data} expanded={expanded}  rating={post?.rating}/>
				{/* Comments */}
				<PostComment id={id} isSinglePage={isSinglePage}/>
				{/* Comments input */}
				<CommentInput user={user} id={id} type={post.type}/>
			</Card>

			<PostUtil open={open} handleClose={handleClose} uid={user.uid} opponentID={post.uid} postID={id} handleReport={handleReport} handleRemove={handleRemove} isSave={false} />
		</div>
	)
}

export default Post