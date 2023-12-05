import {Button, Form} from "react-bootstrap"
import React from "react"
import {useForm, Controller} from "react-hook-form"
import {useDependencies} from "../../context/Dependencies"
import {useAuth} from "../../context/Auth"
import {useTranslation} from "react-i18next"
import {useNavigate} from "react-router-dom"

export default function LoginPage() {
    const {getApiService, getToastUtils} = useDependencies()
    const apiService = getApiService()
    const {setToken, setLoggedIn} = useAuth()
    const {t} = useTranslation()
    const toastUtils = getToastUtils()
    const navigate = useNavigate()

    const {control, handleSubmit} = useForm()

    const onSubmit = async (data) => {
        try {
            const authData = await apiService.getAuthService().login({
                username: data.username,
                password: data.password,
            })
            setToken(authData.getToken())
            setLoggedIn(true)
            navigate("/schedule")
            toastUtils.showToast("info", t("toast.success.login"))
        } catch (error) {
            toastUtils.showToast("error", t("toast.error.login"))
        }
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="username">
                <Form.Label>{t("auth.username")}:</Form.Label>
                <Controller
                    name="username"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: t('form.required', {fieldName: `"${t('auth.username')}"`})
                    }}
                    render={({field, fieldState}) => (
                        <>
                            <Form.Control
                                type="text"
                                {...field}
                                isInvalid={fieldState.invalid}
                            />
                            {fieldState.error && (
                                <Form.Control.Feedback type="invalid">
                                    {fieldState.error.message}
                                </Form.Control.Feedback>
                            )}
                        </>
                    )}
                />
            </Form.Group>
            <Form.Group controlId="password">
                <Form.Label>{t("auth.password")}:</Form.Label>
                <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: t('form.required', {fieldName: `"${t('auth.password')}"`})
                    }}
                    render={({field, fieldState}) => (
                        <>
                            <Form.Control
                                type="password"
                                {...field}
                                isInvalid={fieldState.invalid}
                            />
                            {fieldState.error && (
                                <Form.Control.Feedback type="invalid">
                                    {fieldState.error.message}
                                </Form.Control.Feedback>
                            )}
                        </>
                    )}
                />
            </Form.Group>
            <Button className={"mt-3"} variant={"primary"} type="submit">
                {t("buttons.login")}
            </Button>
        </Form>
    )
}

