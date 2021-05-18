import React, {useRef, useState} from "react";

import PostComment from "../Comments";
import Card from '@material-ui/core/Card';
import {makeStyles} from "@material-ui/core/styles";
import {auth, db} from "../../firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import PostUtil from "../Popup/PostUtil";
import PostAction from "./Action";
import PostContent from "./Content";
import PostHeader from "./Header";
import PostRecipeData from "./RecipeData";
import CommentInput from "../Comments/CommentInput";
import {useDocument} from "react-firebase-hooks/firestore";
import EditPost from "../Popup/EditPost";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";




const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: "100%",
		boxShadow: "none"
	},
}));


function Post({id, post, handleRemove, handleReport, isSinglePage,...rest}) {

	const classes = useStyles();
	const [expanded, setExpanded] = useState(true);
	// auth user data
	const [user] = useAuthState(auth);
	const [openSnack, setOpenSnack] = useState(false);
	const [open, setOpen] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [postAuthor] = useDocument(post.uid && db.collection('users').doc(post.uid))
	const author = postAuthor?.data();

	const searchInput = useRef(null)


	const handleCloseEdit = () => {
		setOpenEdit(false);
	};
	const handleOpenEdit = () => {
		setOpenEdit(true)
	}

	function handleFocus(){
		searchInput.current.focus();
		searchInput.current.scrollIntoView({
			behavior: "smooth",
			block : "center"
		})
	}

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleCloseSnack = (event) => {
		setOpenSnack(false);
	};


	return (
		<div className={`post `} id={id}>
			<Card className={classes.root} >
				<PostHeader author={author} handleClickOpen={handleClickOpen} postDate={post.timestamp} type={post.type} postFelling={post?.felling} />
				{/*Media*/}
				<PostContent author={author} caption={post.caption} postMedia={post?.media}/>
				{/* Post Action*/}
				{
					user ? (
						<PostAction postId={id} userLogged={user} post={post} expanded={expanded} setExpanded={setExpanded} handleFocus={handleFocus}/>
					) : null
				}
				{/* Recipe data */}
				<PostRecipeData postId={id} postData={post.data} expanded={expanded} rating={post?.rating}/>
				{/* Comments */}
				<PostComment postId={id} isSinglePage={isSinglePage} postUid={post.uid} userLogged={user} commentsCount={post?.commentsCount}/>
				{/* Comments input */}
				{
					user ? (
						<CommentInput postAuthor={post.uid} user={user} postId={id} type={post.type} refInput={searchInput}/>
					) : null
				}
			</Card>
			{
				user && open ? (
					<PostUtil open={open} handleClose={handleClose} handleOpenEdit={handleOpenEdit} uid={user.uid} opponentID={post.uid} postID={id} handleReport={handleReport} handleRemove={handleRemove}  setOpenSnack={setOpenSnack}/>
				) : null
			}
			{
				openEdit ? (
					<EditPost open={openEdit} handleClose={handleCloseEdit} post={post} postId={id} setOpenSnack={setOpenSnack}/>
				) : null
			}

			{
				openSnack ? (
					<Snackbar
						open={openSnack}
						autoHideDuration={6000}
						onClose={handleCloseSnack}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}
					>
						<Alert variant="filled" onClose={handleCloseSnack} severity="success">
							Upload successfully !
						</Alert>
					</Snackbar>
				) : null
			}


		</div>
	)
}

export default Post;