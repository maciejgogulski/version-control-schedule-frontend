import React from "react";

class BlockListElement extends React.Component {

    handleClick = () => {
        const { block, onClick } = this.props;
        onClick(block);
    };

    render() {
        const { block, isSelected } = this.props;
        return (
            <div className={`container ${isSelected ? "bg-primary text-light" : "bg-light text-primary"} rounded mb-3 px-5 py-3 shadow border-start border-primary border-5`}
                 onClick={this.handleClick}
            >
                <div>
                    <h4>{block.name}</h4>
                    <p className="text-warning">{block.startDate + ' - ' + block.endDate}</p>
                </div>
            </div>
        );
    }
}

export default BlockListElement;
