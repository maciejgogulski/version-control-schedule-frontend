import './App.css';
import Routing from "./routing";
import Header from "./components/Header/Header";

function App() {
    return (
        <div>
            <Header />
            <main className="bg-light">
                <Routing />
            </main>
        </div>
    );
}

export default App;
