import React, {useEffect, useState} from "react";
import Page from "../../components/Page";
import Divider from "@material-ui/core/Divider";
import {db} from "../../firebase";
import {makeStyles} from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import ListRecipe from "../../components/Recipe/ListRecipe";
import {Image as CameraIcon} from "react-feather";


const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    rating: {
        display: "flex",
        alignItems: "center",
        width: "100%"
    },
    icon: {
        color: "#050505"
    },
    wrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        maxHeight: "300px",
        width: "100%"
    },
    none: {
        width: "100px",
        height: "100px",
        borderColor: "#262626",
        borderWidth: "2px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderStyle: "solid",
        borderRadius: "50%",
        margin: "50px 0 20px 0"
    },
}));


const TrendingPage = (props) => {
    const classes = useStyles();
    const [listRecipe, setListRecipe] = useState([]);

    useEffect( () => {
        // Set all post
        return db.collection('posts')
            .where('type', '==', 'recipe')
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
                                <div className="list-recipe-grid" style={{gridGap: "24px"}}>
                                    {
                                        listRecipe.map(({id, post, postAuthor}) => (
                                            <ListRecipe key={id} id={id} postAuthor={postAuthor} post={post}/>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // <Backdrop className={classes.backdrop} open={true} >
                    //     <CircularProgress color="inherit" />
                    // </Backdrop>
                    <div className={classes.wrapper}>
                        <div className={classes.none}>
                            <CameraIcon
                                className={classes.icon}
                                size="40"
                            />
                        </div>
                        <h2 style={{paddingBottom: "10px"}}>No Recipe Found</h2>
                    </div>
                )
            }

        </Page>
    )
}

export default TrendingPage;