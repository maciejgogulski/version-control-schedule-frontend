import React, {useEffect, useState} from "react";
import ScheduleBlockListElement from "./ScheduleBlockListElement";
import ScheduleBlockDetails from "./ScheduleBlockDetails";
import ScheduleBlockService from "../../services/ScheduleBlockService";
import {Button} from "react-bootstrap";
import ScheduleBlockForm from "./ScheduleBlockForm";
import {parseFromServerFormat} from "../../util/DateTimeParser";
import {addDays, format, parseISO, subDays} from "date-fns";
import DatePickerModal from "./DatePickerModal";
import {useTranslation} from "react-i18next";
import ScheduleTagService from "../../services/ScheduleTagService";
import {useParams} from "react-router-dom";

function Schedule() {
    const [scheduleTagService] = useState(new ScheduleTagService());
    const [scheduleBlockService] = useState(new ScheduleBlockService());
    const {scheduleTagId} = useParams();
    const [scheduleTag, setScheduleTag] = useState(null);
    const [selectedBlock, setSelectedBlock] = useState(null);
    const [scheduleBlocks, setScheduleBlocks] = useState([]);
    const [showBlockForm, setShowBlockForm] = useState(false);
    const [showDayPicker, setShowDayPicker] = useState(false);
    const [pickedDay, setPickedDay] = useState(new Date());

    useEffect(() => {
        fetchScheduleTag().then(() => fetchScheduleBlocks());
    }, [pickedDay, scheduleTagId]);

    const fetchScheduleBlocks = async () => {
        const day = format(pickedDay, "yyyy-MM-dd HH:mm:ss");
        const response = await scheduleBlockService.getScheduleBlocksByDay(
            scheduleTagId,
            day
        );
        const data = await response.json();

        if (response.ok) {
            data.forEach((block) => {
                block.startDate = parseFromServerFormat(block.startDate);
                block.endDate = parseFromServerFormat(block.endDate);
            });
            setScheduleBlocks(data);
        } else {
            console.error("Error:", data);
        }
    };

    const fetchScheduleTag = async () => {
        const response = await scheduleTagService.getScheduleTag(scheduleTagId);
        const data = await response.json();

        if (response.ok) {
            setScheduleTag(data);
        } else {
            console.error("Error:", data);
        }
    };

    const handleBlockClick = (block) => {
        setSelectedBlock(block);
    };

    const handleBlockFormButtonClick = () => {
        setShowBlockForm(true);
    };

    const handleCloseBlockForm = () => {
        setShowBlockForm(false);
    };

    const handlePickDayClick = () => {
        setShowDayPicker(true);
    };

    const handlePickDayClose = () => {
        setShowDayPicker(false);
    };

    const handlePreviousDayClick = () => {
        setPickedDay(subDays(pickedDay, 1));
        setSelectedBlock(null);
    };

    const handleNextDayClick = () => {
        setPickedDay(addDays(pickedDay, 1));
        setSelectedBlock(null);
    };

    const handleFormSubmit = async () => {
        await fetchScheduleBlocks();
    };

    const handleDayPick = (day) => {
        setPickedDay(parseISO(day));
        setSelectedBlock(null);
    };

    const {t} = useTranslation();

    return (
        <div className="container">
            <ScheduleBlockForm
                show={showBlockForm}
                pickedDay={pickedDay}
                onClose={handleCloseBlockForm}
                onFormSubmit={handleFormSubmit}
                scheduleTagId={scheduleTagId}
            />
            <DatePickerModal
                show={showDayPicker}
                pickedDay={pickedDay}
                onDayPick={handleDayPick}
                onClose={handlePickDayClose}
            />
            <div className="row">
                <div className="col-md-6 px-4">
                    <div>
                        <h2>
                            {t("entities.schedule.title")} {scheduleTag ? scheduleTag.name : null}
                        </h2>

                        <div className="container">
                            <Button
                                variant="primary"
                                className="me-2"
                                onClick={handleBlockFormButtonClick}
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
                <div className="col-md-6 px-4">
                    <h2>{t("entities.block.details")}</h2>

                    <div className="container">
                        <ScheduleBlockDetails block={selectedBlock}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Schedule;
