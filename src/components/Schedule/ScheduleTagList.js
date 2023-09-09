import React from "react";
import {Button} from "react-bootstrap";
import {withTranslation} from "react-i18next";
import ScheduleTagService from "../../services/ScheduleTagService";
import {Link} from "react-router-dom";

class ScheduleTagList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedScheduleTag: null,
            scheduleTags: [],
            showScheduleTagForm: false,
        };
    }

    componentDidMount() {
        this.fetchScheduleTags();
    }

    fetchScheduleTags = async () => {
        const scheduleTagService = new ScheduleTagService();
        const response = await scheduleTagService.getScheduleTags();
        const data = await response.json();

        if (response.ok) {
            this.setState({scheduleTags: data});
        } else {
            console.error('Error:', data);
        }
    };


    handleTagFormButtonClick = () => {
        this.setState({showTagForm: true})
    };

    handleCloseTagForm = () => {
        this.setState({showTagForm: false})
    };

    handleFormSubmit = async () => {
        await this.fetchScheduleTags();
    };


    render() {
        const {t} = this.props;
        const {scheduleTags} = this.state;

        return (
            <div className="container">
                {/*<ScheduleTagForm show={showTagForm}*/}
                {/*                 onClose={this.handleCloseTagForm}*/}
                {/*                 onFormSubmit={this.handleFormSubmit}/>*/}
                <div className="row">
                    <div className="col-md-6 px-4">
                        <div>
                            <h2>{t('navigation.schedules')} </h2>

                            <div className="container">
                                <Button variant="primary" className="me-2"
                                        onClick={this.handleBlockFormButtonClick}>
                                    {t('buttons.create_schedule')}
                                </Button>
                            </div>
                        </div>

                        <div>
                            <div className="list-container">
                                {scheduleTags.map((tag) => (
                                    <Link to={tag.id.toString()}
                                          key={tag.id}>
                                        <p>{tag.name}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation()(ScheduleTagList);
