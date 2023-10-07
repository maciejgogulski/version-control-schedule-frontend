import React, {useEffect, useState} from "react"
import {Button, Form, Modal} from "react-bootstrap"
import ScheduleBlockService from "../../../services/ScheduleBlockService"
import ScheduleBlock from "../../../models/ScheduleBlock"
import { parseToServerFormat } from "../../../util/DateTimeParser"
import {format} from "date-fns"
import {useTranslation} from "react-i18next"

function ScheduleBlockForm(props) {
    const { t } = useTranslation()

    const [name, setName] = useState("")
    const [startDate, setStartDate] = useState(format(props.pickedDay, "yyyy-MM-dd HH:mm:ss"))
    const [endDate, setEndDate] = useState(format(props.pickedDay, "yyyy-MM-dd HH:mm:ss"))

    const handleNameChange = (e) => {
        setName(e.target.value)
    }

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value)
    }

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const scheduleBlockService = new ScheduleBlockService()

        let block = (props.blockToEdit) ? props.blockToEdit : new ScheduleBlock()
        block.scheduleTagId = props.scheduleTagId
        block.name = name

        block.startDate = parseToServerFormat(startDate)
        block.endDate = parseToServerFormat(endDate)

        if (block.id) {
            await scheduleBlockService.editScheduleBlock(block)
        } else {
            await scheduleBlockService.addScheduleBlock(block)
        }

        setName("")
        setStartDate("")
        setEndDate("")

        props.onClose()
        props.onFormSubmit()
    }

    useEffect(() => {
        if (props.blockToEdit) {
            setName(props.blockToEdit.name)
            setStartDate(props.blockToEdit.startDate)
            setStartDate(props.blockToEdit.endDate)
        } else {
            setStartDate(format(props.pickedDay, "yyyy-MM-dd HH:mm:ss"))
            setEndDate(format(props.pickedDay, "yyyy-MM-dd HH:mm:ss"))
        }
    }, [props.pickedDay, props.blockToEdit])

    return (
        <Modal show={props.show} onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{(props.blockToEdit) ? t('entities.block.editing_block') + ": " + props.blockToEdit.name : t('entities.block.creating_new_block')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="name">
                        <Form.Label>{t('entities.block.name')}:</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={handleNameChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="startDate">
                        <Form.Label>{t('entities.block.start_date')}:</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={startDate}
                            onChange={handleStartDateChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="endDate">
                        <Form.Label>{t('entities.block.end_date')}:</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={endDate}
                            onChange={handleEndDateChange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={(props.blockToEdit) ? "primary" : "success"} onClick={handleSubmit}>
                    {(props.blockToEdit) ? t('buttons.edit_block') : t('buttons.create_block')}
                </Button>
                <Button variant="secondary" onClick={props.onClose}>
                    {t('buttons.close')}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ScheduleBlockForm
