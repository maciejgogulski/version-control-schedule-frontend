import React from "react";
import ScheduleBlockListElement from "./ScheduleBlockListElement";

class Schedule extends React.Component {
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <div>
                            <h1>Plan Rok_3_Semestr_6_2022/23_ST</h1>
                        </div>

                        <div>
                            <div className="list-container">
                                <ScheduleBlockListElement />
                                <ScheduleBlockListElement />
                                <ScheduleBlockListElement />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <h2>Szczegóły bloku</h2>
                    </div>
                </div>
            </div>
        );
    }
}

export default Schedule;