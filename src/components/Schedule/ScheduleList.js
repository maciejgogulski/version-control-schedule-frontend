import React, {useEffect, useState} from "react"
import {Button, Table} from "react-bootstrap"
import {useTranslation} from "react-i18next"
import ScheduleForm from "./ScheduleForm"
import ConfirmActionModal from "../Modals/ConfirmActionModal"
import {useNavigate} from "react-router-dom";
import {useDependencies} from "../../context/Dependencies";
import {useAuth} from "../../context/Auth";

export default function ScheduleList() {
    const navigate = useNavigate()
    const {t} = useTranslation()
    const {getApiService, getToastUtils} = useDependencies()
    const {token} = useAuth()
    const apiService = getApiService()
    const toastUtils = getToastUtils()

    const initialState = {
        scheduleService: apiService.getScheduleService(token),
        schedules: [],
        showScheduleForm: false,
        selectedSchedule: null,
        showDeleteScheduleModal: false
    }

    const [state, setState] = useState(initialState);

    const updateState = (updates) => {
        setState((prevState) => ({...prevState, ...updates}));
    };

    useEffect(() => {
        fetchSchedules()
    }, [state.scheduleService])

    const fetchSchedules = async () => {
        try {
            const data = await state.scheduleService.getSchedules()
            updateState({schedules: data})
        } catch (error) {
            toastUtils.showToast(
                'error',
                t('toast.error.fetch-schedules'),
            )
        }
    }

    const handleScheduleFormButtonClick = (schedule = null) => {
        updateState({showScheduleForm: true})
        if (schedule) {
            updateState({selectedSchedule: schedule})
        }
    }

    const handleCloseScheduleForm = () => {
        updateState({
            showScheduleForm: false,
            selectedSchedule: null
        })
    }

    const handleFormSubmit = async () => {
        await fetchSchedules()
    }

    const handleDeleteScheduleButtonClick = (schedule = null) => {
        updateState({
            selectedSchedule: schedule,
            showDeleteScheduleModal: true
        })
    }

    const handleDeleteScheduleClose = () => {
        updateState({
            selectedSchedule: null,
            showDeleteScheduleModal: false
        })
    }

    const handleScheduleDelete = async () => {
        try {
            await state.scheduleService.deleteSchedule(state.selectedSchedule.id)
            await fetchSchedules()

            updateState({
                selectedSchedule: null,
                showDeleteScheduleModal: false
            })

            toastUtils.showToast(
                'success',
                t('toast.success.delete-schedule')
            )
        } catch (error) {
            toastUtils.showToast(
                'error',
                t('toast.error.delete-schedule')
            )
        }
    }

    const redirectToSchedule = (scheduleId) => {
        navigate(`/schedule/${scheduleId}`)
    }

    return (
        <div className="container">
            <ScheduleForm show={state.showScheduleForm}
                          onClose={handleCloseScheduleForm}
                          onFormSubmit={handleFormSubmit}
                          schedule={state.selectedSchedule}
            />
            <ConfirmActionModal
                show={state.showDeleteScheduleModal}
                title={t("entities.schedule.deleting_schedule") + " " + state.selectedSchedule?.name}
                message={t("entities.schedule.delete_schedule_message", {name: state.selectedSchedule?.name})}
                action={handleScheduleDelete}
                variant={"danger"}
                onClose={handleDeleteScheduleClose}
            />
            <div className="row">
                <div className="col-md-12 px-4">
                    <h2>{t('navigation.schedules')} </h2>

                    <Button variant="success" className="mb-3"
                            onClick={() => handleScheduleFormButtonClick(null)}>
                        {t('buttons.create_schedule')}
                    </Button>

                    <Table responsive hover>
                        {state.schedules.length > 0
                            ? (
                                <>
                                    <thead>
                                    <tr>
                                        <th>{t('entities.schedule.name')}</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {state.schedules.map((schedule) => (
                                        <tr key={schedule.id}>
                                            <td className="user-select-none"
                                                onClick={() => redirectToSchedule(schedule.id)}>
                                                {schedule.name}
                                            </td>
                                            <td>
                                                <Button variant="secondary" className="me-2"
                                                        onClick={() => handleScheduleFormButtonClick(schedule)}>
                                                    {t('buttons.edit_schedule')}
                                                </Button>

                                                <Button variant="danger" className="me-2"
                                                        onClick={() => handleDeleteScheduleButtonClick(schedule)}>
                                                    {t('buttons.delete_schedule')}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </>
                            ) : (
                                <tbody>
                                <div className="alert alert-info" role="alert">
                                    {t('entities.schedule.no_schedules')}
                                </div>
                                </tbody>
                            )}
                    </Table>
                </div>
            </div>
        </div>
    )
}
