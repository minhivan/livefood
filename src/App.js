import './App.css';
import React from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
} from "react-router-dom";

import {auth, db} from "./firebase";

import PageLogin from "./Template/PageLogin";
import PageMessenger from "./Template/PageMessenger";
import Header from "./Components/Header/Header";
import PageNotFound from "./Template/PageNotFound";
import Feed from "./Components/Feed/Feed";
import PageProfile from "./Template/PageProfile"

function App() {
	return (
		<div className="app">
			<Router>
				<Switch>
					<Route exact path="/login" component={PageLogin}/>
					<Route>
						<Header />
						<div className="app__body">
							<Switch>
								<Route exact path="/" component={Feed} />
								<Route path="/messenger" component={PageMessenger} />
								<Route path="/messenger/:id" component={PageMessenger} />
								<Route path="/profile/:id" component={PageProfile}/>
								<Route component={PageNotFound}/>
							</Switch>
						</div>
					</Route>
				</Switch>

			</Router>
		</div>

	);
}

export default App;
