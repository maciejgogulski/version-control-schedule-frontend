import {Form} from "react-bootstrap";
import React from "react";
import {useController} from "react-hook-form";

const Input = ({label, name, rules, ...rest}) => {
    const {field, fieldState} = useController({
        name,
        rules
    })

    return (
        <Form.Group controlId={name}>
            <Form.Label>{label}</Form.Label>
            <Form.Control
                {...field}
                {...rest}
                isInvalid={fieldState.invalid}
                isValid={fieldState.isVaearid}
            />
            <Form.Control.Feedback type="invalid">
                {fieldState?.error?.message}
            </Form.Control.Feedback>
        </Form.Group>
    );
}

export default Input
