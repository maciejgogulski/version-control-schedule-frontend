import React, {useState} from "react";
import ConfirmActionModal from "../Modals/ConfirmActionModal";
import {Button} from "react-bootstrap";
import {useAuth} from "../../context/Auth";
import {useTranslation} from "react-i18next";
import {useDependencies} from "../../context/Dependencies";
import {useNavigate} from "react-router-dom";

export default function Header() {
    const {t} = useTranslation()
    const auth = useAuth()
    const navigate = useNavigate()
    const {getToastUtils} = useDependencies()
    const toastUtils = getToastUtils()

    const initialState = {
        showLogoutModal: false
    }

    const [state, setState] = useState(initialState)

    const updateState = (updates) => {
        setState((prevState) => ({...prevState, ...updates}))
    }

    const confirmLogout = () => {
        auth.setToken(undefined)
        auth.setLoggedIn(false)
        toastUtils.showToast(
            'info',
            t('toast.logout.success')
        )
        navigate('/login')
    }

    return (
        auth.loggedIn && (
            <div className="row border-bottom bg-light">
                <ConfirmActionModal
                    show={state.showLogoutModal}
                    title={t('auth.logout-title')}
                    message={t('auth.logout-message')}
                    action={confirmLogout}
                    onClose={() => updateState({showLogoutModal: false})}
                />
                <div className="col-sm-2 bg-primary p-3">
                    <h4 className="text-light">{t('app_name')}</h4>
                </div>
                <div className="col-sm-8">
                </div>
                <div className={'col-sm-2 p-3'}>
                    {auth.loggedIn && (
                        <Button onClick={() => updateState({showLogoutModal: true})}
                                variant={'outline-primary'}>
                            {t('buttons.logout')}
                        </Button>
                    )}
                </div>
            </div>
        )
    )
}
