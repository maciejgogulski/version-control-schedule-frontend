import React, {useEffect, useState} from "react"
import {Button, CloseButton, Form, Modal} from "react-bootstrap"
import ScheduleBlock from "../../../models/ScheduleBlock"
import {parseToServerFormat} from "../../../utils/DateTimeParser"
import {format} from "date-fns"
import {useTranslation} from "react-i18next"
import Parameter from "../../../models/Parameter"
import './ScheduleBlockForm.css'
import {useDependencies} from "../../../context/Dependencies";
import {useAuth} from "../../../context/Auth";

function ScheduleBlockForm(props) {
    const {t} = useTranslation()
    const token = useAuth()
    const {getApiService, getToastUtils} = useDependencies()
    const apiService = getApiService()
    const toastUtils = getToastUtils()

    const initialState = {
        scheduleBlockService: apiService.getScheduleBlockService(token),
        name: '',
        startDate: null,
        endDate: null,
        parameters: [],
        showAddParameterField: null,
        newParameterName: '',
        newParameterValue: '',
        newParameters: [],
        deletedParameters: []
    }

    const [state, setState] = useState(initialState);

    const updateState = (updates) => {
        setState((prevState) => ({...prevState, ...updates}));
    };

    const fetchParametersForBlock = async () => {
        try {
            const data = await state.scheduleBlockService.getParameters(props.blockToEdit.id)
            updateState({parameters: data})
        } catch (error) {
            toastUtils.showToast(
                'error',
                t('toast.error.fetch-params-for-block')
            )
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            let block = (props.blockToEdit) ? props.blockToEdit : new ScheduleBlock()
            block.scheduleTagId = props.scheduleTagId
            block.name = (props.blockToEdit) ? state.parameters[0].value : state.name

            block.startDate = parseToServerFormat((props.blockToEdit) ? state.parameters[1].value : state.startDate)
            block.endDate = parseToServerFormat((props.blockToEdit) ? state.parameters[2].value : state.endDate)

            if (block.id) {
                state.parameters.map(async (parameter) => {
                    await state.scheduleBlockService.assignParameterToScheduleBlock(parameter)
                })
                state.deletedParameters.map(async (parameter) => {
                    await state.scheduleBlockService.deleteParameterFromScheduleBlock(parameter)
                })
                await state.scheduleBlockService.editScheduleBlock(block)
                toastUtils.showToast(
                    'success',
                    t('toast.success.edit-block')
                )
            } else {
                await state.scheduleBlockService.addScheduleBlock(block)
                toastUtils.showToast(
                    'success',
                    t('toast.success.add-block')
                )
            }
        } catch (error) {
            toastUtils.showToast(
                'error',
                t('toast.error.submit')
            )
        }

        updateState({
            name: '',
            startDate: '',
            endDate: '',
            parameters: [],
            newParameters: [],
            deletedParameters: []
        })

        props.onClose()
        props.onFormSubmit()
    }

    useEffect(() => {
        if (props.blockToEdit) {
            updateState({
                name: props.blockToEdit.name,
                startDate: props.blockToEdit.startDate,
                endDate: props.blockToEdit.endDate
            })
            fetchParametersForBlock()
        } else {
            updateState({
                startDate: format(props.pickedDay, "yyyy-MM-dd HH:mm:ss"),
                endDate: format(props.pickedDay, "yyyy-MM-dd HH:mm:ss")
            })
        }

    }, [props.pickedDay, props.blockToEdit])

    const handleParameterChange = (id, value) => {
        updateState({
            parameters: state.parameters.map(parameter => {
                if (parameter.id === id) {
                    return {...parameter, value}
                }
                return parameter
            })
        })
    }

    const handleAddParameterSubmit = async (e) => {
        e.preventDefault()

        let newParameter = new Parameter();
        newParameter.scheduleBlockId = props.blockToEdit.id
        newParameter.parameterName = state.newParameterName
        newParameter.value = state.newParameterValue
        state.newParameters.push(newParameter)
        state.parameters.push(newParameter)

        updateState({
            newParameterName: '',
            newParameterValue: '',
            showAddParameterField: false
        })
    }

    const handleParameterDelete = async (parameter) => {
        const updatedParameters = state.parameters.filter(param => param.parameterName !== parameter.parameterName)
        updateState({parameters: updatedParameters})
        if (parameter.id) {
            state.deletedParameters.push(parameter)
        } else {
            const updatedNewParameters = state.newParameters.filter(param => param.parameterName !== parameter.parameterName)
            updateState({newParameters: updatedNewParameters})
        }
    }

    const handleFormClose = () => {
        updateState({
            showAddParameterField: false,
            name: '',
            startDate: '',
            endDate: '',
            parameters: [],
            newParameters: []
        })
        props.onClose()
    }

    const translateParameterName = (parameterName) => {
        switch (parameterName) {
            case 'Name':
                return t('entities.parameter.required.name')
            case 'Start date':
                return t('entities.parameter.required.start_date')
            case 'End date':
                return t('entities.parameter.required.end_date')
            default:
                return parameterName
        }
    }

    return (
        <Modal show={props.show} onHide={handleFormClose}>
            <Modal.Header closeButton>
                <Modal.Title>{(props.blockToEdit) ? t('entities.block.editing_block') + ": " + props.blockToEdit.name : t('entities.block.creating_new_block')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {!props.blockToEdit && (
                        <>
                            <Form.Group controlId="name">
                                <Form.Label>{t('entities.block.name')}:</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={state.name}
                                    onChange={(e) => updateState({name: e.target.value})}
                                />
                            </Form.Group>
                            <Form.Group controlId="startDate">
                                <Form.Label>{t('entities.block.start_date')}:</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={state.startDate}
                                    onChange={(e) => updateState({startDate: e.target.value})}
                                />
                            </Form.Group>
                            <Form.Group controlId="endDate">
                                <Form.Label>{t('entities.block.end_date')}:</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={state.endDate}
                                    onChange={(e) => updateState({endDate: e.target.value})}
                                />
                            </Form.Group>
                        </>
                    )}
                    {state.parameters.map((parameter, index) => (
                        <Form.Group key={parameter.id} controlId={parameter.parameterName}>
                            <div className="row">
                                <Form.Label
                                    className="col-md-6">{translateParameterName(parameter.parameterName)}:</Form.Label>
                                {index >= 3 && (
                                    <CloseButton
                                        className="col-md-6"
                                        onClick={() => handleParameterDelete(parameter)}
                                    />
                                )}
                            </div>
                            <Form.Control
                                type={(index === 1 || index === 2) ? 'datetime-local' : 'text'}
                                value={parameter.value}
                                onChange={(e) => handleParameterChange(parameter.id, e.target.value)}
                            />
                        </Form.Group>
                    ))}
                    {props.blockToEdit && state.showAddParameterField &&
                        <>
                            <Modal.Header>
                                <Modal.Title>{t('entities.parameter.new')}</Modal.Title>
                            </Modal.Header>
                            <Form.Group controlId={'newParameterName'}>
                                <Form.Label>{t('entities.parameter.name')}:</Form.Label>
                                <Form.Control
                                    className="bg-success-light"
                                    type="text"
                                    value={state.newParameterName}
                                    onChange={(e) => updateState({newParameterName: e.target.value})}
                                />
                            </Form.Group>
                            <Form.Group controlId={'newParameterValue'}>
                                <Form.Label>{t('entities.parameter.value')}:</Form.Label>
                                <Form.Control
                                    className="bg-success-light"
                                    type="text"
                                    value={state.newParameterValue}
                                    onChange={(e) => updateState({newParameterValue: e.target.value})}
                                />
                            </Form.Group>
                        </>
                    }
                </Form>
                {state.showAddParameterField ?
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
                                onClick={() => updateState({showAddParameterField: true})}>
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
