import React, {useEffect, useState} from "react";
import NavBar from "../../components/SideBar/LeftSideBar";
import Page from "../../components/Page";
import {db} from "../../firebase";
import FormControl from "@material-ui/core/FormControl";
import {InputLabel, MenuItem, Select} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {MapPin as MapPinIcon} from "react-feather";
import {Link} from "react-router-dom";
import {Rating} from "@material-ui/lab";
import FavoriteRoundedIcon from "@material-ui/icons/FavoriteRounded";
import AccessTimeRoundedIcon from "@material-ui/icons/AccessTimeRounded";
import {handleUserFollow, handleUserUnfollow} from "../../hooks/services";
import Button from "@material-ui/core/Button";
import LocationOnRoundedIcon from "@material-ui/icons/LocationOnRounded";


const useStyles = makeStyles((theme) => ({
    formControl: {
        minWidth: 220,
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
    button: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "150px",
        color: "white",
        width: "100%",
        backgroundColor: "#0095f6",
        "&:hover": {
            backgroundColor: "#0186db",
        },
        textTransform: "capitalize",
        margin: "auto"
    },
    buttonUnfollow: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "150px",
        width: "100%",
        color: "#454444",
        // "&:hover": {
        //     backgroundColor: "#c3d6fa",
        // },
        margin: "auto",
        textTransform: "capitalize"
    },
    buttonLink: {
        height: 56,
        minWidth: 220,
    }
}));


export default function LocationPage(props){
    const {userLogged} = props;
    const classes = useStyles();
    const [listRestaurantCate, setListRestaurantCate] = useState([]);
    const [restaurantCate, setRestaurantCate] = useState('');
    const [userProvince, setUserProvince] = useState("");
    const [province, setProvince] = useState([]);
    const [listRestaurant, setListRestaurant] = useState([]);
    const [userLoggedData, setUserLoggedData] = useState({});

    useEffect(() => {
        if(userLogged){
            setUserLoggedData({
                uid: userLogged.uid,
                photoURL: userLogged.photoURL,
                displayName: userLogged.displayName
            })
        }
    }, [userLogged])

    useEffect(() => {
        fetch('https://vapi.vnappmob.com/api/province/')
            .then(res => res.json()).then(res => {
            if (res.results && res.results.length > 0) {
                setProvince(res.results)
            }
        });

    }, []);


    useEffect(() => {
        const userRef = db.collection('users');
        if(restaurantCate){
            if(userProvince){
                return userRef
                    .where('accountType', '==', 'foodshop')
                    .where('aboutRestaurant.modelId', '==', restaurantCate)
                    .where('aboutRestaurant.locationId', '==', userProvince)
                    .limit(20)
                    .onSnapshot( snapshot => {
                        setListRestaurant(snapshot.docs.map(doc => ({
                            id: doc.id,
                            data: doc.data(),
                        })));
                    })
            }
            else
                return userRef
                    .where('accountType', '==', 'foodshop')
                    .where('aboutRestaurant.modelId', '==', restaurantCate)
                    .limit(20)
                    .onSnapshot( snapshot => {
                        setListRestaurant(snapshot.docs.map(doc => ({
                            id: doc.id,
                            data: doc.data(),
                        })));
                    })
        }
        else{
            if(userProvince){
                return userRef
                    .where('accountType', '==', 'foodshop')
                    .where('aboutRestaurant.locationId', '==', userProvince)
                    .limit(20)
                    .onSnapshot( snapshot => {
                        setListRestaurant(snapshot.docs.map(doc => ({
                            id: doc.id,
                            data: doc.data(),
                        })));
                    })
            }
            else
                return userRef
                    .where('accountType', '==', 'foodshop')
                    .limit(20)
                    .onSnapshot( snapshot => {
                        setListRestaurant(snapshot.docs.map(doc => ({
                            id: doc.id,
                            data: {
                                aboutRestaurant: doc.data().aboutRestaurant,
                                photoURL: doc.data().photoURL,
                                follower: doc.data().follower,
                                uid: doc.data().uid,
                                displayName: doc.data().displayName
                            },
                        })));
                    })
        }
    }, [restaurantCate, userProvince])


    useEffect(() => {
        return db.collection('restaurantCategory')
            .orderBy('title', 'asc')
            .limit(20)
            .get().then( snapshot => {
                setListRestaurantCate(snapshot.docs.map(doc => ({
                    id: doc.id,
                    title: doc.data().title,
                })));
            })
    }, [])

    return (
        <Page
            title="LiveFood"
            className="app__bodyContainer"
        >
            <NavBar userLogged={userLogged}/>
            <div className="list-users">
                <div className="list-users__header">
                    <Link to={`/location/map`}>
                        <Button variant="outlined" className={classes.buttonLink} style={{textTransform: "capitalize", fontSize: "1rem"}}>
                            Check on map
                        </Button>
                    </Link>
                    <FormControl variant="outlined" className={classes.formControl}>

                        <InputLabel id="restaurant_category_label">Category</InputLabel>
                        <Select
                            labelId="restaurant_category_label"
                            id="restaurant_category"
                            value={restaurantCate}
                            onChange={(event) => setRestaurantCate(event.target.value)}
                            label="Category"
                        >
                            <MenuItem value="" >
                                <em>None</em>
                            </MenuItem>
                            {
                                listRestaurantCate.map(({id, title}) => (
                                    <MenuItem key={id} value={id}>{title}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="restaurant_location_label">Location</InputLabel>
                        <Select
                            native
                            labelId="restaurant_location_label"
                            id="restaurant_location"
                            value={userProvince}
                            onChange={event => setUserProvince(event.target.value)}
                            label="Location"
                        >
                            <option aria-label="None" value="" />
                            {
                                province?.map((doc) => (
                                    <option key={doc.province_id} value={doc.province_id}>{doc.province_name}</option>
                                ))
                            }
                        </Select>
                    </FormControl>
                </div>

                {
                    listRestaurant.length > 0 ? (
                        <div className="list-users__container">
                            {
                                listRestaurant.map(({id, data}) => (
                                    <div key={id} className="list-users-item">
                                        <div className="list-users-wrap">
                                            <div className="inner-wrap" style={{height: "220px"}}>
                                                <Link to="" className='text-link'>
                                                    <img
                                                        src={data?.photoURL} alt=""/>
                                                </Link>
                                            </div>
                                            <div className="tile-content">
                                                <div className="details">
                                                    <h2 className="title" title={data?.displayName}>
                                                        <Link to={`/profile/${id}`}>{data?.displayName}</Link>
                                                        {
                                                            data?.aboutRestaurant?.location ? (
                                                                    <span className="user-location">
                                                                        {data?.aboutRestaurant?.address ?? "" }
                                                                        {" - " + data?.aboutRestaurant?.location}
                                                                    </span>
                                                            ) : null
                                                        }

                                                    </h2>
                                                    {
                                                        userLogged ? (
                                                            id === userLogged.uid ? null : (
                                                                <div className="follow-me">
                                                                    {
                                                                        data?.follower?.includes(userLogged.uid) ? (
                                                                            <Button
                                                                                variant="outlined"
                                                                                style={{textTransform: "capitalize"}}
                                                                                className={classes.buttonUnfollow}
                                                                                onClick={() => handleUserUnfollow(userLogged.uid, id)}
                                                                            >
                                                                                Unfollow
                                                                            </Button>
                                                                        ) : (
                                                                            <Button
                                                                                variant="contained"
                                                                                color="primary"
                                                                                style={{textTransform: "capitalize"}}
                                                                                className={classes.button}
                                                                                onClick={() => handleUserFollow(userLoggedData, id)}
                                                                            >
                                                                                Follow
                                                                            </Button>
                                                                        )
                                                                    }

                                                                </div>
                                                            )
                                                        ) : null
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <div className={classes.wrapper}>
                            <div className={classes.none}>
                                <MapPinIcon
                                    className={classes.icon}
                                    size="40"
                                />
                            </div>
                            <h2 style={{paddingBottom: "10px"}}>No restaurant found !</h2>
                        </div>
                    )
                }

            </div>
        </Page>
    )
}
