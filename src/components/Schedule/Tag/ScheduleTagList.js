import React, {useEffect, useState} from "react"
import {Button, Table} from "react-bootstrap"
import {useTranslation, withTranslation} from "react-i18next"
import ScheduleTagService from "../../../backend/services/ScheduleTagService"
import ScheduleTagForm from "./ScheduleTagForm"
import ConfirmActionModal from "../../Modals/ConfirmActionModal"
import {useNavigate} from "react-router-dom";
import {useDependencies} from "../../../context/Dependencies";
import {useAuth} from "../../../context/Auth";

function ScheduleTagList() {
    const navigate = useNavigate()
    const {t} = useTranslation()
    const {getApiService, getToastUtils} = useDependencies()
    const {token} = useAuth()
    const apiService = getApiService()
    const toastUtils = getToastUtils()

    const initialState = {
        scheduleTagService: apiService.getScheduleTagService(token),
        scheduleTags: [],
        showScheduleTagForm: false,
        selectedScheduleTag: null,
        showDeleteTagModal: false
    }

    const [state, setState] = useState(initialState);

    const updateState = (updates) => {
        setState((prevState) => ({ ...prevState, ...updates }));
    };

    useEffect(() => {
        fetchScheduleTags()
    }, [state.scheduleTagService])

    const fetchScheduleTags = async () => {
        try {
            const data = await state.scheduleTagService.getScheduleTags()
            updateState({scheduleTags: data})
        } catch (error) {
            toastUtils.showToast(
                'error',
                'Unable to retrieve schedules',
            )
        }
    }

    const handleTagFormButtonClick = (scheduleTag = null) => {
        updateState({showScheduleTagForm: true})
        if (scheduleTag) {
            updateState({selectedScheduleTag: scheduleTag})
        }
    }

    const handleCloseTagForm = () => {
        updateState({
            showScheduleTagForm: false,
            selectedScheduleTag: null
        })
    }

    const handleFormSubmit = async () => {
        await fetchScheduleTags()
    }

    const handleDeleteTagButtonClick = (scheduleTag = null) => {
        updateState({
            selectedScheduleTag: scheduleTag,
            showDeleteTagModal: true
        })
    }

    const handleDeleteTagClose = () => {
        updateState({
            selectedScheduleTag: null,
            showDeleteTagModal: false
        })
    }

    const handleTagDelete = async () => {
        try {
            await state.scheduleTagService.deleteScheduleTag(state.selectedScheduleTag.id)
            await fetchScheduleTags()

            updateState({
                selectedScheduleTag: null,
                showDeleteTagModal: false
            })

            toastUtils.showToast(
                'success',
                t('toast.success.delete-tag')
            )
        } catch (error) {
            toastUtils.showToast(
                'error',
                t('toast.error.delete-tag')
            )
        }
    }

    const redirectToScheduleTag = (tagId) => {
        navigate(`/schedule/${tagId}`)
    }

    return (
        <div className="container">
            <ScheduleTagForm show={state.showScheduleTagForm}
                             onClose={handleCloseTagForm}
                             onFormSubmit={handleFormSubmit}
                             scheduleTag={state.selectedScheduleTag}
            />
            <ConfirmActionModal
                show={state.showDeleteTagModal}
                title={t("entities.tag.deleting_tag") + " " + state.selectedScheduleTag?.name}
                message={t("entities.tag.delete_tag_message", {name: state.selectedScheduleTag?.name})}
                action={handleTagDelete}
                variant={"danger"}
                onClose={handleDeleteTagClose}
            />
            <div className="row">
                <div className="col-md-12 px-4">
                    <div>
                        <h2>{t('navigation.schedules')} </h2>

                        <div className="container">
                            <Button variant="success" className="me-2"
                                    onClick={() => handleTagFormButtonClick(null)}>
                                {t('buttons.create_schedule')}
                            </Button>
                        </div>
                    </div>

                    <div>
                        <Table responsive hover>
                            <thead>
                            <tr>
                                <th>{t('entities.tag.name')}</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {state.scheduleTags.map((tag) => (
                                <tr key={tag.id}>
                                    <td className="user-select-none"
                                        onClick={() => redirectToScheduleTag(tag.id)}>
                                        {tag.name}
                                    </td>
                                    <td>
                                        <Button variant="secondary" className="me-2"
                                                onClick={() => handleTagFormButtonClick(tag)}>
                                            {t('buttons.edit_schedule')}
                                        </Button>

                                        <Button variant="danger" className="me-2"
                                                onClick={() => handleDeleteTagButtonClick(tag)}>
                                            {t('buttons.delete_schedule')}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withTranslation()(ScheduleTagList)
