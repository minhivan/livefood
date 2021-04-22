import React, {useEffect} from "react";
import Page from "../components/Page";


const RecipePage = (props) => {

    useEffect(() => {
        window.scroll({top: 0, left: 0, behavior: 'smooth' });
    }, []);


    return (
        <Page
            title="Explore | LiveFood"
            className="app__bodyContainer"
        >
            <div className="recipe__page">

            </div>

        </Page>
    )
}

export default RecipePage;