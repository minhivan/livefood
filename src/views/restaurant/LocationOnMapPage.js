import React, {useEffect, useState} from "react";
import NavBar from "../../components/SideBar/LeftSideBar";
import Page from "../../components/Page";
import {db} from "../../firebase";
import FormControl from "@material-ui/core/FormControl";
import {InputLabel, MenuItem, Select} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {MapPin as MapPinIcon} from "react-feather";
import {Link} from "react-router-dom";
// import {Rating} from "@material-ui/lab";
// import FavoriteRoundedIcon from "@material-ui/icons/FavoriteRounded";
// import AccessTimeRoundedIcon from "@material-ui/icons/AccessTimeRounded";
// import {handleUserFollow, handleUserUnfollow} from "../../hooks/services";
import Button from "@material-ui/core/Button";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {Icon} from "leaflet";
import Avatar from "@material-ui/core/Avatar";
// import LocationOnRoundedIcon from "@material-ui/icons/LocationOnRounded";
import "leaflet/dist/leaflet.css"
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import vnProvince from "../../province.json";

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
    },
    shopCard: {
        display: "flex",
        alignItems: "center",
        gap: "10px"
    },
    avatar: {
        height: 60,
        width: 60,
    },
    shopName: {
        color: "#65676B",
        fontWeight: "bold"
    },

}));


export default function LocationOnMapPage(props){
    const {userLogged} = props;
    const classes = useStyles();
    const [listRestaurantCate, setListRestaurantCate] = useState([]);
    const [restaurantCate, setRestaurantCate] = useState('');
    const [userProvince, setUserProvince] = useState("");
    const [province, setProvince] = useState([]);
    const [listRestaurant, setListRestaurant] = useState([]);
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');



    useEffect(() => {
        setProvince(vnProvince.province);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                setLat(position.coords.latitude);
                setLng(position.coords.longitude);
            });
        }

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
                            data: {
                                aboutRestaurant: doc.data().aboutRestaurant,
                                displayName: doc.data().displayName,
                                photoURL: doc.data().photoURL,
                                uid: doc.data().uid,
                                follower: doc.data().follower,
                            },
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
                            data: {
                                aboutRestaurant: doc.data().aboutRestaurant,
                                displayName: doc.data().displayName,
                                photoURL: doc.data().photoURL,
                                uid: doc.data().uid,
                                follower: doc.data().follower,
                            },
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
                            data: {
                                aboutRestaurant: doc.data().aboutRestaurant,
                                displayName: doc.data().displayName,
                                photoURL: doc.data().photoURL,
                                uid: doc.data().uid,
                                follower: doc.data().follower,
                            },
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
                                displayName: doc.data().displayName,
                                photoURL: doc.data().photoURL,
                                uid: doc.data().uid,
                                follower: doc.data().follower,
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
                    <Link to={`/location/`}>
                        <Button variant="outlined" className={classes.buttonLink} style={{textTransform: "capitalize", fontSize: "1rem"}}>
                            Turn Back
                        </Button>
                    </Link>
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
                                    <option key={doc.idProvince} value={doc.idProvince}>{doc.name}</option>
                                ))
                            }
                        </Select>
                    </FormControl>
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
                </div>

                {
                    listRestaurant.length > 0 ? (
                        <div className="list-users__location-container">
                            {
                                lat && lng ? (
                                    <div className="profile__about-map">
                                        <MapContainer
                                            center={[lat, lng]}
                                            zoom={16}
                                            scrollWheelZoom={true}
                                            dragging={true}
                                        >

                                            <TileLayer
                                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <Marker
                                                position={[lat, lng]}
                                                icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}
                                            >
                                                <Popup>
                                                    {
                                                        userLogged ? (
                                                            <div className={classes.shopCard}>
                                                                <Avatar className={classes.avatar} alt={userLogged.displayName} src={userLogged.photoURL}/>
                                                                <span className={classes.shopName}>You are here</span>
                                                            </div>
                                                        ) : (
                                                            <div className={classes.shopCard}>
                                                                <span className={classes.shopName}>You are here</span>
                                                            </div>
                                                        )
                                                    }

                                                </Popup>
                                            </Marker>
                                            {
                                                listRestaurant.map(({id, data}) => (
                                                    data.aboutRestaurant.geolocation ? (
                                                        <Marker
                                                            key={id}
                                                            position={[data.aboutRestaurant?.geolocation?.lat, data.aboutRestaurant?.geolocation?.lng]}
                                                            icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}
                                                        >
                                                            <Popup>
                                                                <div className={classes.shopCard}>
                                                                    <Avatar className={classes.avatar} alt={data?.displayName} src={data?.photoURL}/>
                                                                    <Link to={`/profile/dishes/${data?.uid}`}><span className={classes.shopName}>{data?.displayName}</span></Link>
                                                                </div>
                                                            </Popup>
                                                        </Marker>
                                                    ) : null
                                                ))
                                            }
                                        </MapContainer>
                                    </div>
                                ) : (
                                    <div className={classes.wrapper}>
                                        <div className={classes.none}>
                                            <MapPinIcon
                                                className={classes.icon}
                                                size="40"
                                            />
                                        </div>
                                        <h2 style={{paddingTop: "10px"}}>Not found</h2>
                                    </div>
                                )
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
