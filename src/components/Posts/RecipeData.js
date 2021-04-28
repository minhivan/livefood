import React from "react";
import {CardContent, Collapse} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import {makeStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";

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


export default function PostRecipeData({postData, expanded}){
    const classes = useStyles();


    return(
        <>
            {
                !!postData ? (
                    <Collapse in={expanded} timeout="auto" unmountOnExit >
                        <div className="recipe_layout">
                            <CardContent className="recipe_layout__content-left">
                                <div className="recipe_layout__facts">
                                    <div className="recipe-facts__info">
                                        <div className="recipe-facts__details recipe-facts__prepare"><span
                                            className="recipe-facts__title">Prepare in:</span> <span>{postData?.prepTime} {postData?.prepUnit}</span></div>
                                        <div className="recipe-facts__details recipe-facts__cooking"><span
                                            className="recipe-facts__title">Cook in:</span> <a
                                            className="theme-color">{postData?.cookTime} {postData?.cookUnit}</a></div>
                                    </div>
                                    <div className="recipe-facts__info">
                                        <div className="recipe-facts__details recipe-facts__servings"><span
                                            className="recipe-facts__title">Serves:</span> <a
                                            className="theme-color">{postData?.serve}</a></div>
                                    </div>
                                </div>
                                <Typography paragraph className={classes.paragraphHead}>Ingredients:</Typography>
                                <Typography paragraph className={classes.paragraph}>{postData?.ingredient}</Typography>
                            </CardContent>
                            <CardContent className="recipe_layout__content-right">
                                <Typography paragraph className={classes.paragraphHead}>Direction:</Typography>
                                <Typography paragraph className={classes.paragraph}>{postData?.direction}</Typography>
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
    postData: PropTypes.object,
    expanded: PropTypes.bool,
};