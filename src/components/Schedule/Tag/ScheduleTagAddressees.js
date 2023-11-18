import {useEffect, useState} from "react"
import {useTranslation} from "react-i18next"
import AddresseeService from "../../../services/AddresseeService"
import {Button} from "react-bootstrap"
import AssignAddresseeToScheduleTagForm from "./AssignAddresseeToScheduleTagForm"

export default function ScheduleTagAddressees(props) {
    const [addresseeService] = useState(new AddresseeService())
    const [addressees, setAddressees] = useState([])
    const [showAssignToScheduleForm, setShowAssignToScheduleForm] = useState(false)
    const {t} = useTranslation()

    async function fetchAddressees(id) {
        const response = await addresseeService.getAddresseesForScheduleTagId(id)
        const data = await response.json()

        if (response.ok) {
            setAddressees(data)
        } else {
            console.error('Error:', data)
        }
    }

    useEffect(() => {
        fetchAddressees(props.scheduleTagId)
    }, [props.scheduleTagId])

    return (
        <div>
            <AssignAddresseeToScheduleTagForm show={showAssignToScheduleForm}
                                              onClose={() => setShowAssignToScheduleForm(false)}
                                              onFormSubmit={async () => fetchAddressees(props.scheduleTagId)}
                                              scheduleTagId={props.scheduleTagId}
            />
            <h4>{t('entities.block.addressees')}</h4>
            <hr className="my-1"/>
            <div className="row">
                <div className="col-md-6">
                    <h5>{t('entities.block.addressee_groups')}</h5>
                    <hr className="my-1"/>
                </div>

                <div className="col-md-6">
                    <h5>{t('entities.block.persons')}</h5>

                    <hr className="my-1"/>
                    {addressees.map((addressee) => (
                        <p key={addressee.id}>{addressee.firstName + ' ' + addressee.lastName}</p>
                    ))}
                </div>
            </div>
            <Button className="align-self-end"
                    variant="success"
                    onClick={() => setShowAssignToScheduleForm(true)}>
                {t('buttons.assign_addressees')}
            </Button>
        </div>
    )
}