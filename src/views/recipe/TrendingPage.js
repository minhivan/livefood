import React, {useEffect, useState} from "react";
import Page from "../../components/Page";
import {Link} from "react-router-dom";
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import Divider from "@material-ui/core/Divider";
import {db} from "../../firebase";
import {makeStyles} from "@material-ui/core/styles";
import {Rating} from "@material-ui/lab";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";


const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    rating: {
        display: "flex",
        alignItems: "center",
        width: "100%"
    }
}));


const TrendingPage = (props) => {
    const classes = useStyles();
    const [listRecipe, setListRecipe] = useState([]);
    window.scroll({top: 0, left: 0, behavior: 'smooth' });

    useEffect( () => {
        // Set all post
        return db.collection('posts')
            .orderBy('rating', 'desc')
            .limit(12)
            .get().then(async snapshot => {
                const tracking = await Promise.all(
                    snapshot.docs.map(async doc => ({
                        id: doc.id,
                        post: doc.data(),
                        postAuthor: await Promise.resolve(doc.data().user.get().then( author => {
                            return author.data();
                        }))
                    }))
                )
                setListRecipe(tracking);
            }).catch(error => console.log(error));

    },[]);

    return (
        <Page
            title="Trending | LiveFood"
            className="app__bodyContainer"
        >
            {
                listRecipe.length > 0 ? (
                    <div className="recipe__page">
                        <div className="recipe__heading">
                            <h1>Trending</h1>
                        </div>
                        <Divider />
                        <div className="recipe__content">
                            <div className="list-recipe">
                                <div className="list-recipe-grid">
                                    {
                                        listRecipe.map(({id, post, postAuthor}) => (
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
                                                            {
                                                                post.rating ? (
                                                                    <div className={classes.rating}>
                                                                        <Rating style={{marginRight: "5px"}} name="read-only" value={post?.rating} precision={0.1} readOnly /> ({parseFloat(post?.rating).toFixed(1, 2)})
                                                                    </div>
                                                                ) : null
                                                            }

                                                            <div className="recipe-data">
                                                                <div className="author"><span className="name">By <Link to={`/profile/${post?.uid}`}>{postAuthor?.displayName}</Link></span></div>
                                                                <div className="meta-data">
                                                                    <div className="fd-rating">
                                                                        <span><FavoriteRoundedIcon style={{color: "red", marginRight: 5}}/> {post?.likeBy?.length}</span></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Backdrop className={classes.backdrop} open={true} >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                )
            }

        </Page>
    )
}

export default TrendingPage;