import React, {useEffect, useState} from "react"
import {Button, Form, Modal} from "react-bootstrap"
import {useTranslation} from "react-i18next"
import {useAuth} from "../../../context/Auth";
import {useDependencies} from "../../../context/Dependencies";

function AssignAddresseeToScheduleTagForm(props) {
    const {t} = useTranslation()
    const {token} = useAuth()
    const {getApiService, getToastUtils} = useDependencies()
    const apiService = getApiService()
    const toastUtils = getToastUtils()

    const initialState = {
        addresseeService: apiService.getAddresseeService(token),
        addressees: [],
        selectedAddressees: []
    }

    const [state, setState] = useState(initialState)

    const updateState = (updates) => {
        setState((prevState) => ({...prevState, ...updates}))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (state.selectedAddressees.length !== 0) {
                state.selectedAddressees.map(
                    async (addressee) => {
                        await state.addresseeService.assignAddresseeToScheduleTag(addressee, props.scheduleTagId)
                    }
                )
                toastUtils.showToast(
                    'success',
                    t('toast.success.submit-addressees')
                )
            }
        } catch (error) {
            toastUtils.showToast(
                'error',
                t('toast.error.submit-addressees')
            )
        }
        updateState({selectedAddressees: []})
        props.onClose()
        props.onFormSubmit()
    }

    async function fetchAddressees(id) {
        try {
            const data = await state.addresseeService.getAddressees(id)
            updateState({addressees: data})
        } catch (error) {
            toastUtils.showToast(
                'error',
                t('toast.error.fetch-addressees')
            )
        }
    }

    useEffect(() => {
        fetchAddressees(props.scheduleTagId)
    }, [props.scheduleTagId])

    return (
        <Modal show={props.show} onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{ t('entities.tag.assigning_addressees')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="addressees">
                        <Form.Label>{t('navigation.addressees')}:</Form.Label>
                        <Form.Control as="select" multiple value={state.selectedAddressees}
                                      onChange={e => {
                                          updateState({
                                              selectedAddressees: [].slice.call(e.target.selectedOptions).map(item => item.value)
                                          })
                                      }}>
                            {state.addressees.map((addressee) => (
                                <option key={addressee.id} value={addressee.id}>{addressee.firstName + ' ' + addressee.lastName}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={"success"} onClick={handleSubmit}>
                    {t('buttons.assign_addressees')}
                </Button>
                <Button variant="secondary" onClick={props.onClose}>
                    {t('buttons.close')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AssignAddresseeToScheduleTagForm
