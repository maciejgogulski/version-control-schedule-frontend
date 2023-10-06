import React, {useEffect, useState} from "react"
import ScheduleBlockListElement from "./ScheduleBlockListElement"
import ScheduleBlockDetails from "./ScheduleBlockDetails"
import ScheduleBlockService from "../../services/ScheduleBlockService"
import {Button} from "react-bootstrap"
import ScheduleBlockForm from "./ScheduleBlockForm"
import {parseFromServerFormat} from "../../util/DateTimeParser"
import {addDays, format, parseISO, subDays} from "date-fns"
import DatePickerModal from "./Modals/DatePickerModal"
import {useTranslation} from "react-i18next"
import ScheduleTagService from "../../services/ScheduleTagService"
import {useParams} from "react-router-dom"
import ConfirmActionModal from "./Modals/ConfirmActionModal";

function Schedule() {
    const [scheduleTagService] = useState(new ScheduleTagService())
    const [scheduleBlockService] = useState(new ScheduleBlockService())
    const {scheduleTagId} = useParams()
    const [scheduleTag, setScheduleTag] = useState(null)
    const [selectedBlock, setSelectedBlock] = useState(null)
    const [scheduleBlocks, setScheduleBlocks] = useState([])
    const [showBlockForm, setShowBlockForm] = useState(false)
    const [showDayPicker, setShowDayPicker] = useState(false)
    const [pickedDay, setPickedDay] = useState(new Date())
    const [showDeleteBlockModal, setShowDeleteBlockModal] = useState(false)
    const [blockToEdit, setBlockToEdit] = useState(null)


    useEffect(() => {
        fetchScheduleTag().then(() => fetchScheduleBlocks())
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

    const handleBlockClick = (block) => {
        setSelectedBlock(block)
    }

    const handleBlockFormButtonClick = (block) => {
        setShowBlockForm(true)
        if (block) {
            setBlockToEdit(block)
        }
    }

    const handleCloseBlockForm = () => {
        setShowBlockForm(false)
        setBlockToEdit(null)
    }

    const handlePickDayClick = () => {
        setShowDayPicker(true)
    }

    const handlePickDayClose = () => {
        setShowDayPicker(false)
    }

    const handlePreviousDayClick = () => {
        setPickedDay(subDays(pickedDay, 1))
        setSelectedBlock(null)
    }

    const handleNextDayClick = () => {
        setPickedDay(addDays(pickedDay, 1))
        setSelectedBlock(null)
    }

    const handleFormSubmit = async () => {
        await fetchScheduleBlocks()
        setBlockToEdit(null)
    }

    const handleDayPick = (day) => {
        setPickedDay(parseISO(day))
        setSelectedBlock(null)
    }

    const handleDeleteBlockClick = () => {
        setShowDeleteBlockModal(true)
    }

    const handleDeleteBlockClose = () => {
        setShowDeleteBlockModal(false)
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
                onClose={handleCloseBlockForm}
                onFormSubmit={handleFormSubmit}
                scheduleTagId={scheduleTagId}
                blockToEdit={blockToEdit}
            />
            <DatePickerModal
                show={showDayPicker}
                pickedDay={pickedDay}
                onDayPick={handleDayPick}
                onClose={handlePickDayClose}
            />
            <ConfirmActionModal
                show={showDeleteBlockModal}
                title={t("entities.block.deleting_block") + " " + selectedBlock?.name }
                message={t("entities.block.delete_block_message", {name: selectedBlock?.name})}
                action={handleBlockDelete}
                variant={"danger"}
                onClose={handleDeleteBlockClose}
            />
            <div className="row">
                <div className="col-md-6 px-4">
                    <div>
                        <h2>
                            {t("entities.schedule.title")} {scheduleTag ? scheduleTag.name : null}
                        </h2>

                        <div className="container">
                            <Button
                                variant="success"
                                className="me-2"
                                onClick={() => handleBlockFormButtonClick(null)}
                            >
                                {t("buttons.create_block")}
                            </Button>

                            <Button
                                variant="outline-secondary"
                                className="me-2"
                                onClick={handlePreviousDayClick}
                            >
                                &lt;&lt;
                            </Button>

                            <Button
                                variant="secondary"
                                className="me-2"
                                onClick={handlePickDayClick}
                            >
                                {format(pickedDay, "dd-MM-yyyy")}
                            </Button>

                            <Button
                                variant="outline-secondary"
                                className="me-2"
                                onClick={handleNextDayClick}
                            >
                                &gt;&gt;
                            </Button>
                        </div>
                    </div>

                    <div>
                        <div className="list-container">
                            {scheduleBlocks.map((block) => (
                                <ScheduleBlockListElement
                                    key={block.id}
                                    block={block}
                                    onClick={handleBlockClick}
                                    isSelected={selectedBlock?.id === block.id}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                { selectedBlock &&
                    <div className="col-md-6 px-4">
                        <h2>{t("entities.block.details")}</h2>

                        <div className="container">
                            <ScheduleBlockDetails block={selectedBlock}/>
                            <Button variant="secondary" className="me-2"
                                    onClick={() => handleBlockFormButtonClick(selectedBlock)}>
                                {t('buttons.edit_block')}
                            </Button>
                            <Button variant="danger"
                                    onClick={() => handleDeleteBlockClick(selectedBlock)}>
                                {t('buttons.delete_block')}
                            </Button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Schedule
