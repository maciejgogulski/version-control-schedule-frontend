import React, {useEffect, useState} from "react"
import {Button, Form, Modal} from "react-bootstrap"
import {useTranslation} from "react-i18next"
import AddresseeService from "../../services/AddresseeService";
import Addressee from "../../models/Addressee";

function AddresseeForm(props) {
    const {t} = useTranslation()

    const [email, setEmail] = useState('')
    const [firstName, setFirsName] = useState('')
    const [lastName, setLastName] = useState('')

    const [addresseeService] = useState(new AddresseeService())

    const handleSubmit = async (e) => {
        e.preventDefault()

        let addressee = (props.addressee) ? props.addressee : new Addressee()
        addressee.firstName = firstName
        addressee.lastName = lastName
        addressee.email = email

        if (addressee.id) {
            await addresseeService.editAddressee(addressee)
        } else {
            await addresseeService.addAddressee(addressee)
        }

        setFirsName('')
        setLastName('')
        setEmail('')

        props.onClose()
        props.onFormSubmit()
    }

    useEffect(() => {
        console.log(props.addressee)
        if (props.addressee) {
            setFirsName(props.addressee.firstName)
            setLastName(props.addressee.lastName)
            setEmail(props.addressee.email)
        } else {
            setFirsName('')
            setLastName('')
            setEmail('')
        }
    }, [props.addressee])

    return (
        <Modal show={props.show} onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{(props.addressee) ? t('entities.addressee.editing_addressee') + ': ' + props.addressee.firstName + ' ' + props.addressee.lastName: t('entities.addressee.creating_new_addressee')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="email">
                        <Form.Label>{t('entities.addressee.email')}:</Form.Label>
                        <Form.Control
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="firstName">
                        <Form.Label>{t('entities.addressee.first-name')}:</Form.Label>
                        <Form.Control
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirsName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="lastName">
                        <Form.Label>{t('entities.addressee.last-name')}:</Form.Label>
                        <Form.Control
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
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
