import './App.css';
import Routing from "./routing";
import Header from "./components/Header/Header";
import {DependenciesProvider} from "./context/Dependencies";
import {AuthProvider} from "./context/Auth";

function App() {
    return (
        <DependenciesProvider>
            <AuthProvider>
                <div>
                    <Header/>
                    <main className="bg-light">
                        <Routing/>
                    </main>
                </div>
            </AuthProvider>
        </DependenciesProvider>
    );
}

export default App;
