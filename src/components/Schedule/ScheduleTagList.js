import React, {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {useTranslation, withTranslation} from "react-i18next";
import ScheduleTagService from "../../services/ScheduleTagService";
import {Link} from "react-router-dom";
import ScheduleTagForm from "./ScheduleTagForm";

function ScheduleTagList() {
    const [scheduleTagService] = useState(new ScheduleTagService());
    const [scheduleTags, setScheduleTags] = useState([]);
    const [showScheduleTagForm, setScheduleTagForm] = useState(false);
    const [selectedScheduleTag, setSelectedScheduleTag] = useState(null);

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

    const {t} = useTranslation();

    return (
        <div className="container">
            <ScheduleTagForm show={showScheduleTagForm}
                             onClose={handleCloseTagForm}
                             onFormSubmit={handleFormSubmit}
                             scheduleTag={selectedScheduleTag}
            />
            <div className="row">
                <div className="col-md-6 px-4">
                    <div>
                        <h2>{t('navigation.schedules')} </h2>

                        <div className="container">
                            <Button variant="primary" className="me-2"
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
                                        <Button variant="secondary" className="col-sm-6 me-2"
                                                onClick={() => handleTagFormButtonClick(tag)}>
                                            {t('buttons.edit_schedule')}
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
