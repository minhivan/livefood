import React from "react";
import {Link} from "react-router-dom";
import {Rating} from "@material-ui/lab";
import FavoriteRoundedIcon from "@material-ui/icons/FavoriteRounded";
import AccessTimeRoundedIcon from "@material-ui/icons/AccessTimeRounded";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    rating: {
        display: "flex",
        alignItems: "center",
        width: "100%"
    }
}));

export default function ListRecipe({id, post, postAuthor}){
    const classes = useStyles();

    return(
        <div key={id} className="list-recipe-item">
            <div className="list-recipe-wrap">
                <div className="inner-wrap">
                    <Link to="" className='text-link'>
                        <img
                            src={post?.mediaUrl} alt=""/>
                    </Link>
                </div>
                <div className="tile-content">
                    <div className="details">
                        <h2 className="title" title={post?.caption}>
                            <Link to={`/p/${id}`}>{post?.caption}</Link>
                        </h2>

                        <div className="recipe-data">
                            {
                                post.rating ? (
                                    <div className={classes.rating}>
                                        <Rating style={{margin: "0 5px 5px 0"}} name="read-only" value={post?.rating} precision={0.1} readOnly /> ({parseFloat(post?.rating).toFixed(1, 2)})
                                    </div>
                                ) : null
                            }
                            {
                                postAuthor?.displayName ? (
                                    <div className="author"><span className="name">By <Link to={`/profile/${post?.uid}`}>{postAuthor?.displayName}</Link></span></div>
                                ) : null
                            }
                            <div className="meta-data">
                                <div className="fd-rating">
                                    <span><FavoriteRoundedIcon style={{color: "red", marginRight: 5}}/> {post?.likeBy?.length}</span></div>
                                {
                                    post?.data?.cookTime ? (
                                        <div className="cook-time">
                                            <span style={{marginLeft: 5}}><AccessTimeRoundedIcon style={{color: "black", marginRight: 5, textTransform: "lowercase"}}/>{post?.data?.cookTime} {post?.data?.cookUnit}</span>
                                        </div>
                                    ) : null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}