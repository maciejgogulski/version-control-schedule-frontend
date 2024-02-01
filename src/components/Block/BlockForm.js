import React, {useEffect, useState} from "react"
import {Button, CloseButton, Form, Modal} from "react-bootstrap"
import Block from "../../models/Block"
import {parseToServerFormat} from "../../utils/DateTimeParser"
import {format} from "date-fns"
import {useTranslation} from "react-i18next"
import Parameter from "../../models/Parameter"
import './BlockForm.css'
import {useDependencies} from "../../context/Dependencies";
import {useAuth} from "../../context/Auth";
import {FormProvider, useFieldArray, useForm} from "react-hook-form";
import Input from "../Form/Input";

function BlockForm(props) {
    const {t} = useTranslation()
    const token = useAuth()
    const {getApiService, getToastUtils} = useDependencies()
    const apiService = getApiService()
    const toastUtils = getToastUtils()

    const form = useForm({
        defaultValues: {
            'name': '',
            'startDate': '',
            'endDate': '',
            'newParameterName': '',
            'newParameterValue': '',
            'parameters': [],
            'newParameters': [],
            'deletedParameters': []
        }
    })

    const arrayFields = useFieldArray({
        ,
        name: 'parameters'
    })

    const initialState = {
        blockService: apiService.getBlockService(token),
        name: '',
        startDate: null,
        endDate: null,
        parameters: [],
        showAddParameterField: null,
        newParameterName: '',
        newParameterValue: '',
        newParameters: [],
        deletedParameters: []
    }

    const [state, setState] = useState(initialState);

    const updateState = (updates) => {
        setState((prevState) => ({...prevState, ...updates}));
    };

    const fetchParametersForBlock = async () => {
        try {
            const data = await state.blockService.getParameters(props.blockToEdit.id)
            form.setValue('parameters', data)
        } catch (error) {
            toastUtils.showToast(
                'error',
                t('toast.error.fetch-params-for-block')
            )
        }
    }

    const onSubmit = async (data) => {
        try {
            let block = (props.blockToEdit) ? props.blockToEdit : new Block()
            block.scheduleId = props.scheduleId
            block.name = ((props.blockToEdit) ? data.parameters[0].value : data.name).trim()

            block.startDate = parseToServerFormat((props.blockToEdit) ? data.parameters[1].value : data.startDate).trim()
            block.endDate = parseToServerFormat((props.blockToEdit) ? data.parameters[2].value : data.endDate).trim()

            if (block.id) {
                data.parameters.map(async (parameter) => {
                    await state.blockService.assignParameterToBlock(parameter)
                })
                data.deletedParameters.map(async (parameter) => {
                    await state.blockService.deleteParameterFromBlock(parameter)
                })
                await state.blockService.editBlock(block)
                toastUtils.showToast(
                    'success',
                    t('toast.success.edit-block')
                )
            } else {
                await state.blockService.addBlock(block)
                toastUtils.showToast(
                    'success',
                    t('toast.success.add-block')
                )
            }
        } catch (error) {
            toastUtils.showToast(
                'error',
                t('toast.error.submit')
            )
        }

        props.onClose()
        props.onFormSubmit()
    }

    useEffect(() => {
        if (props.blockToEdit) {
            form.setValue('name', props.blockToEdit.name)
            form.setValue('startDate', props.blockToEdit.startDate)
            form.setValue('endDate', props.blockToEdit.endDate)

            fetchParametersForBlock()
        } else {
            form.setValue('startDate', format(props.pickedDay, "yyyy-MM-dd HH:mm:ss"))
            form.setValue('endDate', format(props.pickedDay, "yyyy-MM-dd HH:mm:ss"))
        }

    }, [props.pickedDay, props.blockToEdit, form])

    // const handleParameterChange = (id, value) => {
    //     updateState({
    //         parameters: state.parameters.map(parameter => {
    //             if (parameter.id === id) {
    //                 return {...parameter, value}
    //             }
    //             return parameter
    //         })
    //     })
    // }

    const handleAddParameterSubmit = async (e) => {
        e.preventDefault()

        let newParameter = new Parameter();
        newParameter.blockId = props.blockToEdit.id
        newParameter.parameterName = form.getValues('newParameterName')
        newParameter.value = form.getValues('newParameterValue')
        form.setValue(
            'newParameters',
            form.getValues('newParameters').push(newParameter)
        )
        form.setValue(
            'parameters',
            form.getValues('parameters').push(newParameter)
        )

        form.setValue('newParameterName', '')
        form.setValue('newParameterValue', '')

        updateState({
            showAddParameterField: false
        })
    }

    const handleParameterDelete = async (parameter) => {
        const updatedParameters = form.getValues('parameters').filter(param => param.parameterName !== parameter.parameterName)
        form.setValue('parameters', updatedParameters)
        if (parameter.id) {
            form.setValue(
                'deletedParameters',
                form.getValues('deletedParameters').push(parameter)
            )
        } else {
            const updatedNewParameters = form.getValues('newParameters').filter(param => param.parameterName !== parameter.parameterName)
            form.setValue(
                'newParameters',
                form.getValues('newParameters').push(updatedNewParameters)
            )
        }
    }

    const handleFormClose = () => {
        form.setValue('name', '')
        form.setValue('startDate', '')
        form.setValue('endDate', '')
        form.setValue('parameters', [])
        form.setValue('newParameters', [])

        updateState({
            showAddParameterField: false,
        })
        props.onClose()
    }

    const translateParameterName = (parameterName) => {
        switch (parameterName) {
            case 'Name':
                return t('entities.parameter.required.name')
            case 'Start date':
                return t('entities.parameter.required.start_date')
            case 'End date':
                return t('entities.parameter.required.end_date')
            default:
                return parameterName
        }
    }

    return (
        <FormProvider {...form}>
            <Form onSubmit={onSubmit}>
                <Modal show={props.show} onHide={handleFormClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{(props.blockToEdit) ? t('entities.block.editing_block') + ": " + props.blockToEdit.name : t('entities.block.creating_new_block')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        {!props.blockToEdit && (
                            <>
                                <Input
                                    name={'name'}
                                    type={'text'}
                                    label={t('entities.block.name')}
                                    rules={{
                                        required: t('form.required', {fieldName: `"${t('entities.block.name')}"`})
                                    }}
                                />

                                <Input
                                    name={'startDate'}
                                    type={'datetime-local'}
                                    label={t('entities.block.start_date')}
                                    rules={{
                                        required: t('form.required', {fieldName: `"${t('entities.block.start_date')}"`})
                                    }}
                                />

                                <Input
                                    name={'endDate'}
                                    type={'datetime-local'}
                                    label={t('entities.block.end_date')}
                                    rules={{
                                        required: t('form.required', {fieldName: `"${t('entities.block.end_date')}"`})
                                    }}
                                />
                            </>
                        )}
                        {state.parameters.map((parameter, index) => (
                            <div className="row">
                                <Input
                                    className="col-md-6"
                                    key={parameter.id}
                                    name={parameter.parameterName}
                                    type={(index === 1 || index === 2) ? 'datetime-local' : 'text'}
                                    label={translateParameterName(parameter.parameterName)}
                                    rules={{
                                        required: t('form.required', {fieldName: `"${translateParameterName(parameter.parameterName)}"`})
                                    }}
                                />
                                {index >= 3 && (
                                    <CloseButton
                                        className="col-md-6"
                                        onClick={() => handleParameterDelete(parameter)}
                                    />
                                )}
                            </div>
                        ))}
                        {props.blockToEdit && state.showAddParameterField &&
                            <>
                                <Modal.Header>
                                    <Modal.Title>{t('entities.parameter.new')}</Modal.Title>
                                </Modal.Header>
                                <Input
                                    name={'newParameterName'}
                                    type={'text'}
                                    label={t('entities.parameter.name')}
                                    rules={{
                                        required: t('form.required', {fieldName: `"${t('entities.parameter.name')}"`})
                                    }}
                                />

                                <Input
                                    name={'newParameterValue'}
                                    type={'text'}
                                    label={t('entities.parameter.value')}
                                    rules={{
                                        required: t('form.required', {fieldName: `"${t('entities.parameter.value')}"`})
                                    }}
                                />
                            </>
                        }

                        {state.showAddParameterField ?
                            <Button
                                className="mt-3"
                                variant="success"
                                onClick={handleAddParameterSubmit}>
                                {t('buttons.add_parameter')}
                            </Button>
                            :
                            <>
                                {
                                    props.blockToEdit &&
                                    <Button
                                        className="mt-3"
                                        variant="secondary"
                                        onClick={() => updateState({showAddParameterField: true})}>
                                        {t('buttons.add_parameter')}
                                    </Button>
                                }
                            </>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            type="submit"
                            variant={(props.blockToEdit) ? "primary" : "success"}
                        >
                            {(props.blockToEdit) ? t('buttons.edit_block') : t('buttons.create_block')}
                        </Button>
                        <Button variant="secondary" onClick={handleFormClose}>
                            {t('buttons.close')}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Form>
        </FormProvider>
    )
}

export default BlockForm
