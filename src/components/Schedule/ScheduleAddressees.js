import {useEffect, useState} from "react"
import {useTranslation} from "react-i18next"
import {Button} from "react-bootstrap"
import AssignAddresseeToScheduleForm from "./AssignAddresseeToScheduleForm"
import {useDependencies} from "../../context/Dependencies";
import {useAuth} from "../../context/Auth";

export default function ScheduleAddressees(props) {
    const {t} = useTranslation()
    const {token} = useAuth()
    const {getApiService, getToastUtils} = useDependencies()
    const apiService = getApiService()
    const toastUtils = getToastUtils()

    const initialState = {
        addresseeService: apiService.getAddresseeService(token),
        addressees: [],
        showAssignToScheduleForm: false
    }

    const [state, setState] = useState(initialState);

    const updateState = (updates) => {
        setState((prevState) => ({...prevState, ...updates}));
    };

    async function fetchAddressees(id) {
        try {
            const data = await state.addresseeService.getAddresseesForSchedule(id)
            updateState({addressees: data})
        } catch (error) {
            toastUtils.showToast(
                'error',
                t('toast.error.fetch-addressees')
            )
        }
    }

    useEffect(() => {
        fetchAddressees(props.scheduleId)
    }, [props.scheduleId])

    return (
        <div>
            <AssignAddresseeToScheduleForm show={state.showAssignToScheduleForm}
                                           onClose={() => updateState({showAssignToScheduleForm: false})}
                                           onFormSubmit={async () => fetchAddressees(props.scheduleId)}
                                           scheduleId={props.scheduleId}
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
                    {state.addressees.map((addressee) => (
                        <p key={addressee.id}>{addressee.firstName + ' ' + addressee.lastName}</p>
                    ))}
                </div>
            </div>
            <Button className="align-self-end"
                    variant="success"
                    onClick={() => updateState({showAssignToScheduleForm: true})}>
                {t('buttons.assign_addressees')}
            </Button>
        </div>
    )
}
