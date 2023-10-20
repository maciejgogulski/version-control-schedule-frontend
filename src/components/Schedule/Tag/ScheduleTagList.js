import React, {useEffect, useState} from "react"
import {Button, Table} from "react-bootstrap"
import {useTranslation, withTranslation} from "react-i18next"
import ScheduleTagService from "../../../services/ScheduleTagService"
import ScheduleTagForm from "./ScheduleTagForm"
import ConfirmActionModal from "../../Modals/ConfirmActionModal"
import {useNavigate} from "react-router-dom";

function ScheduleTagList() {
    const navigate = useNavigate()
    const [scheduleTagService] = useState(new ScheduleTagService())
    const [scheduleTags, setScheduleTags] = useState([])
    const [showScheduleTagForm, setScheduleTagForm] = useState(false)
    const [selectedScheduleTag, setSelectedScheduleTag] = useState(null)
    const [showDeleteTagModal, setShowDeleteTagModal] = useState(false)

    useEffect(() => {
        fetchScheduleTags().then(r => console.log(r))
    }, [scheduleTagService])

    const fetchScheduleTags = async () => {
        const response = await scheduleTagService.getScheduleTags()
        const data = await response.json()

        if (response.ok) {
            setScheduleTags(data)
        } else {
            console.error('Error:', data)
        }
    }


    const handleTagFormButtonClick = (scheduleTag = null) => {
        setScheduleTagForm(true)
        if (scheduleTag) {
            setSelectedScheduleTag(scheduleTag)
        }
    }

    const handleCloseTagForm = () => {
        setScheduleTagForm(false)
        setSelectedScheduleTag(null)
    }

    const handleFormSubmit = async () => {
        await fetchScheduleTags()
    }

    const handleDeleteTagButtonClick = (scheduleTag = null) => {
        setSelectedScheduleTag(scheduleTag)
        setShowDeleteTagModal(true)
    }

    const handleDeleteTagClose = () => {
        setShowDeleteTagModal(false)
        setSelectedScheduleTag(null)
    }

    const handleTagDelete = async () => {
        await scheduleTagService.deleteScheduleTag(selectedScheduleTag.id)
        await fetchScheduleTags()

        setShowDeleteTagModal(false)
        setSelectedScheduleTag(null)
    }

    const redirectToScheduleTag = (tagId) => {
        navigate("/schedule/" + tagId)
    }

    const {t} = useTranslation()

    return (
        <div className="container">
            <ScheduleTagForm show={showScheduleTagForm}
                             onClose={handleCloseTagForm}
                             onFormSubmit={handleFormSubmit}
                             scheduleTag={selectedScheduleTag}
            />
            <ConfirmActionModal
                show={showDeleteTagModal}
                title={t("entities.tag.deleting_tag") + " " + selectedScheduleTag?.name}
                message={t("entities.tag.delete_tag_message", {name: selectedScheduleTag?.name})}
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
                        <Table responsive>
                            <thead>
                            <tr>
                                <th>{t('entities.tag.name')}</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {scheduleTags.map((tag) => (
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
