import React, {useEffect, useState} from "react";
import ReplyCommentDetails from "./ReplyCommentDetails";
import {db} from "../../firebase";
import PostComment from "./CommentDetails";

export default function ReplyComment(props) {

    const {userLogged, postId, commentId} = props
    const [subComments, setSubComments] = useState([]);
    useEffect(() => {
        const unsubscribe = db.collection("posts").doc(postId)
            .collection("comments").doc(commentId).collection("reply")
            .orderBy('timestamp', "desc")
            .onSnapshot((snapshot ) => {
                setSubComments(
                    snapshot.docs.map((doc => ({
                        id: doc.id,
                        comment: doc.data(),
                    })))
                );
            })

        return () => {
            unsubscribe();
        }
    }, [commentId, postId])

    return(
        <>
            {
                subComments ? (
                    subComments.map(({id, comment}) => (
                        <ReplyCommentDetails key={id} replyId={id} userLogged={userLogged} data={comment}/>
                ))
                ) : null
            }
        </>
    )
}