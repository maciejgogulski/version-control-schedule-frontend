import React, {useEffect, useState} from "react"
import {Button, Form, Modal} from "react-bootstrap"
import {extractTimeFromDateTimeString, parseToServerFormat} from "../../utils/DateTimeParser"
import {addDays, format, isBefore, parseISO, subDays} from "date-fns"
import {useTranslation} from "react-i18next"
import './BlockForm.css'
import {useDependencies} from "../../context/Dependencies";
import {useAuth} from "../../context/Auth";
import DateRangeError from "../../errors/DateRangeError";

function MassEditRelatedBlocksForm(props) {
    const {t} = useTranslation()
    const token = useAuth()
    const {getApiService, getToastUtils} = useDependencies()
    const apiService = getApiService()
    const toastUtils = getToastUtils()

    const initialState = {
        blockService: apiService.getBlockService(token),
        relatedBlocks: [],
        startTime: null,
        endTime: null
    }

    const [state, setState] = useState(initialState);

    const updateState = (updates) => {
        setState((prevState) => ({...prevState, ...updates}));
    };

    const fetchRelatedBlocks = async () => {
        try {
            const data = await state.blockService.getRelatedBlocks(props.blockToMassEdit.id)
            data.map((block) => {
                block.disabled = (
                    extractTimeFromDateTimeString(block.startDate) !== extractTimeFromDateTimeString(props.blockToMassEdit.startDate) &&
                    extractTimeFromDateTimeString(block.endDate) !== extractTimeFromDateTimeString(props.blockToMassEdit.endDate)
                )
            })
            updateState({relatedBlocks: data})
        } catch (error) {
            toastUtils.showToast(
                'error',
                t('toast.error.fetch-related-blocks')
            )
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const editedBlocks = []
            state.relatedBlocks.map((block) => {
                if (!block.disabled) {
                    if (isBefore(parseISO(block.endDate), parseISO(block.startDate))) {
                        throw new DateRangeError(t('toast.error.date-end-before-start'))
                    }
                    editedBlocks.push(block)
                }
            })

            await state.blockService.massEditBlocks(editedBlocks)
            toastUtils.showToast(
                'success',
                t('toast.success.mass-edit-blocks')
            )
        } catch (error) {
            if (error instanceof DateRangeError) {
                toastUtils.showToast(
                    'error',
                    t('toast.error.date-end-before-start')
                )
            } else {
                toastUtils.showToast(
                    'error',
                    t('toast.error.submit')
                )
            }
            props.onClose()
        }

        updateState({
            relatedBlocks: [],
            startTime: null,
            endTime: null
        })

        props.onClose()
        props.onFormSubmit()
    }

    useEffect(() => {
        if (props.blockToMassEdit) {
            fetchRelatedBlocks()
            updateState({
                startTime: extractTimeFromDateTimeString(props.blockToMassEdit.startDate),
                endTime: extractTimeFromDateTimeString(props.blockToMassEdit.endDate)
            })
        }
    }, [props.blockToMassEdit])

    const handleStartTimeChange = (startTime) => {
        const [hours, minutes] = startTime.split(':').map(Number)

        updateState({
            startTime: startTime,
            relatedBlocks: state.relatedBlocks.map((block) => {
                if (!block.disabled) {
                    const parsedDate = parseISO(block.startDate)
                    parsedDate.setHours(hours)
                    parsedDate.setMinutes(minutes)

                    return {...block, startDate: format(parsedDate, 'yyyy-MM-dd HH:mm:ss')}
                }
                return block
            })
        })
    }

    const handleEndTimeChange = (endTime) => {
        const [hours, minutes] = endTime.split(':').map(Number)

        updateState({
            endTime: endTime,
            relatedBlocks: state.relatedBlocks.map((block) => {
                if (!block.disabled) {
                    const parsedDate = parseISO(block.endDate)
                    parsedDate.setHours(hours)
                    parsedDate.setMinutes(minutes)

                    return {...block, endDate: format(parsedDate, 'yyyy-MM-dd HH:mm:ss')}
                }
                return block
            })
        })
    }

    const handleStartDateChange = (index, startDate) => {
        updateState({
            relatedBlocks: state.relatedBlocks.map((blocks, i) => {
                if (index === i) {
                    return {...blocks, startDate: parseToServerFormat(startDate)}
                }
                return blocks
            })
        })
    }

    const handleEndDateChange = (index, endDate) => {
        updateState({
            relatedBlocks: state.relatedBlocks.map((blocks, i) => {
                if (index === i) {
                    return {...blocks, endDate: parseToServerFormat(endDate)}
                }
                return blocks
            })
        })
    }

    const handleEnableEditingBlock = (index) => {
        updateState({
            relatedBlocks: state.relatedBlocks.map((block, i) => {
                if (index === i) {
                    return {...block, disabled: !block.disabled}
                }
                return block
            })
        })
    }

    const handleMoveDayChange = (direction) => {
        updateState({
            relatedBlocks: state.relatedBlocks.map((block) => {
                if (!block.disabled) {
                    const parsedStartDate = parseISO(block.startDate)
                    const movedStartDate = direction === 'forwards'
                        ? addDays(parsedStartDate, 1)
                        : subDays(parsedStartDate, 1)

                    const parsedEndDate = parseISO(block.endDate)
                    const movedEndDate = direction === 'forwards'
                        ? addDays(parsedEndDate, 1)
                        : subDays(parsedEndDate, 1)

                    return {
                        ...block,
                        startDate: format(movedStartDate, 'yyyy-MM-dd HH:mm:ss'),
                        endDate: format(movedEndDate, 'yyyy-MM-dd HH:mm:ss')
                    }
                }
                return block
            })
        })
    }

    const handleFormClose = () => {
        updateState({
            relatedBlocks: [],
            startTime: null,
            endTime: null
        })
        props.onClose()
    }

    return (
        <Modal show={props.show}
               onHide={handleFormClose}
               size="xl"
        >
            <Modal.Header closeButton>
                <Modal.Title>{t('entities.block.mass-editing-related-blocks', {name: props.blockToMassEdit?.name})}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="alert alert-info" role="info">
                    {t('alerts.mass-edit-instruction')}
                </div>

                <Form onSubmit={handleSubmit}>
                    <div className="row my-2">
                        <Form.Group controlId={`startHour`}
                                    className="col-md-4"
                        >
                            <Form.Label>{t('entities.block.change-start-hour')}:</Form.Label>
                            <Form.Control
                                type="time"
                                value={state.startTime}
                                onChange={(e) => handleStartTimeChange(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId={`endHour`}
                                    className="col-md-4"
                        >
                            <Form.Label>{t('entities.block.change-end-hour')}:</Form.Label>
                            <Form.Control
                                type="time"
                                value={state.endTime}
                                onChange={(e) => handleEndTimeChange(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="col-md-4"
                                    controlId="moveDayButtons"
                        >
                            <Form.Label>{t('entities.block.move-day')}:</Form.Label>
                            <div className="btn-group"
                                 is="Form.Control"
                            >
                                <Button
                                    type="button"
                                    variant="outline-secondary"
                                    onClick={() => handleMoveDayChange('backwards')}
                                >
                                    &lt;&lt;
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline-secondary"
                                    onClick={() => handleMoveDayChange('forwards')}
                                >
                                    &gt;&gt;
                                </Button>
                            </div>
                        </Form.Group>
                    </div>
                    {state.relatedBlocks && state.relatedBlocks.map((relatedBlock, index) => (
                        <div className="row my-2">
                            <Form.Group controlId={`relatedBlockCheck${index}`}
                                        className="col-md-2"
                            >
                                <Form.Label>{relatedBlock.name}</Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    value={relatedBlock.disabled}
                                    checked={!relatedBlock.disabled}
                                    onChange={() => handleEnableEditingBlock(index)}
                                />
                            </Form.Group>

                            <Form.Group controlId={`startDate${index}`}
                                        className="col-md-5"
                            >
                                <Form.Label>{t('entities.block.start_date')}:</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={relatedBlock.startDate}
                                    onChange={(e) => handleStartDateChange(index, e.target.value)}
                                    disabled={relatedBlock.disabled}
                                />
                            </Form.Group>

                            <Form.Group controlId={`endDate${index}`}
                                        className="col-md-5"
                            >
                                <Form.Label>{t('entities.block.end_date')}:</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={relatedBlock.endDate}
                                    onChange={(e) => handleEndDateChange(index, e.target.value)}
                                    disabled={relatedBlock.disabled}
                                />
                            </Form.Group>
                        </div>
                    ))}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={"success"} onClick={handleSubmit}>
                    {t('buttons.edit-related-blocks')}
                </Button>
                <Button variant="secondary" onClick={handleFormClose}>
                    {t('buttons.close')}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default MassEditRelatedBlocksForm
