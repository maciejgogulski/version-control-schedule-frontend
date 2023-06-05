import React from "react";

class Header extends React.Component{
    render() {
        return (
            <div className="row border-bottom">
                <div className="col-sm-2 bg-primary ps-5">
                    <h4 className="text-light"> Nazwa aplikacji </h4>
                </div>
                <div className="col-sm-10">

                </div>
            </div>
        );
    }
}

export default Header;