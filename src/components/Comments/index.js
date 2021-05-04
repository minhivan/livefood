import React, {useEffect, useState} from "react";
import PostComment from "./CommentDetails";
import {db} from "../../firebase";

function Comment({id}){
    const [comments, setComments] = useState([])

    useEffect(() => {
        const unsubscribe = db.collection("posts").doc(id)
            .collection("comments")
        	.orderBy('timestamp', "desc")
			.limit(5)
        	.onSnapshot((snapshot ) => {
				// var temp = []
				// snapshot.forEach(data => {
				// 	var userProfile = {};
				// 	data.data().user.get().then( author => {
				// 		Object.assign(userProfile, author.data());
				// 	})
				// 	temp.push({id: data.id, comment: data.data(), cmtAuthor: userProfile })
				// })
				// setComments(temp);

        		// // var userProfile = {};
        		setComments(
        			snapshot.docs.map((doc => ({
        				id: doc.id,
        				comment: doc.data(),
        				cmtAuthor: doc.data().user.get().then( cmtAuthor => {
        					return cmtAuthor.data();
        				})
        			})))
        		);
        	})
		return () => {
        	unsubscribe();
		}
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