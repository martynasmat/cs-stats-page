import { LocationProvider, Router, Route } from "preact-iso";
import { NotFound } from "./pages/_404.jsx";
import Home from "./pages/home/index";
import Profile from "./pages/profile/index.js";
import Id from "./pages/id/index.js";
import Matchroom from "./pages/matchroom/index"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            retry: false,
            refetchOnWindowFocus: false,
        },
    },
});

export function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <LocationProvider>
                <Router>
                    <Route path="/" component={Home} />
                    <Route path="/profiles/:id" component={Profile} />
                    <Route path="/id/:vanity" component={Id} />
                    <Route path="/match/:id" component={Matchroom} />
                    <Route default component={NotFound} />
                </Router>
            </LocationProvider>
        </QueryClientProvider>
    );
}
