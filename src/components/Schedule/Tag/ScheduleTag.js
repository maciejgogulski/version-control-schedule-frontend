import React, {useEffect, useState} from "react"
import ScheduleBlockListElement from "../Block/ScheduleBlockListElement"
import ScheduleBlockDetails from "../Block/ScheduleBlockDetails"
import {Button} from "react-bootstrap"
import ScheduleBlockForm from "../Block/ScheduleBlockForm"
import {parseFromServerFormat} from "../../../utils/DateTimeParser"
import {addDays, format, parseISO, subDays} from "date-fns"
import DatePickerModal from "../../Modals/DatePickerModal"
import {useTranslation} from "react-i18next"
import {useParams} from "react-router-dom"
import ConfirmActionModal from "../../Modals/ConfirmActionModal"
import CommitStagedEventModal from "../StagedEvent/CommitStagedEventModal"
import {useAuth} from "../../../context/Auth"
import {useDependencies} from "../../../context/Dependencies"

function ScheduleTag() {
    const {getApiService, getToastUtils} = useDependencies()
    const {token} = useAuth()
    const apiService = getApiService()

    const initialState = {
        scheduleTagService: apiService.getScheduleTagService(token),
        scheduleBlockService: apiService.getScheduleBlockService(token),
        stagedEventService: apiService.getStagedEventService(token),
        scheduleTagId: useParams().scheduleTagId,
        scheduleTag: null,
        selectedBlock: null,
        scheduleBlocks: [],
        showBlockForm: false,
        showDayPicker: false,
        pickedDay: new Date(),
        showDeleteBlockModal: false,
        showCommitStagedEventModal: false,
        blockToEdit: null,
        modifications: [],
        parameters: [],
    };

    const [state, setState] = useState(initialState);

    const updateState = (updates) => {
        setState((prevState) => ({ ...prevState, ...updates }));
    };

    useEffect(() => {
        fetchScheduleTag().then(() => {
            fetchScheduleBlocks()
            fetchModifications()
        })
    }, [state.pickedDay, state.scheduleTagId])

    useEffect(() => {
        if (state.selectedBlock) fetchParameters()
    }, [state.selectedBlock]);

    const fetchParameters = async () => {
        const response = await state.scheduleBlockService.getParameters(state.selectedBlock.id)
        const data = await response.json()

        if (response.ok) {
            updateState({parameters : data})
        } else {
            console.error("Error:", data)
        }
    }

    const fetchScheduleBlocks = async () => {
        const day = format(state.pickedDay, "yyyy-MM-dd HH:mm:ss")
        const response = await state.scheduleBlockService.getScheduleBlocksByDay(
            state.scheduleTagId,
            day
        )
        const data = await response.json()

        if (response.ok) {
            data.forEach((block) => {
                block.startDate = parseFromServerFormat(block.startDate)
                block.endDate = parseFromServerFormat(block.endDate)
            })
            updateState({scheduleBlocks: data})
        } else {
            console.error("Error:", data)
        }
    }

    const fetchScheduleTag = async () => {
        const response = await state.scheduleTagService.getScheduleTag(state.scheduleTagId)
        const data = await response.json()

        if (response.ok) {
            updateState({scheduleTag: data})
        } else {
            console.error("Error:", data)
        }
    }

    const fetchModifications = async () => {
        const stagedEvent = await fetchStagedEvent()

        const response = await state.stagedEventService.getModificationsForStagedEvent(stagedEvent.id)
        const data = await response.json()

        if (response.ok) {
            updateState({modifications: data})
        } else {
            console.error("Error:", data)
        }
    }

    const fetchStagedEvent = async () => {
        const response = await state.stagedEventService.getLatestStagedEventForSchedule(state.scheduleTagId)
        const data = await response.json()

        if (response.ok) {
            return data
        } else {
            console.error("Error:", data)
        }
    }

    const handleBlockDelete = async () => {
        await state.scheduleBlockService.deleteScheduleBlock(state.selectedBlock.id)
        await fetchScheduleBlocks()

        updateState({
            showDeleteBlockModal: false,
            selectedBlock: null
        })
    }

    const {t} = useTranslation()

    return (
        <div className="container">
            <ScheduleBlockForm
                show={state.showBlockForm}
                pickedDay={state.pickedDay}
                onClose={() => {
                    updateState({
                        showBlockForm: false,
                        blockToEdit: null
                    })
                }}
                onFormSubmit={async () => {
                    await fetchScheduleBlocks()
                    await fetchModifications()
                    await fetchParameters()
                    updateState({
                        blockToEdit: null
                    })
                }}
                scheduleTagId={state.scheduleTagId}
                blockToEdit={state.blockToEdit}
            />

            <DatePickerModal
                show={state.showDayPicker}
                pickedDay={state.pickedDay}
                onDayPick={(day) => {
                    updateState({
                        pickedDay: parseISO(day),
                        selectedBlock: null
                    })
                }}
                onClose={() => updateState({showDayPicker: false})}
            />

            <ConfirmActionModal
                show={state.showDeleteBlockModal}
                title={t("entities.block.deleting_block") + " " + state.selectedBlock?.name}
                message={t("entities.block.delete_block_message", {name: state.selectedBlock?.name})}
                action={handleBlockDelete}
                variant={"danger"}
                onClose={() => updateState({showDeleteBlockModal: false})}
            />

            <CommitStagedEventModal
                show={state.showCommitStagedEventModal}
                scheduleTagId={state.scheduleTagId}
                modifications={state.modifications}
                onClose={() => updateState({showCommitStagedEventModal: false})}
            />

            <div className="row">
                <h2>
                    {t("entities.schedule.title")} {state.scheduleTag ? state.scheduleTag.name : null}
                </h2>

                <div className="container">
                    <Button
                        variant="success"
                        className="me-2"
                        onClick={() => {
                            updateState({
                                blockToEdit: null,
                                showBlockForm: true
                            })
                        }}
                    >
                        {t("buttons.create_block")}
                    </Button>

                    <Button
                        variant="outline-secondary"
                        className="me-2"
                        onClick={() => {
                            updateState({
                                pickedDay: subDays(state.pickedDay, 1),
                                selectedBlock: null
                            })
                        }}
                    >
                        &lt;&lt;
                    </Button>

                    <Button
                        variant="secondary"
                        className="me-2"
                        onClick={() => updateState({showDayPicker: true})}
                    >
                        {format(state.pickedDay, "dd-MM-yyyy")}
                    </Button>

                    <Button
                        variant="outline-secondary"
                        className="me-2"
                        onClick={() => {
                            updateState({
                                pickedDay: addDays(state.pickedDay, 1),
                                selectedBlock: null
                            })
                        }}>
                        &gt;&gt;
                    </Button>
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="list-container mt-3">
                        {state.scheduleBlocks.length > 0 && state.scheduleBlocks.map((block) => (
                            <ScheduleBlockListElement
                                key={block.id}
                                block={block}
                                onClick={(block) => updateState({selectedBlock: block})}
                                isSelected={state.selectedBlock?.id === block.id}
                            />
                        ))}
                        {state.scheduleBlocks.length === 0 && (
                            <div className="alert alert-info" role="alert">
                                {t('entities.block.no_blocks_in_day')}
                            </div>
                        )
                        }
                    </div>
                </div>
                <div className="col-md-6 mt-3 px-4">
                    {state.selectedBlock &&
                        <div>
                            <div className="row">
                                <h2 className="col-md-6">{t("entities.block.details")}</h2>
                                <div className="col-md-6">
                                    <Button variant="secondary" className="me-2"
                                            onClick={() => {
                                                updateState({
                                                    blockToEdit: state.selectedBlock,
                                                    showBlockForm: true
                                                })
                                            }}>
                                        {t('buttons.edit_block')}
                                    </Button>
                                    <Button variant="danger"
                                            onClick={() => updateState({showDeleteBlockModal: true})}>
                                        {t('buttons.delete_block')}
                                    </Button>
                                </div>
                            </div>
                            <ScheduleBlockDetails block={state.selectedBlock}
                                                  parameters={state.parameters}/>
                        </div>
                    }
                </div>
            </div>
            {state.modifications.length > 0 && (
                <div className="alert alert-warning" role="alert">
                    <div className="d-flex flex-row">
                        <div
                            className="me-2 align-self-center">{t('entities.modification.changes_made') + ': '}<strong>{state.modifications.length}</strong>
                        </div>
                        <Button variant="success"
                                onClick={() => updateState({showCommitStagedEventModal: true})}>
                            {t('buttons.commit_staged_event')}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ScheduleTag
