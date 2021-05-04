import React, {useEffect, useState} from "react";
import Page from "../../components/Page";
import {Link} from "react-router-dom";
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import AccessTimeRoundedIcon from '@material-ui/icons/AccessTimeRounded';
import Divider from "@material-ui/core/Divider";
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {db} from "../../firebase";
import {useCollection} from "react-firebase-hooks/firestore";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        width: "40%"
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const RecipePage = (props) => {
    const classes = useStyles();

    const [type, setType] = React.useState('newest');
    const [newest, setNewest] = useState([]);
    const [listRecipe, setListRecipe] = useState([]);
    const [cate] = useCollection(db.collection("category"))


    window.scroll({top: 0, left: 0, behavior: 'smooth' });



    const handleChange = (event) => {
        setType(event.target.value);
    };

    useEffect( () => {

        // Set newest
        db.collection('posts')
            .where('type', '==', 'recipe')
            .orderBy('timestamp', "desc")
            .limit(2)
            .get().then(async snapshot => {
                const track = await Promise.all(
                    snapshot.docs.map(async doc => ({
                        id: doc.id,
                        post: doc.data(),
                        postAuthor: await Promise.resolve(doc.data().user.get().then( author => {
                            return author.data();
                        }))
                    })));
                setNewest(track);
        })

        // Set all post

        if(type === 'newest'){
            db.collection('posts')
                .where('type', '==', 'recipe')
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
                    setListRecipe(tracking);
            })
        }
        else{
            db.collection('posts')
                .where('type', '==', 'recipe')
                .where('data.category', '==', type)
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
                    setListRecipe(tracking);
            })
        }

    },[type]);


    return (
        <Page
            title="Recipes | LiveFood"
            className="app__bodyContainer"
        >
            <div className="recipe__page">
                <div className="recipe__heading">
                    <h1>Recipes</h1>
                    <div className="feature-content">
                        {
                            newest.length > 0 ? (
                                (newest.map( ({id, post, postAuthor}) => (
                                    <div key={id} className="recipe-double">
                                        <div className="recipe-inner">
                                            <div className="recipe-inner-wrap">
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
                                ))
                            )) : null
                        }


                    </div>
                </div>
                <Divider />
                <div className="recipe__content">
                    <FormControl className={classes.formControl}>
                        <Select
                            style={{fontWeight: "bold", textTransform: "uppercase"}}
                            fullWidth
                            value={type}
                            onChange={handleChange}
                        >
                            <MenuItem value={'newest'} style={{fontWeight: "bold", textTransform: "uppercase"}}>Newest</MenuItem>
                            {
                                cate?.docs?.map((doc) => (
                                    <MenuItem key={doc.id} value={doc.data().title} style={{fontWeight: "bold", textTransform: "uppercase"}}>{doc.data().title}</MenuItem>
                                ))
                            }

                        </Select>
                    </FormControl>

                    <div className="list-recipe">
                        <div className="list-recipe-grid">
                            {
                                listRecipe.length > 0 ? (
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
                                                        <div className="recipe-data">
                                                            <div className="author"><span className="name">By <Link to={`/profile/${post?.uid}`}>{postAuthor?.displayName}</Link></span></div>
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
                                ) : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Page>
    )
}

export default RecipePage;