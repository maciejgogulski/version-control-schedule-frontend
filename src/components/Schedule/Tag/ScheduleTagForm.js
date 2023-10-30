import React, {useEffect, useState} from "react"
import {Button, Form, Modal} from "react-bootstrap"
import {useTranslation} from "react-i18next"
import ScheduleTagService from "../../../services/ScheduleTagService"
import ScheduleTag from "../../../models/ScheduleTag"

function ScheduleTagForm(props) {
    const {t} = useTranslation()

    const [name, setName] = useState('')
    const [scheduleTagService] = useState(new ScheduleTagService())
    const handleNameChange = (e) => {
        setName(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        let tag = (props.scheduleTag) ? props.scheduleTag : new ScheduleTag()
        tag.name = name

        if (tag.id) {
            await scheduleTagService.editScheduleTag(tag)
        } else {
            await scheduleTagService.addScheduleTag(tag)
        }

        setName('')
        props.onClose()
        props.onFormSubmit()
    }

    useEffect(() => {
        setName((props.scheduleTag) ? props.scheduleTag.name : '')
    }, [props.scheduleTag])

    return (
        <Modal show={props.show} onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{(props.scheduleTag) ? t('entities.tag.editing_tag') + ': ' + props.scheduleTag.name : t('entities.tag.creating_new_tag')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="name">
                        <Form.Label>{t('entities.tag.name')}:</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={handleNameChange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={(props.scheduleTag) ? "primary" : "success"} onClick={handleSubmit}>
                    {(props.scheduleTag) ? t('buttons.edit_schedule') : t('buttons.create_schedule')}
                </Button>
                <Button variant="secondary" onClick={props.onClose}>
                    {t('buttons.close')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ScheduleTagForm
