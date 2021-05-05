import React, {useEffect, useState} from "react";
import Page from "../../components/Page";
import {Link} from "react-router-dom";
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import AccessTimeRoundedIcon from '@material-ui/icons/AccessTimeRounded';
import Divider from "@material-ui/core/Divider";
import {db} from "../../firebase";
import {useParams} from "react-router";
import {makeStyles} from "@material-ui/core/styles";
import pic from "../../images/Background/undraw_page_not_found_su7k.svg";
import {
    useLocation
} from "react-router-dom";
import {Rating} from "@material-ui/lab";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
    rating: {
        display: "flex",
        alignItems: "center",
        width: "100%"
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));


const TopicPage = (props) => {
    const classes = useStyles();
    let { name } = useParams();
    const [test, setTest] = useState([]);

    window.scroll({top: 0, left: 0, behavior: 'smooth' });
    let query = new URLSearchParams(useLocation().search).get("search");

    useEffect( () => {
        if(query) {
            return db.collection('posts')
                .where('type', '==', 'recipe')
                .orderBy('timestamp', "desc")
                .limit(12)
                .get().then(async snapshot => {
                    var data = [];
                    snapshot.forEach(await function(doc) {
                        // doc.data() is never undefined for query doc snapshots
                        if(doc.data()?.captionToLowerCase?.includes(query)){
                            data.push({
                                id: doc.id,
                                post: doc.data(),
                            })
                        }
                    })
                    setTest(data);

                    // const tracking = await Promise.all(
                    //     snapshot.docs.map(async doc => ({
                    //         id: doc.id,
                    //         post: doc.data(),
                    //         postAuthor: await Promise.resolve(doc.data().user.get().then( author => {
                    //             return author.data();
                    //         }))
                    //     }))
                    // )
                    // setListRecipe(tracking);
                }).catch(error => console.log(error));
        }
        else{
            // Set all post
            return db.collection('posts')
                .where('type', '==', 'recipe')
                .where('data.category', '==', name)
                .orderBy('timestamp', "desc")
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
                    setTest(tracking);
                }).catch(error => console.log(error));
        }

    },[name]);

    console.log(test)
    return (
        <Page
            title="Topic | LiveFood"
            className="app__bodyContainer"
        >
            {
                test.length > 0 ? (
                    <div className="recipe__page">
                        <div className="recipe__heading">
                            <h1>{name}</h1>
                        </div>
                        <Divider />
                        <div className="recipe__content">
                            <div className="list-recipe">
                                <div className="list-recipe-grid">
                                    {
                                        test.map (({id, post, postAuthor}) => (
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
                                                            <div className="meta-data">
                                                                <div className="fd-rating">
                                                                    <span><FavoriteRoundedIcon style={{color: "red", marginRight: 5}}/> {post?.likeBy?.length}</span></div>
                                                                <div className="cook-time">
                                                                    <span><AccessTimeRoundedIcon style={{color: "black", marginRight: 5, textTransform: "lowercase"}}/>{post?.data?.cookTime} {post?.data?.cookUnit}</span>
                                                                </div>
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

export default TopicPage;