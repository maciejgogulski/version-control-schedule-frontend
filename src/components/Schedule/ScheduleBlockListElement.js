import React from "react";

class ScheduleBlockListElement extends React.Component {
    render() {
        return (
            <div className="container bg-light rounded m-3 px-5 py-3 shadow border-start border-primary border-5">
                <div>
                    <h4>Bezpieczeństwo i ochrona danych - laboratorium</h4>
                    <p className="text-warning">11:15 - 12:45</p>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <p className="text-info text-decoration-underline">Szczegóły</p>
                    </div>

                    <div className="col-md-6">
                        <p>Dr inż. Roman Kowalski</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default ScheduleBlockListElement;