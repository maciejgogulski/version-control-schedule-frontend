import './App.css'
import Routing from "./routing"
import Header from "./components/Header/Header"
import {DependenciesProvider} from "./context/Dependencies"
import {AuthProvider} from "./context/Auth"
import {ToastContainer} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

function App() {
    return (
        <DependenciesProvider>
            <AuthProvider>
                <Header/>
                <main className="bg-light">
                    <Routing/>
                    <ToastContainer
                        position="bottom-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />
                </main>
            </AuthProvider>
        </DependenciesProvider>
    );
}

export default App;
