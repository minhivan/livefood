import React, {useEffect, useState} from "react";
import PostComment from "./CommentDetails";
import {db} from "../../firebase";

function Comment({id}){
    const [comments, setComments] = useState([])

    useEffect(() => {
        return db.collection("posts").doc(id)
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

    }, [id])

    return(
        <div className="listComments">
            {
                comments.map(({id, comment, cmtAuthor}) => (
                    <PostComment
                        key={id}
                        comment={comment}
                        cmtAuthor={cmtAuthor}
                    />
                ))
            }
        </div>
    )
}

export default Comment