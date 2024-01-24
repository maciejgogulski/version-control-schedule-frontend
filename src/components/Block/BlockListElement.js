import React from "react";
import {extractTimeFromDateTimeString} from "../../utils/DateTimeParser";

class BlockListElement extends React.Component {

    handleClick = () => {
        const {block, onClick} = this.props;
        onClick(block);
    };

    render() {
        const {block, isSelected} = this.props;
        return (
            <div
                className={`container ${isSelected ? "bg-primary text-light" : "bg-light text-primary"} rounded mb-3 px-5 py-3 shadow border-start border-primary border-5`}
                onClick={this.handleClick}
            >
                <div>
                    <h4>{block.name}</h4>

                    <div className="text-warning">
                        {extractTimeFromDateTimeString(block.startDate)} - {extractTimeFromDateTimeString(block.endDate)}
                    </div>
                </div>
            </div>
        );
    }
}

export default BlockListElement;
