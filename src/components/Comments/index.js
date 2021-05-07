import React, {useEffect, useState} from "react";
import PostComment from "./CommentDetails";
import {db} from "../../firebase";
import {Link} from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import AddCircleTwoToneIcon from '@material-ui/icons/AddCircleTwoTone';

function Comment({postId, isSinglePage, isPopup, postUid, userLogged}){
    const [comments, setComments] = useState([])
	const [limit] = useState(5);
	const [lastIdx, setLastIdx] = useState(5);

    useEffect(() => {
        const unsubscribe = db.collection("posts").doc(postId)
            .collection("comments")
        	.orderBy('timestamp', "desc")
			.limit(15)
        	.onSnapshot((snapshot ) => {
				setComments(
        			snapshot.docs.map((doc => ({
        				id: doc.id,
        				comment: doc.data(),
        			})))
        		);
        	})

		return () => {
        	unsubscribe();
		}
    }, [postId, limit])


	const handleClickSeeMore = () => {
		setLastIdx(lastIdx => lastIdx + 5);
	}

    return(
        <div className="listComments">

			{
				!isSinglePage && !isPopup ? (
					<>
						{
							comments.length > 3 && (
								<p className="comment__see-more">
									<Link to={`/p/${postId}`}>View more comments ?</Link>
								</p>
							)
						}

						{
							comments.slice(0,3).map(({id, comment}) => (
								<PostComment
									key={id}
									comment={comment}
									commentId={id}
									postId={postId}
									postUid={postUid}
									userLogged={userLogged}
								/>
							))
						}
					</>
				) : (
					<>
						{
							comments.slice(0,lastIdx).map(({id, comment}) => (
								<PostComment
									key={id}
									comment={comment}
									commentId={id}
									isPopup={isPopup}
									postId={postId}
									postUid={postUid}
									userLogged={userLogged}
								/>
							))
						}
						<div className="comment__see-more-btn">
							<IconButton aria-label="see more" onClick={handleClickSeeMore}>
								<AddCircleTwoToneIcon />
							</IconButton>
						</div>
					</>
				)
			}

        </div>
    )
}

export default Comment