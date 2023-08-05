import React from "react";
import ScheduleBlockListElement from "./ScheduleBlockListElement";
import ScheduleBlockDetails from "./ScheduleBlockDetails";
import ScheduleBlockService from "../../services/ScheduleBlockService";
import { Button } from "react-bootstrap";
import ScheduleBlockForm from "./ScheduleBlockForm";
import {parseFromServerFormat} from "../../util/DateTimeParser";

class Schedule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedBlock: null,
            scheduleBlocks: [],
            showBlockForm: false
        };
    }

    componentDidMount() {
        this.fetchScheduleBlocks();
    }

    fetchScheduleBlocks = async () => {
        const scheduleBlockService = new ScheduleBlockService();
        const tagId = 5;
        const day = '2023-06-13 00:00:00';
        const response = await scheduleBlockService.getScheduleBlocksByDay(tagId, day);
        const data = await response.json();

        if (response.ok) {
            data.forEach((block) => {
                block.startDate = parseFromServerFormat(block.startDate);
                block.endDate = parseFromServerFormat(block.endDate);
            })
            this.setState({ scheduleBlocks: data });
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

    handleFormSubmit = async () => {
        await this.fetchScheduleBlocks();
    };

        render() {
        const { selectedBlock, scheduleBlocks } = this.state;

        return (
            <div className="container">
                <ScheduleBlockForm show={this.state.showBlockForm}
                                   onClose={this.handleCloseBlockForm}
                                   onFormSubmit={this.handleFormSubmit}/>
                <div className="row">
                    <div className="col-md-6 px-4">
                        <div>
                            <h2>Plan Rok_3_Semestr_6_2022/23_ST</h2>

                            <Button variant="primary"
                                    onClick={this.handleBlockFormButtonClick}>
                                Dodaj blok
                            </Button>
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
