import React, {useState} from "react"
import {Button, Modal, Table} from "react-bootstrap"
import {useTranslation} from "react-i18next"
import ScheduleTagAddressees from "../Tag/ScheduleTagAddressees";
import {parseToServerFormat} from "../../../utils/DateTimeParser";
import {useAuth} from "../../../context/Auth";
import {useDependencies} from "../../../context/Dependencies";

function CommitStagedEventModal(props) {
    const {t} = useTranslation()
    const {token} = useAuth()
    const {getToastUtils, getApiService} = useDependencies()
    const apiService = getApiService()
    const toastUtils = getToastUtils()

    const initialState = {
        stagedEventService: apiService.getStagedEventService(token)
    }

    const [state, setState] = useState(initialState)

    const updateState = (updates) => {
        setState((prevState) => ({...prevState, ...updates}))
    }

    const handleConfirmation = async () => {
        try {
            const stagedEvent = await fetchStagedEvent()
            await state.stagedEventService.commitStagedEvent(stagedEvent.id)

            toastUtils.showToast(
                'success',
                t('toast.success.commit-staged-event')
            )
        } catch (error) {
            toastUtils.showToast(
                'error',
                t('toast.error.commit-staged-event')
            )
        }
        props.onClose()
    }

    const fetchStagedEvent = async () => {
        try {
            return  await state.stagedEventService.getLatestStagedEventForSchedule(props.scheduleTagId)
        } catch (error) {
            toastUtils.showToast(
                'error',
                t('toast.error.fetch-latest-staged-event')
            )
        }
    }

    const pickModificationRowFontColor = (modificationType) => {
        switch (modificationType) {
            case 'CREATE_PARAMETER':
                return 'bg-create'
            case 'UPDATE_PARAMETER':
                return 'bg-update'
            case 'DELETE_PARAMETER':
                return 'bg-delete'
            default:
                return ''
        }
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

    const translateParameterValue = (parameterName, parameterValue) => {
        if (!parameterValue) return <p className="text-center">-</p>
        switch (parameterName) {
            case 'Start date':
                return parseToServerFormat(parameterValue)
            case 'End date':
                return parseToServerFormat(parameterValue)
            default:
                return parameterValue
        }
    }


    return (
        <Modal size={"xl"} show={props.show} onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{t('entities.staged_event.committing_staged_event')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <h4>{t('entities.modification.plural')}</h4>
                    <hr className="my-1"/>
                    <Table responsive hover className={'text-center'}>
                        <thead>
                        <tr>
                            <th>{t('entities.modification.timestamp')}</th>
                            <th>{t('entities.modification.type')}</th>
                            <th>{t('entities.block.title')}</th>
                            <th>{t('entities.modification.parameter_name')}</th>
                            <th>{t('entities.modification.new_value')}</th>
                            <th>{t('entities.modification.old_value')}</th>

                        </tr>
                        </thead>
                        <tbody>
                        {props.modifications.map((modification) => (
                            <tr key={modification.id}
                                className={pickModificationRowFontColor(modification.type)}>
                                <td>{parseToServerFormat(modification.timestamp)}</td>
                                <td>{t('entities.modification.types.' + modification.type)}</td>
                                <td>{modification.blockName}</td>
                                <td>{translateParameterName(modification.parameterName)}</td>
                                <td>{translateParameterValue(modification.parameterName, modification.newValue)}</td>
                                <td>{translateParameterValue(modification.parameterName, modification.oldValue)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>

                <ScheduleTagAddressees
                    scheduleTagId={props.scheduleTagId}/>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={props.variant} onClick={handleConfirmation}>
                    {t('buttons.commit_staged_event')}
                </Button>
                <Button variant="secondary" onClick={props.onClose}>
                    {t('buttons.close')}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CommitStagedEventModal
