import {Button, Form} from "react-bootstrap"
import React from "react"
import {useForm, Controller, FormProvider} from "react-hook-form"
import {useDependencies} from "../../context/Dependencies"
import {useAuth} from "../../context/Auth"
import {useTranslation} from "react-i18next"
import {useNavigate} from "react-router-dom"
import Input from "../Form/Input";

export default function LoginPage() {
    const {getApiService, getToastUtils} = useDependencies()
    const apiService = getApiService()
    const {setToken, setLoggedIn} = useAuth()
    const {t} = useTranslation()
    const toastUtils = getToastUtils()
    const navigate = useNavigate()

    const form = useForm({
        defaultValues: {
            'username': '',
            'password': ''
        }
    })

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
        <FormProvider {...form}>
            <Form onSubmit={form.handleSubmit(onSubmit)}>
                <Input
                    name={'username'}
                    label={t("auth.username")}
                    type={'text'}
                    rules={{
                        required: t('form.required', {fieldName: `"${t('auth.username')}"`})
                    }}
                />
                <Input
                    name={'password'}
                    label={t('auth.password')}
                    type={'password'}
                    rules={{
                        required: t('form.required', {fieldName: `"${t('auth.password')}"`})
                    }}
                />
                <Button className={"mt-3"} variant={"primary"} type="submit">
                    {t("buttons.login")}
                </Button>
            </Form>
        </FormProvider>
    )
}

