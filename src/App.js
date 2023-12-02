import './App.css'
import Routing from './routing'
import { DependenciesProvider } from './context/Dependencies'
import { AuthProvider } from './context/Auth'
import 'react-toastify/dist/ReactToastify.css'
import Container from 'react-bootstrap/Container'

function App() {
    return (
            <DependenciesProvider>
                <AuthProvider>
                    <Container fluid>
                        <Routing />
                    </Container>
                </AuthProvider>
            </DependenciesProvider>
    );
}

export default App

