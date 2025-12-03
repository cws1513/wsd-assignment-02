import AppRouter from "./router/AppRouter";

function App() {
    console.log("TMDB API KEY:", import.meta.env.VITE_TMDB_API_KEY);

    return <AppRouter />;
}

export default App;
