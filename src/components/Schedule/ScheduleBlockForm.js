import React, {useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import ScheduleBlockService from "../../services/ScheduleBlockService";
import ScheduleBlock from "../../models/ScheduleBlock";
import { parseToServerFormat } from "../../util/DateTimeParser";

function ScheduleBlockForm(props) {
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const scheduleBlockService = new ScheduleBlockService();

        let block = new ScheduleBlock();
        block.scheduleTagId = 5;
        block.name = name;

        // Parse startDate and endDate to the desired format

        block.startDate = parseToServerFormat(startDate);
        block.endDate = parseToServerFormat(endDate);

        await scheduleBlockService.addScheduleBlock(block);

        // Reset the form fields
        setName("");
        setStartDate("");
        setEndDate("");
        // Close the form popup
        props.onClose();
        props.onFormSubmit();
    };

    return (
        <Modal show={props.show} onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Tworzenie nowego bloku</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="name">
                        <Form.Label>Nazwa</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={handleNameChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="startDate">
                        <Form.Label>Data rozpoczęcia</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={startDate}
                            onChange={handleStartDateChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="endDate">
                        <Form.Label>Data zakończenia</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={endDate}
                            onChange={handleEndDateChange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleSubmit}>
                    Dodaj blok
                </Button>
                <Button variant="secondary" onClick={props.onClose}>
                    Zamknij
                </Button>
                {/* Add additional buttons or actions if needed */}
            </Modal.Footer>
        </Modal>
    );
}

export default ScheduleBlockForm;
