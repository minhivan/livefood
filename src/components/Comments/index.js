import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {red} from "@material-ui/core/colors";
import PostComment from "./Comment";

const useStyles = makeStyles((theme) => ({

    displayCmt: {
        padding: "10px 20px",
        textAlign: "right",
        color: "#8e8e8e"
    }

}));


function Comment(props){
    const classes = useStyles();
    let count = 0;

    props.comments.map((comment) => {
        return count++
    })

    return(
        <div className="listComments">
            {
                count > 0 && (
                    <h5 className={classes.displayCmt}>Displaying {count} comments</h5>
                )
            }
            {
                props.comments.slice(0, 5).map(({id, comment, cmtAuthor}) => (
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