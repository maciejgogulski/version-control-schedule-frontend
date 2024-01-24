import React, {useEffect, useState} from "react"
import BlockListElement from "../Block/BlockListElement"
import BlockDetails from "../Block/BlockDetails"
import {Button} from "react-bootstrap"
import BlockForm from "../Block/BlockForm"
import {parseFromServerFormat} from "../../utils/DateTimeParser"
import {addDays, format, parseISO, subDays} from "date-fns"
import DatePickerModal from "../Modals/DatePickerModal"
import {useTranslation} from "react-i18next"
import {useParams} from "react-router-dom"
import ConfirmActionModal from "../Modals/ConfirmActionModal"
import CommitVersionModal from "../Version/CommitVersionModal"
import {useAuth} from "../../context/Auth"
import {useDependencies} from "../../context/Dependencies"
import MultiplyBlockForm from "../Block/MultiplyBlockForm"
import MassEditRelatedBlocksForm from "../Block/MassEditRelatedBlocksForm";

function Schedule() {
    const {getApiService, getToastUtils} = useDependencies()
    const {token} = useAuth()
    const apiService = getApiService()
    const toastUtils = getToastUtils()

    const initialState = {
        scheduleService: apiService.getScheduleService(token),
        blockService: apiService.getBlockService(token),
        versionService: apiService.getVersionService(token),
        scheduleId: useParams().scheduleId,
        schedule: null,
        selectedBlock: null,
        blocks: [],
        showBlockForm: false,
        showDayPicker: false,
        pickedDay: new Date(),
        showDeleteBlockModal: false,
        showCommitVersionModal: false,
        blockToEdit: null,
        modifications: [],
        parameters: [],
        blockToMultiply: null,
        showMultiplyBlockForm: false,
        blockToMassEdit: null,
        showMassEditRelatedBlocksForm: false
    };

    const [state, setState] = useState(initialState);

    const updateState = (updates) => {
        setState((prevState) => ({...prevState, ...updates}));
    };

    useEffect(() => {
        fetchSchedule().then(() => {
            fetchBlocks()
            fetchModifications()
        })
    }, [state.pickedDay, state.scheduleId])

    useEffect(() => {
        if (state.selectedBlock) fetchParameters()
    }, [state.selectedBlock]);

    const fetchParameters = async () => {
        try {
            const data = await state.blockService.getParameters(state.selectedBlock.id)
            updateState({parameters: data})
        } catch (error) {
            toastUtils.showToast(
                'error',
                t('toast.error.fetch-parameters')
            )
        }
    }

    const fetchBlocks = async () => {
        try {
            const day = format(state.pickedDay, "yyyy-MM-dd HH:mm:ss")
            const data = await state.blockService.getBlocksByDay(
                state.scheduleId,
                day
            )

            data.forEach((block) => {
                block.startDate = parseFromServerFormat(block.startDate)
                block.endDate = parseFromServerFormat(block.endDate)
            })
            updateState({blocks: data})
        } catch (error) {
            toastUtils.showToast(
                'error',
                t('toast.error.fetch-blocks')
            )
        }
    }

    const fetchSchedule = async () => {
        try {
            const data = await state.scheduleService.getSchedule(state.scheduleId)
            updateState({schedule: data})
        } catch (error) {
            toastUtils.showToast(
                'error',
                t('toast.error.fetch-schedule')
            )
        }
    }

    const fetchModifications = async () => {
        try {
            const version = await fetchVersion()
            const data = await state.versionService.getModificationsForVersion(version.id)
            updateState({modifications: data})
        } catch (error) {
            toastUtils.showToast(
                'error',
                t('toast.error.fetch-modifications')
            )
        }
    }

    const fetchVersion = async () => {
        try {
            return await state.versionService.getLatestVersionForSchedule(state.scheduleId)
        } catch (error) {
            toastUtils.showToast(
                'error',
                t('toast.error.fetch-version')
            )
        }
    }

    const handleBlockDelete = async () => {
        try {
            await state.blockService.deleteBlock(state.selectedBlock.id)
            await fetchBlocks()

            updateState({
                showDeleteBlockModal: false,
                selectedBlock: null
            })

            toastUtils.showToast(
                'success',
                t('toast.success.delete-block')
            )

            await fetchModifications()
        } catch (error) {
            toastUtils.showToast(
                'error',
                t('toast.error.delete-block')
            )
        }
    }

    const {t} = useTranslation()

    return (
        <div className="container">
            <BlockForm
                show={state.showBlockForm}
                pickedDay={state.pickedDay}
                onClose={() => {
                    updateState({
                        showBlockForm: false,
                        blockToEdit: null
                    })
                }}
                onFormSubmit={async () => {
                    await fetchBlocks()
                    await fetchModifications()
                    await fetchParameters()
                    updateState({
                        blockToEdit: null
                    })
                }}
                scheduleId={state.scheduleId}
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

            <CommitVersionModal
                show={state.showCommitVersionModal}
                scheduleId={state.scheduleId}
                modifications={state.modifications}
                blocks={state.blocks}
                onClose={() => updateState({showCommitVersionModal: false})}
                onConfirm={() => fetchModifications()}
            />

            <MultiplyBlockForm
                show={state.showMultiplyBlockForm}
                onClose={() => {
                    updateState({
                        showMultiplyBlockForm: false,
                        blockToMultiply: null
                    })
                }}
                onFormSubmit={async () => {
                    await fetchBlocks()
                    await fetchModifications()
                    await fetchParameters()
                    updateState({
                        blockToMultiply: null
                    })
                }}
                scheduleId={state.scheduleId}
                blockToMultiply={state.blockToMultiply}
            />

            <MassEditRelatedBlocksForm
                show={state.showMassEditRelatedBlocksForm}
                onClose={() => {
                    updateState({
                        showMassEditRelatedBlocksForm: false,
                        blockToMassEdit: null
                    })
                }}
                onFormSubmit={async () => {
                    await fetchBlocks()
                    await fetchModifications()
                    await fetchParameters()
                    updateState({
                        blockToMassEdit: null
                    })
                }}
                scheduleId={state.scheduleId}
                blockToMassEdit={state.blockToMassEdit}
            />

            <div className="row">
                <h2>
                    {t("entities.schedule.title")} {state.schedule ? state.schedule.name : null}
                </h2>

                <div className="container">
                    <div className="btn-group">
                        <Button
                            variant="success"
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
                            onClick={() => updateState({showDayPicker: true})}
                        >
                            {format(state.pickedDay, "dd-MM-yyyy")}
                        </Button>

                        <Button
                            variant="outline-secondary"
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
            </div>
            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="list-container mt-3">
                        {state.blocks.length > 0 && state.blocks.map((block) => (
                            <BlockListElement
                                key={block.id}
                                block={block}
                                onClick={(block) => updateState({selectedBlock: block})}
                                isSelected={state.selectedBlock?.id === block.id}
                            />
                        ))}
                        {state.blocks.length === 0 && (
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
                                <h2 className="col-md-5">{t("entities.block.details")}</h2>
                                <div className="col-md-7">
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

                            <BlockDetails block={state.selectedBlock}
                                          parameters={state.parameters}/>

                            <div className="btn-group">
                                <Button variant="outline-success"
                                        onClick={() => {
                                            updateState({
                                                blockToMultiply: state.selectedBlock,
                                                showMultiplyBlockForm: true
                                            })
                                        }}>
                                    {t('buttons.multiply-block')}
                                </Button>

                                <Button variant="outline-secondary"
                                        onClick={() => {
                                            updateState({
                                                blockToMassEdit: state.selectedBlock,
                                                showMassEditRelatedBlocksForm: true
                                            })
                                        }}>
                                    {t('buttons.edit-related-blocks')}
                                </Button>
                            </div>
                        </div>
                    }
                </div>
            </div>
            {state.modifications.length > 0 && (
                <div className="alert alert-warning" role="alert">
                    <div className="d-flex flex-row">
                        <div
                            className="me-2 align-self-center">{t('entities.version.changes-made')}
                        </div>
                        <Button variant="success"
                                onClick={() => updateState({showCommitVersionModal: true})}>
                            {t('buttons.commit_version')}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Schedule
