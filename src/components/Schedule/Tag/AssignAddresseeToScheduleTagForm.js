import React, {useEffect, useState} from "react"
import {Button, Form, Modal} from "react-bootstrap"
import {useTranslation} from "react-i18next"
import AddresseeService from "../../../backend/services/AddresseeService"

function AssignAddresseeToScheduleTagForm(props) {
    const {t} = useTranslation()

    const [selectedAddressees, setSelectedAddressees] = useState([])
    const [addressees, setAddressees] = useState([])
    const [addresseeService] = useState(new AddresseeService())

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (selectedAddressees.length !== 0) {
            selectedAddressees.map(
                async (addressee) => {
                    await addresseeService.assignAddresseeToScheduleTag(addressee, props.scheduleTagId)
                }
            )
        }

        setSelectedAddressees([])
        props.onClose()
        props.onFormSubmit()
    }

    async function fetchAddressees(id) {
        const response = await addresseeService.getAddressees(id)
        const data = await response.json()

        if (response.ok) {
            setAddressees(data)
        } else {
            console.error('Error:', data)
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
                        <Form.Control as="select" multiple value={selectedAddressees}
                                      onChange={e => setSelectedAddressees([].slice.call(e.target.selectedOptions).map(item => item.value))}>
                            {addressees.map((addressee) => (
                                <option key={addressee.id} value={addressee.id}>{addressee.firstName + '' + addressee.lastName}</option>
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
