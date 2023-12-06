import React, {useEffect, useState} from "react"
import {Button, Table} from "react-bootstrap"
import {useTranslation, withTranslation} from "react-i18next"
import ConfirmActionModal from "../Modals/ConfirmActionModal"
import {useNavigate} from "react-router-dom";
import AddresseeForm from "./AddresseeForm";
import {useAuth} from "../../context/Auth";
import {useDependencies} from "../../context/Dependencies";

function AddresseeList() {
    const navigate = useNavigate()
    const {t} = useTranslation()
    const {token} = useAuth()
    const {getApiService, getToastUtils} = useDependencies()
    const apiService = getApiService()
    const toastUtils = getToastUtils()

    const initialState = {
        addresseeService: apiService.getAddresseeService(token),
        addressees: [],
        showAddresseeForm: false,
        selectedAddressee: null,
        showDeleteAddresseeModal: false
    }

    const [state, setState] = useState(initialState);

    const updateState = (updates) => {
        setState((prevState) => ({...prevState, ...updates}));
    };

    useEffect(() => {
        fetchAddressees()
    }, [])

    const fetchAddressees = async () => {
        try {
            const data = await state.addresseeService.getAddressees()
            updateState({addressees: data})
        } catch (error) {
            toastUtils.showToast(
                'error',
                t('toast.error.fetch-addressees')
            )
        }
    }


    const handleAddresseeFormButtonClick = (addressee = null) => {
        updateState({showAddresseeForm: true})
        if (addressee) {
            updateState({selectedAddressee: addressee})
        }
    }

    const handleCloseAddresseeForm = () => {
        updateState({
            showAddresseeForm: false,
            selectedAddressee: null
        })
    }

    const handleFormSubmit = async () => {
        await fetchAddressees()
    }

    const handleDeleteAddresseeButtonClick = (addressee = null) => {
        updateState({
            showDeleteAddresseeModal: true,
            selectedAddressee: addressee
        })
    }

    const handleDeleteAddresseeClose = () => {
        updateState({
            showDeleteAddresseeModal: false,
            selectedAddressee: null
        })
    }

    const handleAddresseeDelete = async () => {
        try {
            await state.addresseeService.deleteAddressee(state.selectedAddressee.id)
            await fetchAddressees()

            toastUtils.showToast(
                'success',
                t('toast.success.delete-addressee')
            )
        } catch (error) {
            toastUtils.showToast(
                'error',
                t('toast.error.delete-addressee')
            )
        }

        updateState({
            showDeleteAddresseeModal: false,
            selectedAddressee: null
        })
    }

    return (
        <div className="container">
            <AddresseeForm show={state.showAddresseeForm}
                           onClose={handleCloseAddresseeForm}
                           onFormSubmit={handleFormSubmit}
                           addressee={state.selectedAddressee}
            />
            <ConfirmActionModal
                show={state.showDeleteAddresseeModal}
                title={`${t('entities.addressee.deleting_addressee')} ${state.selectedAddressee?.firstName} ${state.selectedAddressee?.lastName}`}
                message={`${t(
                    'entities.addressee.delete_addressee_message',
                    {name: `${state.selectedAddressee?.firstName} ${state.selectedAddressee?.lastName}`}
                )}`}
                action={handleAddresseeDelete}
                variant={'danger'}
                onClose={handleDeleteAddresseeClose}
            />
            <div className="row">
                <div className="col-md-12 px-4">
                    <h2>{t('navigation.addressees')} </h2>
                    <Button variant="success" className="mb-3"
                            onClick={() => handleAddresseeFormButtonClick(null)}>
                        {t('buttons.create_addressee')}
                    </Button>

                    {state.addressees.length > 0
                        ? (
                            <Table responsive hover>
                                <thead>
                                <tr>
                                    <th>{t('entities.addressee.email')}</th>
                                    <th>{t('entities.addressee.first-name')}</th>
                                    <th>{t('entities.addressee.last-name')}</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {state.addressees.map((addressee) => (
                                    <tr key={addressee.id}>
                                        <td className="user-select-none">
                                            {addressee.email}
                                        </td>
                                        <td className="user-select-none">
                                            {addressee.firstName}
                                        </td>
                                        <td className="user-select-none">
                                            {addressee.lastName}
                                        </td>
                                        <td>
                                            <Button variant="secondary" className="me-2"
                                                    onClick={() => handleAddresseeFormButtonClick(addressee)}>
                                                {t('buttons.edit_addressee')}
                                            </Button>

                                            <Button variant="danger" className="me-2"
                                                    onClick={() => handleDeleteAddresseeButtonClick(addressee)}>
                                                {t('buttons.delete_addressee')}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        ) : (
                            <div className="alert alert-info" role="alert">
                                {t('entities.addressee.no_addressees')}
                            </div>
                        )}
                </div>
            </div>
        </div>
    )
}

export default withTranslation()(AddresseeList)
