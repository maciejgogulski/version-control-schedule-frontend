import React from "react";
import ScheduleBlockListElement from "./ScheduleBlockListElement";
import ScheduleBlockDetails from "./ScheduleBlockDetails";
import ScheduleBlockService from "../../services/ScheduleBlockService";
import {Button} from "react-bootstrap";
import ScheduleBlockForm from "./ScheduleBlockForm";
import {parseFromServerFormat} from "../../util/DateTimeParser";
import {addDays, format, parseISO, subDays} from "date-fns";
import DatePickerModal from "./DatePickerModal";
import {withTranslation} from "react-i18next";
import ScheduleTagService from "../../services/ScheduleTagService";

class Schedule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            scheduleTagService: new ScheduleTagService(),
            scheduleBlockService: new ScheduleBlockService(),
            scheduleTagId: null,
            scheduleTag: null,
            selectedBlock: null,
            scheduleBlocks: [],
            showBlockForm: false,
            showDayPicker: false,
            pickedDay: new Date()
        };

        console.log(this.props);
        this.setState({scheduleTagId: this.props.match.params.scheduleTagId}, () => {
            this.fetchScheduleTag().then(() => {
                    this.fetchScheduleBlocks();
                }
            );
        });
    }


    fetchScheduleBlocks = async () => {
        const day = format(this.state.pickedDay, "yyyy-MM-dd HH:mm:ss");
        const response = await this.state.scheduleBlockService.getScheduleBlocksByDay(this.state.scheduleTagId, day);
        const data = await response.json();

        if (response.ok) {
            data.forEach((block) => {
                block.startDate = parseFromServerFormat(block.startDate);
                block.endDate = parseFromServerFormat(block.endDate);
            })
            this.setState({scheduleBlocks: data});
        } else {
            console.error('Error:', data);
        }
    };

    fetchScheduleTag = async () => {
        const response = await this.state.scheduleTagService.getScheduleTag(this.state.scheduleTagId);
        const data = await response.json();

        if (response.ok) {
            this.setState({scheduleTag: data});
        } else {
            console.error('Error:', data);
        }
    };

    handleBlockClick = (block) => {
        this.setState({selectedBlock: block}); // Update selectedBlock in the state
    };

    handleBlockFormButtonClick = () => {
        this.setState({showBlockForm: true})
    };

    handleCloseBlockForm = () => {
        this.setState({showBlockForm: false})
    };

    handlePickDayClick = () => {
        this.setState({showDayPicker: true})
    }

    handlePickDayClose = () => {
        this.setState({showDayPicker: false})
    }

    handlePreviousDayClick = () => {
        this.setState({pickedDay: subDays(this.state.pickedDay, 1), selectedBlock: null}, () => {
            this.fetchScheduleBlocks();
        })
    }

    handleNextDayClick = () => {
        this.setState({pickedDay: addDays(this.state.pickedDay, 1), selectedBlock: null}, () => {
            this.fetchScheduleBlocks();
        })
    }

    handleFormSubmit = async () => {
        await this.fetchScheduleBlocks();
    };

    handleDayPick = (day) => {
        this.setState({pickedDay: parseISO(day), selectedBlock: null}, () => {
            this.fetchScheduleBlocks();
        });
    };

    render() {
        const {t} = this.props;
        const {selectedBlock, scheduleBlocks, pickedDay, showBlockForm, showDayPicker, scheduleTag} = this.state;

        return (
            <div className="container">
                <ScheduleBlockForm show={showBlockForm}
                                   pickedDay={pickedDay}
                                   onClose={this.handleCloseBlockForm}
                                   onFormSubmit={this.handleFormSubmit}/>
                <DatePickerModal show={showDayPicker}
                                 pickedDay={pickedDay}
                                 onDayPick={this.handleDayPick}
                                 onClose={this.handlePickDayClose}
                />
                <div className="row">
                    <div className="col-md-6 px-4">
                        <div>
                            <h2>{t('entities.schedule.title')} {scheduleTag.name}</h2>

                            <div className="container">
                                <Button variant="primary" className="me-2"
                                        onClick={this.handleBlockFormButtonClick}>
                                    {t('buttons.create_block')}
                                </Button>

                                <Button variant="outline-secondary" className="me-2"
                                        onClick={this.handlePreviousDayClick}>
                                    &lt;&lt;
                                </Button>

                                <Button variant="secondary" className="me-2"
                                        onClick={this.handlePickDayClick}>
                                    {format(pickedDay, "dd-MM-yyyy")}
                                </Button>

                                <Button variant="outline-secondary" className="me-2"
                                        onClick={this.handleNextDayClick}>
                                    &gt;&gt;
                                </Button>
                            </div>
                        </div>

                        <div>
                            <div className="list-container">
                                {scheduleBlocks.map((block) => (
                                    <ScheduleBlockListElement
                                        key={block.id}
                                        block={block}
                                        onClick={this.handleBlockClick}
                                        isSelected={selectedBlock?.id === block.id}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 px-4">
                        <h2>{t('entities.block.details')}</h2>

                        <div className="container">
                            <ScheduleBlockDetails block={selectedBlock}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation()(Schedule);
