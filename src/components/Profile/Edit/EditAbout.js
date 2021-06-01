import React, {useEffect, useRef, useState} from "react";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import Skeleton from "@material-ui/lab/Skeleton";
import {Link} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import {MenuItem, Select, Switch, TextField} from "@material-ui/core";
import {useDocument} from "react-firebase-hooks/firestore";
import {db} from "../../../firebase";
import {blue} from "@material-ui/core/colors";
import {MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap} from 'react-leaflet'
import "leaflet/dist/leaflet.css"

import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'
import {Autocomplete} from "@material-ui/lab";


const useStyles = makeStyles((theme) => ({
    avatar: {
        width: 100,
        height: 100,
        margin: "0 20px",
        backgroundColor: blue[100],
        color: blue[600],
    },
    avatarHolder: {
        padding: "16px 32px"
    },
    holder: {
        display: "flex",
        padding: "16px"
    },
    changePhoto: {
        color: "#0095f6",
        padding: 0,
        textTransform: "capitalize"
    },
    displayName: {
        fontSize: 18,
        fontWeight: "bold"
    },
    label: {
        flex: "0 0 25%",
        textAlign: "right",
        paddingTop: "5px"
    },
    input: {
        paddingLeft: 20,
        width: "60%",
        float: "left"
    },
    inputField: {
        width: "100%",
        padding: "0 8px",
        height: "32px",
        fontSize: "16px",
        color: "#262626",
        border: "1px solid rgba(var(--ca6,219,219,219),1)"

    },
    inputText: {
        fontSize: "16px",
        height: 100,
        padding: "6px 10px",
        resize: "vertical",
        border: "1px solid rgba(var(--ca6,219,219,219),1)",
        width: "100%"
    },
    submit: {
        display: "flex",
        justifyContent: "center",
        padding: "20px"
    },
    description: {
        padding: "10px 0"
    },
    descriptionText: {
        textOverflow: "ellipsis",
        textAlign: "justify",
        color: "#8e8e8e",
        fontSize: "12px",
    },
    shopCard: {
        display: "flex",
        alignItems: "center",
        gap: "10px"
    },
    shopAvt: {
        height: 60,
        width: 60,
    },
    shopName: {
        color: "#65676B",
        fontWeight: "bold"
    },

}));


// function LocationMarker() {
//     const [position, setPosition] = useState(null)
//     const map = useMapEvents({
//         click() {
//             map.locate()
//         },
//         locationfound(e) {
//             setPosition(e.latlng)
//             map.flyTo(e.latlng, map.getZoom())
//             console.log(position);
//         },
//     })
//
//     return position === null ? null : (
//         <Marker
//             position={position}
//             icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}
//         />
//     )
// }

function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}


export default function EditAbout(props){
    const classes = useStyles();
    const {userLogged, setOpenSnack} = props;
    const [userData] = useDocument(userLogged &&  db.collection("users").doc(userLogged.uid));

    const [bio, setBio] = useState('');
    const [opening, setOpening] = useState('')
    const [closed, setClosed] = useState('')
    const [userProvince, setUserProvince] = React.useState("");
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [province, setProvince] = useState([]);
    const [address, setAddress] = useState('');
    const [listRestaurantCate, setListRestaurantCate] = useState([]);
    const [restaurantCate, setRestaurantCate] = useState('');
    const [openLocation, setOpenLocation] = useState(false);
    const [disable, setDisable] = useState(true);
    const mapRef = useRef();

    useEffect(() => {
        setRestaurantCate(userData?.data()?.aboutRestaurant?.modelId ?? '')
        setBio(userData?.data()?.aboutRestaurant?.bio ?? '');
        setOpening(userData?.data()?.aboutRestaurant?.opening ?? '07:30')
        setClosed(userData?.data()?.aboutRestaurant?.closed ?? '21:30')
        setUserProvince(userData?.data()?.aboutRestaurant?.locationId ?? '')
        setOpenLocation(!!userData?.data()?.aboutRestaurant?.geolocation);
        setAddress(userData?.data()?.aboutRestaurant?.address ?? '');
        setLng(userData?.data()?.aboutRestaurant?.geolocation.lng ?? '');
        setLat(userData?.data()?.aboutRestaurant?.geolocation.lat ?? '');
    }, [userData]);

    useEffect(() => {
        fetch('https://vapi.vnappmob.com/api/province/')
            .then(res => res.json()).then(res => {
            if (res.results && res.results.length > 0) {
                setProvince(res.results)
            }
        });
    },[userLogged])

    const handleClickLocation = (event) => {
        setOpenLocation(event.target.checked);
        if(!userData?.data()?.aboutRestaurant?.geolocation){
            handleAutoLocation();
        }
    }


    useEffect(() => {
        return db.collection('restaurantCategory')
            .orderBy('title', 'asc')
            .get().then( snapshot => {
            setListRestaurantCate(snapshot.docs.map(doc => ({
                id: doc.id,
                title: doc.data().title,
            })));
        })
    }, [])

    useEffect(() => {
        if(closed && opening && userProvince && restaurantCate){
            setDisable(false)
        }else setDisable(true)
    }, [closed, opening, restaurantCate, userProvince])

    const handleSubmit = (event) => {
        event.preventDefault();
        db.collection("users").doc(userLogged.uid).update({
            aboutRestaurant: {
                bio: bio,
                opening: opening,
                closed: closed,
                locationId: userProvince,
                location: province.find(o => o.province_id === userProvince).province_name,
                geolocation: {
                    lat: lat,
                    lng: lng
                },
                address: address,
                modelId: restaurantCate,
                model: listRestaurantCate.find(o => o.id === restaurantCate).title
            },

        }).then(function() {
            setOpenSnack(true);
            console.log("Setting new data !");
        });

    }

    const handleChangeOpening = (data) => {
        setOpening(data);
    }

    const handleChangeClosed = (data) => {
        setClosed(data);
    }

    // const handleClickMap = (e) => {
    //     const { lat, lng } = e.latlng;
    //     console.log(lat, lng);
    // }

    const handleAutoLocation = () => {
        // navigator.permissions.query({name:'geolocation'}).then(function(result) {
        //     if (result.state === 'granted') {
        //
        //     } else if (result.state === 'prompt') {
        //         alert("Please turn on location from your browser !!! ");
        //     }
        // });
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                setLat(position.coords.latitude);
                setLng(position.coords.longitude);
            });
        }
    }


    return (
        <article className="edit_account__content">
            <div className={classes.profile}>
                <CardHeader
                    className={classes.avatarHolder}
                    avatar={
                        userLogged?.uid ? (
                            <Avatar className={classes.avatar} alt={userLogged.displayName} src={userLogged.photoURL}/>
                        ):(
                            <Skeleton animation="wave" variant="circle" width={40} height={40} />
                        )
                    }
                    title={
                        userLogged?.uid ? (
                            <Link to={`/profile/${userLogged.uid}`} className={classes.displayName}>{userLogged.displayName}</Link>
                        ) : (
                            <Skeleton animation="wave" height={10} width="30%" style={{ marginBottom: 6 }} />
                        )
                    }
                />
                <Divider />
                <form method="POST" onSubmit={event => event.preventDefault()}>
                    <div className={classes.holder}>
                        <aside className={classes.label}>
                            <label htmlFor="pepBio" style={{fontWeight: "bold", fontSize: "18px"}}>Business model
                            </label>
                        </aside>
                        <div className={classes.input}>
                            <Select
                                style={{minWidth: "200px"}}
                                labelId="restaurant_category_label"
                                id="restaurant_category"
                                value={restaurantCate}
                                onChange={(event) => setRestaurantCate(event.target.value)}
                                label="Category"
                            >
                                <MenuItem value="" disabled>
                                    <em>None</em>
                                </MenuItem>
                                {
                                    listRestaurantCate.map(({id, title}) => (
                                        <MenuItem key={id} value={id}>{title}</MenuItem>
                                    ))
                                }
                            </Select>
                        </div>
                    </div>

                    <div className={classes.holder}>
                        <aside className={classes.label}>
                            <label htmlFor="pepBio" style={{fontWeight: "bold", fontSize: "18px"}}>Bio</label>
                        </aside>
                        <div className={classes.input}>
                            <textarea
                                value={bio}
                                onChange={event => setBio(event.target.value)}
                                className={classes.inputText}
                                id="pepBio"
                            />

                            <div className={classes.description}>
                                <span className={classes.descriptionText}>Provide your personal information, even if the account is used for a business, a pet or something else. This won't be a part of your public profile.</span>
                            </div>
                        </div>
                    </div>

                    <div className={classes.holder}>
                        <aside className={classes.label}>
                            <label htmlFor="pepOpening" style={{fontWeight: "bold", fontSize: "18px"}}>Opening</label>
                        </aside>
                        <div className={classes.input}>
                            <TextField
                                id="pepOpening"
                                type="time"
                                value={opening}
                                onChange={event => handleChangeOpening(event.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    step: 300, // 5 min
                                }}
                            />

                            <div className={classes.description}>
                                <span className={classes.descriptionText}>Provide your opening hour</span>
                            </div>
                        </div>
                    </div>

                    <div className={classes.holder}>
                        <aside className={classes.label}>
                            <label htmlFor="pepClosed" style={{fontWeight: "bold", fontSize: "18px"}}>Closed</label>
                        </aside>
                        <div className={classes.input}>
                            <TextField
                                id="pepClosed"
                                type="time"
                                value={closed}
                                onChange={event => handleChangeClosed(event.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    step: 300, // 5 min
                                }}
                            />

                            <div className={classes.description}>
                                <span className={classes.descriptionText}>Provide your closed hour </span>
                            </div>
                        </div>
                    </div>

                    <div className={classes.holder}>
                        <aside className={classes.label}>
                            <label htmlFor="pepLocation" style={{fontWeight: "bold", fontSize: "18px"}}>Location</label>
                        </aside>
                        <div className={classes.input}>
                            {/*<Autocomplete*/}
                            {/*    fullWidth*/}
                            {/*    autoHighlight*/}
                            {/*    options={province}*/}
                            {/*    getOptionLabel={(option) => option.province_name}*/}
                            {/*    value={province.find(option => option.province_id === userProvince)}*/}
                            {/*    onChange={(event, newValue) => {*/}
                            {/*        handleChangeProvince(newValue);*/}
                            {/*    }}*/}
                            {/*    renderInput={(params) => <TextField {...params} />}*/}
                            {/*/>*/}

                            <Select
                                style={{minWidth: "200px"}}
                                native
                                id="pepLocation"
                                value={userProvince}
                                onChange={event => setUserProvince(event.target.value)}
                            >
                                <option aria-label="None" value="" disabled/>
                                {
                                    province?.map((doc) => (
                                        <option key={doc.province_id} value={doc.province_id}>{doc.province_name}</option>
                                    ))
                                }
                            </Select>
                        </div>
                    </div>

                    <div className={classes.holder}>
                        <aside className={classes.label}>
                            <label htmlFor="pepAddress" style={{fontWeight: "bold", fontSize: "18px"}}>Address</label>
                        </aside>
                        <div className={classes.input}>
                            <input
                                value={address}
                                onChange={event => setAddress(event.target.value)}
                                className={classes.inputField}
                                id="pepAddress" placeholder="Ex: 400/8B Ung Văn Khiêm, Phường 25" type="text"
                            />
                        </div>
                    </div>

                    <div className={classes.holder}>
                        <aside className={classes.label}>
                            <label style={{fontWeight: "bold", fontSize: "18px"}}>Current Location</label>
                        </aside>
                        <div className={classes.input}>
                            <Switch
                                checked={openLocation}
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                onChange={handleClickLocation}
                            />
                            <span> - Or - </span>
                            <Button variant="contained" color="primary" style={{marginLeft: "10px", textTransform: "capitalize"}} onClick={handleAutoLocation}>Update new location</Button>

                        </div>
                    </div>
                    {
                        lat && lng ? (
                            <div className="about__map">
                                <MapContainer
                                    center={[lat, lng]}
                                    zoom={16}
                                    scrollWheelZoom={true}
                                    dragging={true}
                                    innerRef={mapRef}
                                >
                                    <ChangeView center={[lat, lng]} zoom={16} />
                                    <TileLayer
                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    {/*<LocationMarker />*/}
                                    <Marker
                                        position={[lat, lng]}
                                        icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}
                                    >
                                        <Popup>
                                            <div className={classes.shopCard}>
                                                <Avatar className={classes.shopAvt} alt={userLogged?.displayName} src={userLogged?.photoURL}/>
                                                <span className={classes.shopName}>{userLogged?.displayName}</span>
                                            </div>
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                        ) : null
                    }

                    <div className={classes.submit}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit} style={{textTransform: "capitalize"}}
                            disabled={disable}
                        >Update
                        </Button>
                    </div>
                </form>
            </div>
        </article>
    )
}