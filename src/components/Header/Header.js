import React from "react";
import {withTranslation} from "react-i18next";

class Header extends React.Component {
    render() {
        const {t} = this.props;

        return (
            <div className="row border-bottom">
                <div className="col-sm-2 bg-primary ps-5">
                    <h4 className="text-light">{t('app_name')}</h4>
                </div>
                <div className="col-sm-10">

                </div>
            </div>
        );
    }
}

export default withTranslation()(Header);