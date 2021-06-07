import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {MapPin as MapPinIcon} from "react-feather";
// import {MapContainer, TileLayer} from "react-leaflet";
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import "leaflet/dist/leaflet.css"

import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'
import Avatar from "@material-ui/core/Avatar";
import RoutingLeaflet from "../../../hooks/RoutingLeaflet";

const useStyles = makeStyles((theme) => ({
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
    },
    container: {
        display: "grid",
        gridTemplateColumns: "repeat(1, 1fr)",
        borderRadius: "16px",
        overflow: "hidden",
        width: '100%',
        backgroundColor: theme.palette.background.paper,

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




export default function ProfileAbout(props){
    const classes = useStyles();
    const {userSnapshot} = props;
    const [destination, setDestination] = useState({
        lat: 0,
        lng: 0
    });
    const [userLocation, setUserLocation] = useState({
        lat: 0,
        lng: 0
    });

    useEffect(() => {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {

                setUserLocation({lat: position.coords.latitude,  lng: position.coords.longitude });
            });
        }

    }, []);


    useEffect(() => {
        setDestination({...destination, lat: userSnapshot?.aboutRestaurant?.geolocation?.lat ?? 0,  lng: userSnapshot?.aboutRestaurant?.geolocation?.lng ?? 0 });
    }, [userSnapshot]);

    // console.log(lat, lng)

    return (
        <div className="explore__root" style={{paddingTop: "30px"}}>
            <div className={classes.container}>
                {
                    destination.lng !== 0 && destination.lat !== 0 ? (
                        <div className="profile__about-map">
                            <MapContainer
                                center={[destination.lat, destination.lng]}
                                zoom={16}
                                scrollWheelZoom={true}
                                dragging={true}
                            >

                                <TileLayer
                                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                {
                                    userLocation && userLocation?.lng !== 0 && userLocation?.lat !== 0 ? (
                                        <RoutingLeaflet userLocation={userLocation} destination={destination}/>
                                    ) : (
                                        <Marker
                                            position={destination}
                                            icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}
                                        >
                                            <Popup>
                                                <div className={classes.shopCard}>
                                                    <Avatar className={classes.avatar} alt={userSnapshot?.displayName} src={userSnapshot?.photoURL}/>
                                                    <span className={classes.shopName}>{userSnapshot?.displayName}</span>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    )
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
        </div>
    )
}