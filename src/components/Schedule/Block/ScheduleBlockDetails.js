import React, {useEffect, useState} from "react"
import {useTranslation, withTranslation} from "react-i18next"
import ScheduleBlockService from "../../../services/ScheduleBlockService";

export default function ScheduleBlockDetails(props) {
    const [scheduleBlockService] = useState(new ScheduleBlockService())
    const [parameters, setParameters] = useState([])

    const {t} = useTranslation();

    const fetchParameters = async () => {
        const response = await scheduleBlockService.getParameters(props.block.id)
        const data = await response.json()

        if (response.ok) {
            setParameters(data)
        } else {
            console.error("Error:", data)
        }
    }

    useEffect(() => {
        fetchParameters()
    }, [scheduleBlockService, props.block.id]) // TODO fetch params after block form submit

    return (
        <div className="container bg-light rounded mb-3 px-5 py-3 shadow border-top border-primary border-5">
            <div>
                <h4>{props.block.name}</h4>
            </div>
            <hr className="my-1"/>
            <div className="row">
                <div className="col-md-6">
                    <p>{t('entities.block.start_date')}:</p>
                </div>

                <div className="col-md-6">
                    <p>{props.block.startDate}</p>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <p>{t('entities.block.end_date')}:</p>
                </div>

                <div className="col-md-6">
                    <p>{props.block.endDate}</p>
                </div>
            </div>

            {parameters.map((parameter) => (
                <div key={parameter.id} className="row">
                    <div className="col-md-6">
                        <p>{parameter.parameterName}</p>
                    </div>

                    <div className="col-md-6">
                        <p>{parameter.value}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
