import React from "react";

class ScheduleBlockDetails extends React.Component {
    render() {
        return (
            <div className="container">
                <div className="container bg-light rounded m-3 px-5 py-3 shadow border-top border-primary border-5">
                    <div>
                        <h4>Bezpieczeństwo i ochrona danych - laboratorium</h4>
                    </div>
                    <hr className="my-1"/>
                    <div className="row">
                        <div className="col-md-6">
                            <p>Data rozpoczęcia:</p>
                        </div>

                        <div className="col-md-6">
                            <p>26 września 2023 11:15</p>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <p>Data zakończenia:</p>
                        </div>

                        <div className="col-md-6">
                            <p>26 września 2023 12:45</p>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <p>Prowadzący:</p>
                        </div>

                        <div className="col-md-6">
                            <p>Dr Inż. Roman Kowalski</p>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <p>Sala:</p>
                        </div>

                        <div className="col-md-6">
                            <p>CO 3</p>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <p>Forma zajęć:</p>
                        </div>

                        <div className="col-md-6">
                            <p>Stacjonarne</p>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <p>Grupa laboratoryjna:</p>
                        </div>

                        <div className="col-md-6">
                            <p>1</p>
                        </div>
                    </div>
                </div>

                <div className="container bg-light rounded m-3 px-5 py-3 shadow">
                    <div>
                        <h4>Adresaci</h4>
                    </div>
                    <hr className="my-1"/>
                    <div className="row">
                        <div className="col-md-6">
                            <h5>Grupy</h5>
                            <hr className="my-1"/>
                        </div>

                        <div className="col-md-6">
                            <h5>Osoby</h5>
                            <hr className="my-1"/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <p>Rok 3 L1</p>
                        </div>

                        <div className="col-md-6">
                            <p>Krystian Marczuk</p>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <p>Rok 3 L2</p>
                        </div>

                        <div className="col-md-6">
                            <p>Elżbieta Szmyt</p>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <p>Rok 3 Wykładowcy</p>
                        </div>

                        <div className="col-md-6">
                            <p>Tomasz Polak</p>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <p>Dziekanat</p>
                        </div>

                        <div className="col-md-6">
                            <p>Hubert Opolski</p>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default ScheduleBlockDetails;