import React, {useEffect, useState} from "react"
import {Button, Form, Modal} from "react-bootstrap"
import {useTranslation} from "react-i18next"
import ScheduleService from "../../backend/services/ScheduleService"
import Schedule from "../../models/Schedule"
import {useDependencies} from "../../context/Dependencies";
import {useAuth} from "../../context/Auth";

function ScheduleForm(props) {
    const {t} = useTranslation()
    const {getApiService, getToastUtils} = useDependencies()
    const {token} = useAuth()
    const apiService = getApiService()
    const toastUtils = getToastUtils()

    const initialState = {
        name: '',
        scheduleService: apiService.getScheduleService(token)
    }

    const [state, setState] = useState(initialState);

    const updateState = (updates) => {
        setState((prevState) => ({...prevState, ...updates}));
    };

    const handleNameChange = (e) => {
        updateState({name: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        let schedule = (props.schedule) ? props.schedule: new Schedule()
        schedule.name = state.name

        try {
            if (schedule.id) {
                await state.scheduleService.editSchedule(schedule)
                toastUtils.showToast(
                    'success',
                    t('toast.success.edit-schedule')
                )
            } else {
                await state.scheduleService.addSchedule(schedule)
                toastUtils.showToast(
                    'success',
                    t('toast.success.add-schedule')
                )
            }

            updateState({name: ''})
            props.onClose()
            props.onFormSubmit()
        } catch (error) {
            toastUtils.showToast(
                'error',
                t('toast.error.submit')
            )
        }
    }

    useEffect(() => {
        updateState({name: (props.schedule) ? props.schedule.name : ''})
    }, [props.schedule])

    return (
        <Modal show={props.show} onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{(props.schedule) ? t('entities.schedule.editing_schedule') + ': ' + props.schedule.name : t('entities.schedule.creating_new_schedule')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="name">
                        <Form.Label>{t('entities.schedule.name')}:</Form.Label>
                        <Form.Control
                            type="text"
                            value={state.name}
                            onChange={handleNameChange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={(props.schedule) ? "primary" : "success"} onClick={handleSubmit}>
                    {(props.schedule) ? t('buttons.edit_schedule') : t('buttons.create_schedule')}
                </Button>
                <Button variant="secondary" onClick={props.onClose}>
                    {t('buttons.close')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ScheduleForm
