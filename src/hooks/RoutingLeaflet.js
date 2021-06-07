import L, {Icon} from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import markerIconPng from "leaflet/dist/images/marker-icon.png"

const createRoutineMachineLayer = ({userLocation, destination}) => {

    const instance = L.Routing.control({
        waypoints: [
            L.latLng(userLocation.lat, userLocation.lng),
            L.latLng(destination.lat, destination.lng),
        ],
        lineOptions: {
            styles: [{ color: "#6FA1EC", weight: 4 }]
        },
        createMarker: function (i: number, waypoint: any, n: number) {
            const marker = L.marker(waypoint.latLng, {
                draggable: true,
                bounceOnAdd: false,
                icon: L.icon({
                    iconUrl: markerIconPng,
                    iconSize: [25, 41],
                    iconAnchor: [12, 41]
                })
            });
            return marker;
        }
    });

    return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;