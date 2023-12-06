import React, {useEffect} from "react"
import {Button, Form, Modal} from "react-bootstrap"
import {useTranslation} from "react-i18next"
import Addressee from "../../models/Addressee";
import {useAuth} from "../../context/Auth";
import {useDependencies} from "../../context/Dependencies";
import Input from "../Form/Input";
import {FormProvider, useForm} from "react-hook-form";

function AddresseeForm(props) {
    const {t} = useTranslation()
    const {token} = useAuth()
    const {getApiService, getToastUtils} = useDependencies()
    const apiService = getApiService()
    const toastUtils = getToastUtils()
    const addresseeService = apiService.getAddresseeService(token)

    const form = useForm({
        defaultValues: {
            'email': '',
            'firstName': '',
            'lastName': ''
        }
    })

    const onSubmit = async (data) => {
        try {
            let addressee = (props.addressee) ? props.addressee : new Addressee()
            addressee.firstName = data.firstName.trim()
            addressee.lastName = data.lastName.trim()
            addressee.email = data.email.trim()

            if (addressee.id) {
                await addresseeService.editAddressee(addressee)
                toastUtils.showToast(
                    'success',
                    t('toast.success.edit-addressee')
                )
            } else {
                await addresseeService.addAddressee(addressee)
                toastUtils.showToast(
                    'success',
                    t('toast.success.add-addressee')
                )
            }
        } catch (error) {
            toastUtils.showToast(
                'error',
                t('toast.error.submit')
            )
        }

        props.onClose()
        props.onFormSubmit()
    }

    useEffect(() => {
        if (props.addressee) {
            form.setValue('firstName', props.addressee.firstName)
            form.setValue('lastName', props.addressee.lastName)
            form.setValue('email', props.addressee.email)
        } else {
            form.setValue('firstName', '')
            form.setValue('lastName', '')
            form.setValue('email', '')
        }
    }, [props.addressee, form])

    return (
        <Modal show={props.show} onHide={props.onClose}>
            <FormProvider {...form}>
                <Form onSubmit={form.handleSubmit(onSubmit)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{(props.addressee) ? t('entities.addressee.editing_addressee') + ': ' + props.addressee.firstName + ' ' + props.addressee.lastName : t('entities.addressee.creating_new_addressee')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Input
                            name={'email'}
                            label={t('entities.addressee.email')}
                            rules={{
                                required: t('form.required', {fieldName: `"${t('entities.addressee.email')}"`}),
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                    message: t('form.invalid-pattern', {fieldName: `"${t('entities.addressee.email')}"`})
                                }
                            }}
                        />
                        <Input
                            name={'firstName'}
                            label={t('entities.addressee.first-name')}
                            rules={{
                                required: t('form.required', {fieldName: `"${t('entities.addressee.first-name')}"`}),
                            }}
                        />
                        <Input
                            name={'lastName'}
                            label={t('entities.addressee.last-name')}
                            rules={{
                                required: t('form.required', {fieldName: `"${t('entities.addressee.last-name')}"`}),
                            }}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            type="submit"
                            variant={(props.addressee) ? "primary" : "success"}
                        >
                            {(props.addressee) ? t('buttons.edit_addressee') : t('buttons.create_addressee')}
                        </Button>
                        <Button variant="secondary" onClick={props.onClose}>
                            {t('buttons.close')}
                        </Button>
                    </Modal.Footer>
                </Form>
            </FormProvider>
        </Modal>
    )
}

export default AddresseeForm
