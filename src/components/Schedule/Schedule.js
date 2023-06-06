import React from "react";
import ScheduleBlockListElement from "./ScheduleBlockListElement";
import ScheduleBlockDetails from "./ScheduleBlockDetails";
import ScheduleBlockService from "../../services/ScheduleBlockService";

class Schedule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedBlock: null,
            scheduleBlocks: [],
        };
    }

    async componentDidMount() {
        // Fetch schedule blocks from the service
        const scheduleBlockService = new ScheduleBlockService();
        const tagId = 5;
        const day = '2023-06-13 00:00:00';
        const response = await scheduleBlockService.getScheduleBlocksByDay(tagId, day);
        const data = await response.json();

        if (response.ok) {
            this.setState({ scheduleBlocks: data });
        } else {
            console.error('Error:', data);
        }
    }

    handleBlockClick = (block) => {
        this.setState({selectedBlock: block}); // Update selectedBlock in the state
    };

    render() {
        const { selectedBlock, scheduleBlocks } = this.state;

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 px-4">
                        <div>
                            <h2>Plan Rok_3_Semestr_6_2022/23_ST</h2>
                        </div>

                        <div>
                            <div className="list-container">
                                {/* Map over the scheduleBlocks array and render ScheduleBlockListElement for each block */}
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
