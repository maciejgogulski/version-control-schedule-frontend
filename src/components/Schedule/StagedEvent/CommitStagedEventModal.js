import React, {useState} from "react"
import {Button, Modal, Table} from "react-bootstrap"
import {useTranslation} from "react-i18next"
import StagedEventService from "../../../services/StagedEventService";
import ScheduleTagAddressees from "../Tag/ScheduleTagAddressees";
import {parseToServerFormat} from "../../../util/DateTimeParser";

function CommitStagedEventModal(props) {
    const {t} = useTranslation()
    const [stagedEventService] = useState(new StagedEventService())

    const handleConfirmation = async () => {
        const stagedEvent = await fetchStagedEvent()
        await stagedEventService.commitStagedEvent(stagedEvent.id)

        props.onClose()
    }

    const fetchStagedEvent = async () => {
        const response = await stagedEventService.getLatestStagedEventForSchedule(props.scheduleTagId)
        const data = await response.json()

        if (response.ok) {
            return data
        } else {
            console.error("Error:", data)
        }
    }

    const pickModificationRowBackGround = (modificationType) => {
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
                <div className="row">
                    <div className="col-md-6">
                        <h4>{t('entities.modification.plural')}</h4>
                        <hr className="my-1"/>
                        <Table responsive hover>
                            <thead>
                            <tr>
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
                                    className={pickModificationRowBackGround(modification.type)}>
                                    <td>{t('entities.modification.types.' + modification.type)}</td>
                                    <td>{modification.blockName}</td>
                                    <td>{translateParameterName(modification.parameterName)}</td>
                                    <td>{modification.newValue}</td>
                                    <td>{modification.oldValue}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </div>

                    <div className="col-md-6">
                        <ScheduleTagAddressees
                            scheduleTagId={props.scheduleTagId}/>
                    </div>
                </div>
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