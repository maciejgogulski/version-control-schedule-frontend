import {useTranslation} from "react-i18next"

export default function BlockDetails(props) {
    const {t} = useTranslation();

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

            {props.parameters.map((parameter, index) => (
                index >= 3 && (
                    <div key={parameter.id} className="row">
                        <div className="col-md-6">
                            <p>{parameter.parameterName}</p>
                        </div>

                        <div className="col-md-6">
                            <p>{parameter.value}</p>
                        </div>
                    </div>
                )
            ))}

        </div>
    )
}
