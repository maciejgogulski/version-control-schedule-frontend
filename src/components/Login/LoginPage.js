import {Button, Form} from "react-bootstrap"
import React, {useState} from "react"
import {useDependencies} from "../../context/Dependencies"
import {useAuth} from "../../context/Auth"
import {useTranslation} from "react-i18next"

export default function LoginPage() {
    const {getApiService, getToastUtils} = useDependencies()
    const apiService = getApiService()
    const {setToken, setLoggedIn} = useAuth()
    const {t} = useTranslation()
    const toastUtils = getToastUtils()

    const initialState = {
        authService: apiService.getAuthService(),
        username: '',
        password: ''
    }

    const [state, setState] = useState(initialState)

    const updateState = (updates) => {
        setState((prevState) => ({ ...prevState, ...updates }));
    };

    const handleSubmit = async () => {
        try {
            const authData = await state.authService.login({
                username: state.username,
                password: state.password
            })
            setToken(authData.getToken())
            setLoggedIn(true)
        } catch (error) {
            toastUtils.showToast(
                'error',
                'Niepoprawne dane logowania',
            )
        }

    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
                <Form.Label>{t('auth.username')}:</Form.Label>
                <Form.Control
                    type="text"
                    value={state.username}
                    onChange={(e) => updateState({username: e.target.value})}
                />
            </Form.Group>
            <Form.Group controlId="password">
                <Form.Label>{t('auth.password')}:</Form.Label>
                <Form.Control
                    type="password"
                    value={state.password}
                    onChange={(e) => updateState({password: e.target.value})}
                />
            </Form.Group>
            <Button variant={"primary"} onClick={handleSubmit}>
                {t('buttons.auth.submit')}
            </Button>
        </Form>
    )
}
