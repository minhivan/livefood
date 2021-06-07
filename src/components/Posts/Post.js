import React, {useEffect, useRef, useState} from "react";

import PostComment from "../Comments/Comments";
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
import Report from "../Popup/Report";
import {useReactToPrint} from "react-to-print";




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
	const [openReport, setOpenReport] = useState(false)
	const [postAuthor] = useDocument(post.uid && db.collection('users').doc(post.uid))
	const author = postAuthor?.data();
	const componentRef = useRef();
	const searchInput = useRef(null)
	const [replyComment, setReplyComment] = useState(null);
	const [savePost, setSavePost] = useState(false);
	const [isFollow, setIsFollow] = useState(false);
	const [userLoggedData, setUserLoggedData] = useState({});

	const handleCloseEdit = () => {
		setOpenEdit(false);
	};
	const handleOpenEdit = () => {
		setOpenEdit(true)
	}

	const handleCloseReport = () => {
		setOpenReport(false);
		handleClose();
	};

	const handleOpenReport = () => {
		setOpenReport(true)
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

	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
	});

	const handleReplying = (data) => {
		setReplyComment(data);
		searchInput.current.focus();
		searchInput.current.scrollIntoView({
			behavior: "smooth",
			block : "center"
		})
	}

	const handleRemoveReply = () => {
		setReplyComment(null);
	}

	useEffect(() => {
		if(user){
			if(author?.follower?.includes(user.uid)){
				setIsFollow(true);
			}
			else{
				setIsFollow(false)
			}
		}
	}, [author?.follower, user])

	useEffect(() => {
		if(user){
			setUserLoggedData({
				uid: user.uid,
				photoURL: user.photoURL,
				displayName: user.displayName
			})
		}
	}, [user])

	return (
		<>
			<div className={`post`} id={id} ref={componentRef}>
				<Card className={classes.root} >
					<PostHeader
						author={author}
						handleClickOpen={handleClickOpen}
						postDate={post.timestamp}
						type={post.type}
						postFelling={post?.felling}
						tag={post?.tag}
						checkIn={post?.checkIn}
						// postTagUid={post?.tagUserUid}
						// postTagUser={post?.tagUserDisplayName}
					/>
					{/*Media*/}
					<PostContent author={author} caption={post.caption} postMedia={post?.media}/>
					{/* Post Action*/}
					<PostAction
						postId={id}
						userLogged={user}
						post={post}
						expanded={expanded}
						setExpanded={setExpanded}
						handleFocus={handleFocus}
						setSavePost={setSavePost}
					/>
					{/* Recipe data */}
					<PostRecipeData
						postId={id}
						postData={post.data}
						expanded={expanded}
						rating={post?.rating}
						handlePrint={handlePrint}
					/>
					{/* Comments */}
					<PostComment
						postId={id}
						isSinglePage={isSinglePage}
						postUid={post.uid}
						userLogged={user}
						commentsCount={post?.commentsCount}
						handleReplying={handleReplying}
					/>
					{/* Comments input */}
					<CommentInput
						postAuthor={post.uid}
						user={user}
						postId={id}
						type={post.type}
						refInput={searchInput}
						replyComment={replyComment}
						handleRemoveReply={handleRemoveReply}
					/>

				</Card>
				{
					user && open ? (
						<PostUtil
							open={open}
							handleClose={handleClose}
							handleOpenEdit={handleOpenEdit}
							uid={user.uid} opponentID={post.uid}
							postID={id} handleReport={handleOpenReport}
							isFollow={isFollow} savePost={savePost}
							setOpenSnack={setOpenSnack}
							userLoggedData={userLoggedData}/>
					) : null
				}
				{
					openEdit ? (
						<EditPost
							open={openEdit}
							handleClose={handleCloseEdit}
							post={post} postId={id}
							setOpenSnack={setOpenSnack}
						/>
					) : null
				}

				{
					openReport ? (
						<Report open={openReport} handleClose={handleCloseReport} postId={id} userLogged={user} setOpenSnack={setOpenSnack}/>
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
								Successfully !
							</Alert>
						</Snackbar>
					) : null
				}
			</div>

		</>
	)
}

export default Post;