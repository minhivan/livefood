import React from "react";
import {CardContent, Collapse} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import {makeStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {Rating} from "@material-ui/lab";
import LocalPrintshopRoundedIcon from '@material-ui/icons/LocalPrintshopRounded';
import {Link} from "react-router-dom";


const useStyles = makeStyles((theme) => ({

    paragraph: {
        lineHeight: "26px",
        textAlign: "justify",
        whiteSpace: "pre-line",
        fontSize: "14px"
    },
    paragraphHead: {
        fontWeight: "600",
        fontSize: "1rem",
        marginBottom: "10px",
        padding: "5px 0",
        textTransform: "uppercase",
        borderBottom : "1px solid #000"
    }
}));


export default function PostRecipeData({postId, postData, expanded, rating}){
    const classes = useStyles();

    return(
        <>
            {
                !!postData ? (
                    <Collapse in={expanded} timeout="auto" unmountOnExit >
                        <div className="recipe_layout">
                            <CardContent className="recipe_layout__content-left">
                                {
                                    rating ? (
                                        <Typography paragraph className={classes.paragraphHead} style={{display: "flex", lineHeight: "30px"}}>Rating:
                                            <Rating style={{marginLeft: "5px"}} name="read-only" value={rating} precision={0.1} readOnly />
                                        </Typography>
                                    ) : null
                                }

                                <div className="recipe_layout__facts">
                                    <div className="recipe-facts__info">
                                        <div className="recipe-facts__details recipe-facts__prepare"><span
                                            className="recipe-facts__title">Prepare:</span> <span>{postData?.prepTime} {postData?.prepUnit}</span></div>
                                        <div className="recipe-facts__details recipe-facts__cooking"><span
                                            className="recipe-facts__title">Cook:</span> <a
                                            className="theme-color">{postData?.cookTime} {postData?.cookUnit}</a></div>
                                    </div>
                                    <div className="recipe-facts__info">
                                        <div className="recipe-facts__details recipe-facts__servings"><span
                                            className="recipe-facts__title">Serves:</span> <a
                                            className="theme-color">{postData?.serve}</a></div>
                                    </div>
                                </div>
                                <Typography paragraph className={classes.paragraphHead} >Category: <Link style={{textDecoration: "underline"}} to={`/recipe/topic/${postData?.category?.toLowerCase()}`}>{postData?.category}</Link></Typography>
                                <Typography paragraph className={classes.paragraphHead}>Ingredients:</Typography>
                                <Typography paragraph className={classes.paragraph}>{postData?.ingredient}</Typography>
                            </CardContent>
                            <CardContent className="recipe_layout__content-right">
                                <Typography paragraph className={classes.paragraphHead}>Direction:</Typography>
                                <Typography paragraph className={classes.paragraph}>{postData?.direction}</Typography>
                                <Typography
                                    paragraph
                                    className={classes.paragraphHead}
                                    style={{display: "flex", gap: "5px"}}
                                >
                                    <LocalPrintshopRoundedIcon />Print Recipe
                                </Typography>
                            </CardContent>
                        </div>
                        <Divider />
                    </Collapse>
                ) : null
            }
        </>
    )
}


PostRecipeData.propTypes = {
    postId: PropTypes.string,
    postData: PropTypes.object,
    expanded: PropTypes.bool,
    rating: PropTypes.number
};