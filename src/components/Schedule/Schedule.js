import React from "react";
import ScheduleBlockListElement from "./ScheduleBlockListElement";
import ScheduleBlockDetails from "./ScheduleBlockDetails";

class Schedule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedBlock: null // Initialize selectedBlock to null
        };
    }

    handleBlockClick = (block) => {
        this.setState({selectedBlock: block}); // Update selectedBlock in the state
    };

    render() {
        const scheduleBlocks = [
            {id: 1, name: 'Bezpieczeństwo i ochrona danych - laboratorium', startDate: '11:15', endDate: '12:45'},
            {id: 2, name: 'Bezpieczeństwo i ochrona danych - wykład', startDate: '13:00', endDate: '14:30'},
            {id: 3, name: 'Programowanie urządzeń przenośnych - laboratorium', startDate: '14:45', endDate: '16:15'},
            {id: 4, name: 'Programowanie urządzeń przenośnych - wykład', startDate: '16:30', endDate: '18:00'},
        ];

        const {selectedBlock} = this.state;

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
