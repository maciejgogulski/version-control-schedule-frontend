import React, {useEffect, useState} from "react"
import {Button, CloseButton, Form, Modal} from "react-bootstrap"
import Block from "../../models/Block"
import {parseToServerFormat} from "../../utils/DateTimeParser"
import {addDays, format, parseISO} from "date-fns"
import {useTranslation} from "react-i18next"
import Parameter from "../../models/Parameter"
import './BlockForm.css'
import {useDependencies} from "../../context/Dependencies";
import {useAuth} from "../../context/Auth";

function MultiplyBlockForm(props) {
    const {t} = useTranslation()
    const token = useAuth()
    const {getApiService, getToastUtils} = useDependencies()
    const apiService = getApiService()
    const toastUtils = getToastUtils()

    const initialState = {
        blockService: apiService.getBlockService(token),
        parameters: [],
        showMultiplyNextBlockField: false,
        datesOfNewBlocks: [
            {
                startDate: '',
                endDate: ''
            }
        ]
    }

    const [state, setState] = useState(initialState);

    const updateState = (updates) => {
        setState((prevState) => ({...prevState, ...updates}));
    };

    const fetchParametersForBlock = async () => {
        try {
            const data = await state.blockService.getParameters(props.blockToMultiply.id)
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
            let blocksWithParameters = []

            let parametersWithoutDates = state.parameters.filter(
                parameter => !(parameter.parameterName === 'Name' || parameter.parameterName === 'Start date' || parameter.parameterName === 'End date')
            ).map(({id, blockId, ...rest}) => rest)

            state.datesOfNewBlocks.map((dates) => {
                blocksWithParameters = [
                    ...blocksWithParameters,
                    {
                        scheduleId: props.blockToMultiply.scheduleId,
                        name: props.blockToMultiply.name,
                        startDate: parseToServerFormat(dates.startDate),
                        endDate: parseToServerFormat(dates.endDate),
                        parameters: [...parametersWithoutDates]
                    }
                ]
            })

            console.log('BlocksWithParameters', blocksWithParameters)

            await state.blockService.addMultipleBlocks(blocksWithParameters)

            toastUtils.showToast(
                'success',
                t('toast.success.multiply-block')
            )
        } catch (error) {
            toastUtils.showToast(
                'error',
                t('toast.error.submit')
            )
        }

        updateState({
            parameters: [],
            datesOfNewBlocks: [
                {
                    startDate: '',
                    endDate: ''
                }
            ]
        })

        props.onClose()
        props.onFormSubmit()
    }

    useEffect(() => {
        if (props.blockToMultiply) {
            console.log('BlockToMultiply', props.blockToMultiply)
            updateState({
                datesOfNewBlocks: [
                    {
                        startDate:
                            format(
                                addDays(
                                    parseISO(
                                        props.blockToMultiply.startDate
                                    ),
                                    7
                                ),
                                "yyyy-MM-dd HH:mm:ss"
                            ),
                        endDate:
                            format(
                                addDays(
                                    parseISO(
                                        props.blockToMultiply.endDate
                                    ),
                                    7
                                ),
                                "yyyy-MM-dd HH:mm:ss"
                            ),
                    }
                ]
            })
            fetchParametersForBlock()
        }
    }, [props.blockToMultiply])

    const handleStartDateChange = (index, startDate) => {
        updateState({
            datesOfNewBlocks: state.datesOfNewBlocks.map((dates, i) => {
                if (index === i) {
                    return {...dates, startDate}
                }
                return dates
            })
        })
    }

    const handleEndDateChange = (index, endDate) => {
        updateState({
            datesOfNewBlocks: state.datesOfNewBlocks.map((dates, i) => {
                if (index === i) {
                    return {...dates, endDate}
                }
                return dates
            })
        })
    }

    const handleAddBlockMultiplication = () => {
        const lastDatesInForm = state.datesOfNewBlocks[state.datesOfNewBlocks.length - 1]
        updateState({
            datesOfNewBlocks: [
                ...state.datesOfNewBlocks,
                {
                    startDate:
                        format(
                            addDays(
                                parseISO(
                                    lastDatesInForm.startDate
                                ),
                                7
                            ),
                            "yyyy-MM-dd HH:mm:ss"
                        ),
                    endDate:
                        format(
                            addDays(
                                parseISO(
                                    lastDatesInForm.endDate
                                ),
                                7
                            ),
                            "yyyy-MM-dd HH:mm:ss"
                        ),
                }
            ]
        })
    }

    const handleRemoveBlockMultiplication = (index) => {
        updateState(
            {
                datesOfNewBlocks:
                    [...state.datesOfNewBlocks.slice(0, index), ...state.datesOfNewBlocks.slice(index + 1)]
            }
        )
    }

    const handleFormClose = () => {
        updateState({
            parameters: [],
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
        <Modal show={props.show}
               onHide={handleFormClose}
               size="lg"
        >
            <Modal.Header closeButton>
                <Modal.Title>{t('entities.block.multiplying-block', {name: props.blockToMultiply?.name})}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {state.datesOfNewBlocks.map((dates, index) => (
                        <div className="row my-2">
                            <Form.Group controlId={`startDate${index}`}
                                        className="col-md-5"
                            >
                                <Form.Label>{t('entities.block.start_date')}:</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={dates.startDate}
                                    onChange={(e) => handleStartDateChange(index, e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId={`endDate${index}`}
                                        className="col-md-5"
                            >
                                <Form.Label>{t('entities.block.end_date')}:</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={dates.endDate}
                                    onChange={(e) => handleEndDateChange(index, e.target.value)}
                                />
                            </Form.Group>
                            {index > 0 && (
                                <CloseButton
                                    onClick={() => handleRemoveBlockMultiplication(index)}
                                />
                            )}
                        </div>
                    ))}
                    <Button variant={"outline-success"}
                            onClick={handleAddBlockMultiplication}
                            className="mt-3"
                    >
                        {t('buttons.add-another-multiplication')}
                    </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={"success"} onClick={handleSubmit}>
                    {t('buttons.multiply-block')}
                </Button>
                <Button variant="secondary" onClick={handleFormClose}>
                    {t('buttons.close')}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default MultiplyBlockForm
