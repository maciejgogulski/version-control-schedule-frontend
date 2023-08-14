import React from "react";
import ScheduleBlockListElement from "./ScheduleBlockListElement";
import ScheduleBlockDetails from "./ScheduleBlockDetails";
import ScheduleBlockService from "../../services/ScheduleBlockService";
import {Button} from "react-bootstrap";
import ScheduleBlockForm from "./ScheduleBlockForm";
import {parseFromServerFormat} from "../../util/DateTimeParser";
import {addDays, format, nextDay, parseISO, subDays} from "date-fns";
import DatePickerModal from "./DatePickerModal";

class Schedule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedBlock: null,
            scheduleBlocks: [],
            showBlockForm: false,
            showDayPicker: false,
            pickedDay: new Date()
        };
    }

    componentDidMount() {
        this.fetchScheduleBlocks();
    }

    fetchScheduleBlocks = async () => {
        const scheduleBlockService = new ScheduleBlockService();
        const tagId = 5;
        const day = format(this.state.pickedDay, "yyyy-MM-dd HH:mm:ss");
        const response = await scheduleBlockService.getScheduleBlocksByDay(tagId, day);
        const data = await response.json();

        if (response.ok) {
            data.forEach((block) => {
                block.startDate = parseFromServerFormat(block.startDate);
                block.endDate = parseFromServerFormat(block.endDate);
            })
            this.setState({scheduleBlocks: data});
        } else {
            console.error('Error:', data);
        }
    };

    handleBlockClick = (block) => {
        this.setState({selectedBlock: block}); // Update selectedBlock in the state
    };

    handleBlockFormButtonClick = () => {
        this.setState({showBlockForm: true})
    };

    handleCloseBlockForm = () => {
        this.setState({showBlockForm: false})
    };

    handlePickDayClick = () => {
        this.setState({showDayPicker: true})
    }

    handlePickDayClose = () => {
        this.setState({showDayPicker: false})
    }

    handlePreviousDayClick = () => {
        this.setState({pickedDay: subDays(this.state.pickedDay, 1), selectedBlock: null}, () => {
            this.fetchScheduleBlocks();
        })
    }

    handleNextDayClick = () => {
        this.setState({pickedDay: addDays(this.state.pickedDay, 1), selectedBlock: null}, () => {
            this.fetchScheduleBlocks();
        })
    }

    handleFormSubmit = async () => {
        await this.fetchScheduleBlocks();
    };

    handleDayPick = (day) => {
        this.setState({pickedDay: parseISO(day), selectedBlock: null}, () => {
            this.fetchScheduleBlocks();
        });
    };

    render() {
        const {selectedBlock, scheduleBlocks} = this.state;

        return (
            <div className="container">
                <ScheduleBlockForm show={this.state.showBlockForm}
                                   onClose={this.handleCloseBlockForm}
                                   onFormSubmit={this.handleFormSubmit}/>
                <DatePickerModal show={this.state.showDayPicker}
                                 onDayPick={this.handleDayPick}
                                 onClose={this.handlePickDayClose}
                />
                <div className="row">
                    <div className="col-md-6 px-4">
                        <div>
                            <h2>Plan Rok_3_Semestr_6_2022/23_ST</h2>

                            <div className="container">
                                <Button variant="primary" className="me-2"
                                        onClick={this.handleBlockFormButtonClick}>
                                    Dodaj blok
                                </Button>

                                <Button variant="outline-secondary" className="me-2"
                                        onClick={this.handlePreviousDayClick}>
                                    &lt;&lt;
                                </Button>

                                <Button variant="secondary" className="me-2"
                                        onClick={this.handlePickDayClick}>
                                    {format(this.state.pickedDay, "dd-MM-yyyy")}
                                </Button>

                                <Button variant="outline-secondary" className="me-2"
                                        onClick={this.handleNextDayClick}>
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
                                        onClick={this.handleBlockClick}
                                        isSelected={selectedBlock?.id === block.id}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 px-4">
                        <h2>Szczegóły bloku</h2>

                        <div className="container">
                            <ScheduleBlockDetails block={selectedBlock}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Schedule;
