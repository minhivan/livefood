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
import {Camera as CameraIcon} from "react-feather";
import {Rating} from "@material-ui/lab";
import ListRecipe from "../../components/Recipe/ListRecipe";
import NewestRecipe from "../../components/Recipe/NewestRecipe";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        width: "40%"
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
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
    rating: {
        display: "flex",
        alignItems: "center",
        width: "100%"
    }
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
                .where('data.category', '==', type.toLowerCase())
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
                                    <NewestRecipe key={id} id={id} post={post} postAuthor={postAuthor}/>
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
                            {
                                listRecipe.length > 0 ? (
                                    <div className="list-recipe-grid" style={{gridGap: "24px"}}>
                                        {
                                            listRecipe.map(({id, post, postAuthor}) => (
                                                <ListRecipe key={id} id={id} post={post} postAuthor={postAuthor}/>
                                            ))
                                        }
                                    </div>
                                ) : (
                                    <div className={classes.wrapper}>
                                        <div className={classes.none}>
                                            <CameraIcon
                                                className={classes.icon}
                                                size="40"
                                            />
                                        </div>
                                        <h2 style={{paddingBottom: "10px"}}>No Posts Found</h2>
                                    </div>
                                )
                            }
                    </div>
                </div>
            </div>
        </Page>
    )
}

export default RecipePage;