import React, {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {useTranslation, withTranslation} from "react-i18next";
import ScheduleTagService from "../../services/ScheduleTagService";
import {Link} from "react-router-dom";
import ScheduleTagForm from "./ScheduleTagForm";
import ConfirmActionModal from "./Modals/ConfirmActionModal";

function ScheduleTagList() {
    const [scheduleTagService] = useState(new ScheduleTagService());
    const [scheduleTags, setScheduleTags] = useState([]);
    const [showScheduleTagForm, setScheduleTagForm] = useState(false);
    const [selectedScheduleTag, setSelectedScheduleTag] = useState(null);
    const [showDeleteTagModal, setShowDeleteTagModal] = useState(false)


    useEffect(() => {
        fetchScheduleTags();
    }, []);

    const fetchScheduleTags = async () => {
        const response = await scheduleTagService.getScheduleTags();
        const data = await response.json();

        if (response.ok) {
            setScheduleTags(data);
        } else {
            console.error('Error:', data);
        }
    };


    const handleTagFormButtonClick = (scheduleTag = null) => {
        setScheduleTagForm(true);
        if (scheduleTag) {
            setSelectedScheduleTag(scheduleTag)
        }
    };

    const handleCloseTagForm = () => {
        setScheduleTagForm(false);
        setSelectedScheduleTag(null);
    };

    const handleFormSubmit = async () => {
        await fetchScheduleTags();
    };

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

    const {t} = useTranslation();

    return (
        <div className="container">
            <ScheduleTagForm show={showScheduleTagForm}
                             onClose={handleCloseTagForm}
                             onFormSubmit={handleFormSubmit}
                             scheduleTag={selectedScheduleTag}
            />
            <ConfirmActionModal
                show={showDeleteTagModal}
                title={t("entities.tag.deleting_tag") + " " + selectedScheduleTag?.name }
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
                        <div className="container">
                            {scheduleTags.map((tag) => (
                                <div className="row">
                                    <div className="col-sm-6 mb-2">
                                        <Link className="text-decoration-none text-dark" to={tag.id.toString()}
                                              key={tag.id}>
                                            {tag.name}
                                        </Link>
                                    </div>
                                    <div className="col-sm-6">
                                        <Button variant="secondary" className="me-2"
                                                onClick={() => handleTagFormButtonClick(tag)}>
                                            {t('buttons.edit_schedule')}
                                        </Button>

                                        <Button variant="danger" className="me-2"
                                                onClick={() => handleDeleteTagButtonClick(tag)}>
                                            {t('buttons.delete_schedule')}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
        ;
}

export default withTranslation()(ScheduleTagList);
