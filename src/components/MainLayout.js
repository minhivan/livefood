import React from "react";
import { Outlet } from 'react-router-dom';
import LayoutAppBar from "./Header";
import Widget from 'rasa-webchat';

// function CustomWidget() {
//     return (
//         <Widget
//             initPayload={"/greet"}
//             socketUrl="http://localhost:5005"
//             customData={{"language": "vi"}} // arbitrary custom data. Stay minimal as this will be added to the socket
//             title={"Livefood"}
//         />
//     )
// }

const MainLayout = (props) => {
    return (
        <div className="app">
            <LayoutAppBar/>
            <div className="app__body">
                <Outlet />
            </div>
            {/*<CustomWidget />*/}
        </div>
    );
};

export default MainLayout;
