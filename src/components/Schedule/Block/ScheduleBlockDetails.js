import React from "react"
import {withTranslation} from "react-i18next"

class ScheduleBlockDetails extends React.Component {
    render() {
        const {block, t} = this.props

        if (!block) {
            return null
        }

        return (
            <div className="container bg-light rounded mb-3 px-5 py-3 shadow border-top border-primary border-5">
                <div>
                    <h4>{block.name}</h4>
                </div>
                <hr className="my-1"/>
                <div className="row">
                    <div className="col-md-6">
                        <p>{t('entities.block.start_date')}:</p>
                    </div>

                    <div className="col-md-6">
                        <p>{block.startDate}</p>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <p>{t('entities.block.end_date')}:</p>
                    </div>

                    <div className="col-md-6">
                        <p>{block.endDate}</p>
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
        )
    }
}

export default withTranslation()(ScheduleBlockDetails)