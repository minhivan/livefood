import React, {useEffect} from "react";
import Page from "../../components/Page";
import PeopleSuggested from "../../components/Explore/ExplorePeopleItem";
import NavBar from "../../components/SideBar/LeftSideBar";

const ExplorePeople = (props) => {

    useEffect(() => {
        window.scroll({top: 0, left: 0, behavior: 'smooth' });
    }, []);


    return (
        <Page
            title="Explore | LiveFood"
            className="app__bodyContainer"
        >
            <div className="explore__root">
                <NavBar userLogged={props.userLogged}/>
                <PeopleSuggested userLogged={props.userLogged}/>
            </div>

        </Page>
    )
}

export default ExplorePeople;