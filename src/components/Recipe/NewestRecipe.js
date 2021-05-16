import React from "react";
import {Link} from "react-router-dom";
import FavoriteRoundedIcon from "@material-ui/icons/FavoriteRounded";
import AccessTimeRoundedIcon from "@material-ui/icons/AccessTimeRounded";

export default function NewestRecipe({id, post, postAuthor}){
    return (
        <div key={id} className="recipe-double">
            <div className="recipe-inner">
                <div className="recipe-inner-wrap">
                    <Link to={`/p/${id}`} className='text-link'>
                        <img
                            src={post?.media[0]?.mediaPath} alt=""/>
                    </Link>
                </div>
                <div className="tile-content">
                    <div className="details">
                        <h2 className="title" title={post?.caption}>
                            <Link to={`/p/${id}`}>{post?.caption}</Link>
                        </h2>
                        <div className="recipe-data">
                            <div className="author"><span className="name">By <Link to={`/profile/${post?.uid}`}>{postAuthor?.displayName}</Link></span></div>
                            <div className="meta-data">
                                <div className="fd-rating">
                                    <span><FavoriteRoundedIcon style={{color: "red", marginRight: 5}}/>{post?.likeBy?.length}</span></div>
                                <div className="cook-time">
                                    <span style={{marginLeft: 5}}><AccessTimeRoundedIcon style={{color: "black", marginRight: 5, textTransform: "lowercase"}}/>{post?.data?.cookTime} {post?.data?.cookUnit}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}