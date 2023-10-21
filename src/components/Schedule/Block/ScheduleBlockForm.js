import React, {useEffect, useState} from "react"
import {Button, Form, Modal} from "react-bootstrap"
import ScheduleBlockService from "../../../services/ScheduleBlockService"
import ScheduleBlock from "../../../models/ScheduleBlock"
import {parseToServerFormat} from "../../../util/DateTimeParser"
import {format} from "date-fns"
import {useTranslation} from "react-i18next"
import Parameter from "../../../models/Parameter"
import './ScheduleBlockForm.css'

function ScheduleBlockForm(props) {
    const {t} = useTranslation()

    const [name, setName] = useState('')
    const [startDate, setStartDate] = useState(format(props.pickedDay, "yyyy-MM-dd HH:mm:ss"))
    const [endDate, setEndDate] = useState(format(props.pickedDay, "yyyy-MM-dd HH:mm:ss"))
    const [parameters, setParameters] = useState([])
    const [scheduleBlockService] = useState(new ScheduleBlockService())
    const [showAddParameterField, setShowAddParameterField] = useState(null)
    const [newParameterName, setNewParameterName] = useState('')
    const [newParameterValue, setNewParameterValue] = useState('')
    const [newParameters, setNewParameters] = useState([])


    const fetchParametersForBlock = async () => {
        const response = await scheduleBlockService.getParameters(props.blockToEdit.id)
        const data = await response.json()

        if (response.ok) {
            setParameters(data)
        } else {
            console.error("Error:", data)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        let block = (props.blockToEdit) ? props.blockToEdit : new ScheduleBlock()
        block.scheduleTagId = props.scheduleTagId
        block.name = name

        block.startDate = parseToServerFormat(startDate)
        block.endDate = parseToServerFormat(endDate)

        if (block.id) {
            parameters.map(async (parameter) => {
                await scheduleBlockService.assignParameterToScheduleBlock(parameter)
            })
            await scheduleBlockService.editScheduleBlock(block)
        } else {
            await scheduleBlockService.addScheduleBlock(block)
        }

        setName("")
        setStartDate("")
        setEndDate("")
        setParameters([])

        props.onClose()
        props.onFormSubmit()
    }

    useEffect(() => {
        if (props.blockToEdit) {
            setName(props.blockToEdit.name)
            setStartDate(props.blockToEdit.startDate)
            setStartDate(props.blockToEdit.endDate)
            fetchParametersForBlock()
        } else {
            setStartDate(format(props.pickedDay, "yyyy-MM-dd HH:mm:ss"))
            setEndDate(format(props.pickedDay, "yyyy-MM-dd HH:mm:ss"))
        }

    }, [props.pickedDay, props.blockToEdit])

    const handleAddParameterSubmit = async (e) => {
        e.preventDefault()

        let newParameter = new Parameter();
        newParameter.scheduleBlockId = props.blockToEdit.id
        newParameter.parameterName = newParameterName
        newParameter.value = newParameterValue
        newParameters.push(newParameter)
        parameters.push(newParameter)

        setNewParameterName('')
        setNewParameterValue('')

        setShowAddParameterField(false)
    }

    const handleFormClose = () => {
        setShowAddParameterField(false)
        setNewParameters([])
        props.onClose()
    }

    return (
        <Modal show={props.show} onHide={handleFormClose}>
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
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="startDate">
                        <Form.Label>{t('entities.block.start_date')}:</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="endDate">
                        <Form.Label>{t('entities.block.end_date')}:</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </Form.Group>
                    {parameters.map((parameter) => (
                        <Form.Group key={parameter.id} controlId={parameter.parameterName}>
                            <Form.Label>{parameter.parameterName}:</Form.Label>
                            <Form.Control
                                type="text"
                                value={parameter.value}
                                onChange={(e) => parameter.value = e.target.value}
                            />
                        </Form.Group>
                    ))}
                    {props.blockToEdit && showAddParameterField &&
                        <>
                            <Modal.Header>
                                <Modal.Title>{t('entities.parameter.new')}</Modal.Title>
                            </Modal.Header>
                            <Form.Group controlId={'newParameterName'}>
                                <Form.Label>{t('entities.parameter.name')}:</Form.Label>
                                <Form.Control
                                    className="bg-success-light"
                                    type="text"
                                    value={newParameterName}
                                    onChange={(e) => setNewParameterName(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId={'newParameterValue'}>
                                <Form.Label>{t('entities.parameter.value')}:</Form.Label>
                                <Form.Control
                                    className="bg-success-light"
                                    type="text"
                                    value={newParameterValue}
                                    onChange={(e) => setNewParameterValue(e.target.value)}
                                />
                            </Form.Group>
                        </>
                    }
                </Form>
                {showAddParameterField ?
                    <Button
                        className="mt-3"
                        variant="success"
                        onClick={handleAddParameterSubmit}>
                        {t('buttons.add_parameter')}
                    </Button>
                    :
                    <>
                        {
                            props.blockToEdit && <Button
                                className="mt-3"
                                variant="secondary"
                                onClick={() => setShowAddParameterField(true)}>
                                {t('buttons.add_parameter')}
                            </Button>
                        }
                    </>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant={(props.blockToEdit) ? "primary" : "success"} onClick={handleSubmit}>
                    {(props.blockToEdit) ? t('buttons.edit_block') : t('buttons.create_block')}
                </Button>
                <Button variant="secondary" onClick={handleFormClose}>
                    {t('buttons.close')}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ScheduleBlockForm
