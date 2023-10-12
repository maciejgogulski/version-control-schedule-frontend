import React, {useEffect, useState} from "react"
import {Button, Table} from "react-bootstrap"
import {useTranslation, withTranslation} from "react-i18next"
import ConfirmActionModal from "../Modals/ConfirmActionModal"
import {useNavigate} from "react-router-dom";
import AddresseeForm from "./AddresseeForm";
import AddresseeService from "../../services/AddresseeService";

function AddresseeList() {
    const navigate = useNavigate()
    const [addresseeService] = useState(new AddresseeService())
    const [addressees, setAddressees] = useState([])
    const [showAddresseeForm, setShowAddresseeForm] = useState(false)
    const [selectedAddressee, setSelectedAddressee] = useState(null)
    const [showDeleteAddresseeModal, setShowDeleteAddresseeModal] = useState(false)

    useEffect(() => {
        fetchAddressees()
    }, [])

    const fetchAddressees = async () => {
        const response = await addresseeService.getAddressees()
        const data = await response.json()

        if (response.ok) {
            setAddressees(data)
        } else {
            console.error('Error:', data)
        }
    }


    const handleAddresseeFormButtonClick = (addressee = null) => {
        setShowAddresseeForm(true)
        if (addressee) {
            setSelectedAddressee(addressee)
        }
    }

    const handleCloseAddresseeForm = () => {
        setShowAddresseeForm(false)
        setSelectedAddressee(null)
    }

    const handleFormSubmit = async () => {
        await fetchAddressees()
    }

    const handleDeleteAddresseeButtonClick = (addressee = null) => {
        setSelectedAddressee(addressee)
        setShowDeleteAddresseeModal(true)
    }

    const handleDeleteAddresseeClose = () => {
        setShowDeleteAddresseeModal(false)
        setSelectedAddressee(null)
    }

    const handleAddresseeDelete = async () => {
        await addresseeService.deleteAddressee(selectedAddressee.id)
        await fetchAddressees()

        setShowDeleteAddresseeModal(false)
        setSelectedAddressee(null)
    }

    const redirectToAddressee = (addresseeId) => {
        navigate("/addressee/" + addresseeId)
    }

    const {t} = useTranslation()

    return (
        <div className="container">
            <AddresseeForm show={showAddresseeForm}
                           onClose={handleCloseAddresseeForm}
                           onFormSubmit={handleFormSubmit}
                           addressee={selectedAddressee}
            />
            <ConfirmActionModal
                show={showDeleteAddresseeModal}
                title={t('entities.addressee.deleting_addressee') + ' '  + selectedAddressee?.firstName + ' ' + selectedAddressee?.lastName}
                message={t('entities.addressee.delete_addressee_message', {name: selectedAddressee?.firstName + ' ' + selectedAddressee?.lastName})}
                action={handleAddresseeDelete}
                variant={"danger"}
                onClose={handleDeleteAddresseeClose}
            />
            <div className="row">
                <div className="col-md-12 px-4">
                    <div>
                        <h2>{t('navigation.addressees')} </h2>

                        <div className="container">
                            <Button variant="success" className="me-2"
                                    onClick={() => handleAddresseeFormButtonClick(null)}>
                                {t('buttons.create_addressee')}
                            </Button>
                        </div>
                    </div>

                    <div>
                        <Table responsive>
                            <thead>
                            <tr>
                                <th>{t('entities.addressee.email')}</th>
                                <th>{t('entities.addressee.first-name')}</th>
                                <th>{t('entities.addressee.last-name')}</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {addressees.map((addressee) => (
                                <tr key={addressee.id}>
                                    <td className="user-select-none"
                                        onClick={() => redirectToAddressee(addressee.id)}>
                                        {addressee.email}
                                    </td>
                                    <td className="user-select-none"
                                        onClick={() => redirectToAddressee(addressee.id)}>
                                        {addressee.firstName}
                                    </td>
                                    <td className="user-select-none"
                                        onClick={() => redirectToAddressee(addressee.id)}>
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withTranslation()(AddresseeList)
