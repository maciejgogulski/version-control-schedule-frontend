import React, {useEffect, useState} from "react"
import {Button, Form, Modal} from "react-bootstrap"
import {useTranslation} from "react-i18next"
import Addressee from "../../models/Addressee";
import {useAuth} from "../../context/Auth";
import {useDependencies} from "../../context/Dependencies";

function AddresseeForm(props) {
    const {t} = useTranslation()
    const {token} = useAuth()
    const {getApiService, getToastUtils} = useDependencies()
    const apiService = getApiService()
    const toastUtils = getToastUtils()

    const initialState = {
        addresseeService: apiService.getAddresseeService(token),
        email: '',
        firstName: '',
        lastName: ''
    }

    const [state, setState] = useState(initialState)

    const updateState = (updates) => {
        setState((prevState) => ({...prevState, ...updates}))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            let addressee = (props.addressee) ? props.addressee : new Addressee()
            addressee.firstName = state.firstName
            addressee.lastName = state.lastName
            addressee.email = state.email

            if (addressee.id) {
                await state.addresseeService.editAddressee(addressee)
                toastUtils.showToast(
                    'success',
                    t('toast.success.edit-addressee')
                )
            } else {
                await state.addresseeService.addAddressee(addressee)
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

        updateState({
            firstName: '',
            lastName: '',
            email: ''
        })

        props.onClose()
        props.onFormSubmit()
    }

    useEffect(() => {
        console.log(props.addressee)
        if (props.addressee) {
            updateState({
                firstName: props.addressee.firstName,
                lastName: props.addressee.lastName,
                email: props.addressee.email
            })
        } else {
            updateState({
                firstName: '',
                lastName: '',
                email: ''
            })
        }
    }, [props.addressee])

    return (
        <Modal show={props.show} onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{(props.addressee) ? t('entities.addressee.editing_addressee') + ': ' + props.addressee.firstName + ' ' + props.addressee.lastName : t('entities.addressee.creating_new_addressee')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="email">
                        <Form.Label>{t('entities.addressee.email')}:</Form.Label>
                        <Form.Control
                            type="text"
                            value={state.email}
                            onChange={(e) => updateState({email: e.target.value})}
                        />
                    </Form.Group>
                    <Form.Group controlId="firstName">
                        <Form.Label>{t('entities.addressee.first-name')}:</Form.Label>
                        <Form.Control
                            type="text"
                            value={state.firstName}
                            onChange={(e) => updateState({firstName: e.target.value})}
                        />
                    </Form.Group>
                    <Form.Group controlId="lastName">
                        <Form.Label>{t('entities.addressee.last-name')}:</Form.Label>
                        <Form.Control
                            type="text"
                            value={state.lastName}
                            onChange={(e) => updateState({lastName: e.target.value})}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={(props.addressee) ? "primary" : "success"} onClick={handleSubmit}>
                    {(props.addressee) ? t('buttons.edit_addressee') : t('buttons.create_addressee')}
                </Button>
                <Button variant="secondary" onClick={props.onClose}>
                    {t('buttons.close')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddresseeForm
