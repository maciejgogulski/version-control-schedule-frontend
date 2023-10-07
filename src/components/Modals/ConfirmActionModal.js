import React, {useEffect, useState} from "react"
import {Button, Form, Modal} from "react-bootstrap"
import {format} from "date-fns"
import {useTranslation} from "react-i18next"

function ConfirmActionModal(props) {
    const { t } = useTranslation()

    const handleConfirmation = async () => {
        props.action()
        props.onClose()
    }

    return (
        <Modal show={props.show} onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.message}
            </Modal.Body>
            <Modal.Footer>
                <Button variant={props.variant} onClick={handleConfirmation}>
                    {t('buttons.confirm')}
                </Button>
                <Button variant="secondary" onClick={props.onClose}>
                    {t('buttons.close')}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ConfirmActionModal
