import React from "react";
import ScheduleBlockListElement from "./ScheduleBlockListElement";
import ScheduleBlockDetails from "./ScheduleBlockDetails";

class Schedule extends React.Component {
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 px-4">
                        <div>
                            <h2>Plan Rok_3_Semestr_6_2022/23_ST</h2>
                        </div>

                        <div>
                            <div className="list-container">
                                <ScheduleBlockListElement />
                                <ScheduleBlockListElement />
                                <ScheduleBlockListElement />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 px-4">
                        <h2>Szczegóły bloku</h2>

                        <div className="container">
                            <ScheduleBlockDetails />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Schedule;