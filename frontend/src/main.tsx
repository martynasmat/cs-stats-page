import { LocationProvider, Router, Route } from "preact-iso";
import { NotFound } from "./pages/_404.jsx";
import Home from "./pages/home/index";
import Profile from "./pages/profile/index.js";
import Id from "./pages/id/index.js";

export function App() {
    return (
        <LocationProvider>
            <Router>
                <Route path="/" component={Home} />
                <Route path="/profiles/:id" component={Profile} />
                <Route path="/id/:vanity" component={Id} />
                <Route default component={NotFound} />
            </Router>
        </LocationProvider>
    );
}
