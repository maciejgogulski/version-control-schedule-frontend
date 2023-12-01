import React, {useEffect, useState} from "react"
import {Button, Form, Modal} from "react-bootstrap"
import {useTranslation} from "react-i18next"
import ScheduleTagService from "../../../backend/services/ScheduleTagService"
import ScheduleTag from "../../../models/ScheduleTag"
import {useDependencies} from "../../../context/Dependencies";
import {useAuth} from "../../../context/Auth";

function ScheduleTagForm(props) {
    const {t} = useTranslation()
    const {getApiService, getToastUtils} = useDependencies()
    const {token} = useAuth()
    const apiService = getApiService()
    const toastUtils = getToastUtils()

    const initialState = {
        name: '',
        scheduleTagService: apiService.getScheduleTagService(token)
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

        let tag = (props.scheduleTag) ? props.scheduleTag : new ScheduleTag()
        tag.name = state.name

        try {
            if (tag.id) {
                await state.scheduleTagService.editScheduleTag(tag)
                toastUtils.showToast(
                    'success',
                    t('toast.success.edit-schedule')
                )
            } else {
                await state.scheduleTagService.addScheduleTag(tag)
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
                t('toast.error.submit-schedule')
            )
        }
    }

    useEffect(() => {
        updateState({name: (props.scheduleTag) ? props.scheduleTag.name : ''})
    }, [props.scheduleTag])

    return (
        <Modal show={props.show} onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{(props.scheduleTag) ? t('entities.tag.editing_tag') + ': ' + props.scheduleTag.name : t('entities.tag.creating_new_tag')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="name">
                        <Form.Label>{t('entities.tag.name')}:</Form.Label>
                        <Form.Control
                            type="text"
                            value={state.name}
                            onChange={handleNameChange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={(props.scheduleTag) ? "primary" : "success"} onClick={handleSubmit}>
                    {(props.scheduleTag) ? t('buttons.edit_schedule') : t('buttons.create_schedule')}
                </Button>
                <Button variant="secondary" onClick={props.onClose}>
                    {t('buttons.close')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ScheduleTagForm
