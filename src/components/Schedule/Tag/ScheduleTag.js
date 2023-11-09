import React, {useEffect, useState} from "react"
import ScheduleBlockListElement from "../Block/ScheduleBlockListElement"
import ScheduleBlockDetails from "../Block/ScheduleBlockDetails"
import ScheduleBlockService from "../../../services/ScheduleBlockService"
import {Button, Table} from "react-bootstrap"
import ScheduleBlockForm from "../Block/ScheduleBlockForm"
import {parseFromServerFormat} from "../../../util/DateTimeParser"
import {addDays, format, parseISO, subDays} from "date-fns"
import DatePickerModal from "../../Modals/DatePickerModal"
import {useTranslation} from "react-i18next"
import ScheduleTagService from "../../../services/ScheduleTagService"
import {useParams} from "react-router-dom"
import ConfirmActionModal from "../../Modals/ConfirmActionModal";
import ScheduleTagAddressees from "./ScheduleTagAddressees";
import StagedEventService from "../../../services/StagedEventService";

function ScheduleTag() {
    const [scheduleTagService] = useState(new ScheduleTagService())
    const [scheduleBlockService] = useState(new ScheduleBlockService())
    const [stagedEventService] = useState(new StagedEventService())
    const {scheduleTagId} = useParams()
    const [scheduleTag, setScheduleTag] = useState(null)
    const [selectedBlock, setSelectedBlock] = useState(null)
    const [scheduleBlocks, setScheduleBlocks] = useState([])
    const [showBlockForm, setShowBlockForm] = useState(false)
    const [showDayPicker, setShowDayPicker] = useState(false)
    const [pickedDay, setPickedDay] = useState(new Date())
    const [showDeleteBlockModal, setShowDeleteBlockModal] = useState(false)
    const [blockToEdit, setBlockToEdit] = useState(null)
    const [modifications, setModifications] = useState([])

    useEffect(() => {
        fetchScheduleTag().then(() => {
            fetchScheduleBlocks()
            fetchModifications()
        })
    }, [pickedDay, scheduleTagId])

    const fetchScheduleBlocks = async () => {
        const day = format(pickedDay, "yyyy-MM-dd HH:mm:ss")
        const response = await scheduleBlockService.getScheduleBlocksByDay(
            scheduleTagId,
            day
        )
        const data = await response.json()

        if (response.ok) {
            data.forEach((block) => {
                block.startDate = parseFromServerFormat(block.startDate)
                block.endDate = parseFromServerFormat(block.endDate)
            })
            setScheduleBlocks(data)
        } else {
            console.error("Error:", data)
        }
    }

    const fetchScheduleTag = async () => {
        const response = await scheduleTagService.getScheduleTag(scheduleTagId)
        const data = await response.json()

        if (response.ok) {
            setScheduleTag(data)
        } else {
            console.error("Error:", data)
        }
    }

    const fetchModifications = async () => {
        const stagedEvent = await fetchStagedEvent()

        const response = await stagedEventService.getModificationsForStagedEvent(stagedEvent.id)
        const data = await response.json()

        if (response.ok) {
            setModifications(data)
        } else {
            console.error("Error:", data)
        }
    }

    const fetchStagedEvent = async () => {
        const response = await stagedEventService.getLatestStagedEventForSchedule(scheduleTagId)
        const data = await response.json()

        if (response.ok) {
            return data
        } else {
            console.error("Error:", data)
        }
    }

    const handleBlockDelete = async () => {
        await scheduleBlockService.deleteScheduleBlock(selectedBlock.id)
        await fetchScheduleBlocks()

        setShowDeleteBlockModal(false)
        setSelectedBlock(null)
    }

    const {t} = useTranslation()

    return (
        <div className="container">
            <ScheduleBlockForm
                show={showBlockForm}
                pickedDay={pickedDay}
                onClose={() => {
                    setShowBlockForm(false)
                    setBlockToEdit(null)
                }}
                onFormSubmit={async () => {
                    await fetchScheduleBlocks()
                    await fetchModifications()
                    setBlockToEdit(null)
                }}
                scheduleTagId={scheduleTagId}
                blockToEdit={blockToEdit}
            />
            <DatePickerModal
                show={showDayPicker}
                pickedDay={pickedDay}
                onDayPick={(day) => {
                    setPickedDay(parseISO(day))
                    setSelectedBlock(null)
                }}
                onClose={() => setShowDayPicker(false)}
            />
            <ConfirmActionModal
                show={showDeleteBlockModal}
                title={t("entities.block.deleting_block") + " " + selectedBlock?.name}
                message={t("entities.block.delete_block_message", {name: selectedBlock?.name})}
                action={handleBlockDelete}
                variant={"danger"}
                onClose={() => setShowDeleteBlockModal(false)}
            />
            <div className="row">
                <h2>
                    {t("entities.schedule.title")} {scheduleTag ? scheduleTag.name : null}
                </h2>

                <div className="container">
                    <Button
                        variant="success"
                        className="me-2"
                        onClick={() => {
                            setBlockToEdit(null)
                            setShowBlockForm(true)
                        }}
                    >
                        {t("buttons.create_block")}
                    </Button>

                    <Button
                        variant="outline-secondary"
                        className="me-2"
                        onClick={() => {
                            setPickedDay(subDays(pickedDay, 1))
                            setSelectedBlock(null)
                        }}
                    >
                        &lt;&lt;
                    </Button>

                    <Button
                        variant="secondary"
                        className="me-2"
                        onClick={() => setShowDayPicker(true)}
                    >
                        {format(pickedDay, "dd-MM-yyyy")}
                    </Button>

                    <Button
                        variant="outline-secondary"
                        className="me-2"
                        onClick={() => {
                            setPickedDay(addDays(pickedDay, 1))
                            setSelectedBlock(null)
                        }}>
                        &gt;&gt;
                    </Button>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <div className="list-container mt-3">
                        {scheduleBlocks.map((block) => (
                            <ScheduleBlockListElement
                                key={block.id}
                                block={block}
                                onClick={(block) => setSelectedBlock(block)}
                                isSelected={selectedBlock?.id === block.id}
                            />
                        ))}
                    </div>
                </div>
                <div className="col-md-6 mt-3 px-4">
                    {selectedBlock &&
                        <div>
                            <div className="row">
                                <h2 className="col-md-6">{t("entities.block.details")}</h2>
                                <div className="col-md-6">
                                    <Button variant="secondary" className="me-2"
                                            onClick={() => {
                                                setBlockToEdit(selectedBlock)
                                                setShowBlockForm(true)
                                            }}>
                                        {t('buttons.edit_block')}
                                    </Button>
                                    <Button variant="danger"
                                            onClick={() => setShowDeleteBlockModal(true)}>
                                        {t('buttons.delete_block')}
                                    </Button>
                                </div>
                            </div>
                            <ScheduleBlockDetails block={selectedBlock}/>
                        </div>
                    }
                    <ScheduleTagAddressees
                        scheduleTagId={scheduleTagId}
                    />

                </div>
            </div>
            <h2>{t('entities.modification.plural')}</h2>
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
                {modifications.map((modification) => (
                    <tr key={modification.id}>
                        <td>{t('entities.modification.types.' + modification.type)}</td>
                        <td>{modification.blockName}</td>
                        <td>{modification.parameterName}</td>
                        <td>{modification.newValue}</td>
                        <td>{modification.oldValue}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    )
}

export default ScheduleTag
