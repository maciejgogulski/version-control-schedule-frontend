import React, {useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {format} from "date-fns";
import {useTranslation} from "react-i18next";

function DatePickerModal(props) {
    const { t } = useTranslation();
    const [pickedDate, setPickedDate] = useState(format(props.pickedDay, "yyyy-MM-dd"));

    const handleStartDateChange = (e) => {
        setPickedDate(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        props.onDayPick(pickedDate);
        props.onClose();
    };

    useEffect(() => {
        setPickedDate(format(props.pickedDay, "yyyy-MM-dd"));
    }, [props.pickedDay]);

    return (
        <Modal show={props.show} onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{t('entities.schedule.picking_date')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="pickedDate">
                        <Form.Control
                            type="date"
                            value={pickedDate}
                            onChange={handleStartDateChange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleSubmit}>
                    {t('buttons.pick_date')}
                </Button>
                <Button variant="secondary" onClick={props.onClose}>
                    {t('buttons.close')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DatePickerModal;
