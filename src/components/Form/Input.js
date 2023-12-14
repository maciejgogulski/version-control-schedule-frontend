import {Form} from "react-bootstrap";
import {useFormContext} from "react-hook-form";

export default function Input(props) {
    const {register, formState: {errors}, setValue} = useFormContext()

    const handleChange = (event) => {
        setValue(props.name, event.target.value, {shouldValidate: true})
    }

    return (
        <Form.Group controlId={props.name}>
            <Form.Label>{props.label}</Form.Label>
            <Form.Control
                type={props.type}
                {...register(props.name, props.rules)}
                onChange={handleChange}
                isInvalid={!!errors[props.name]}
            />
            <Form.Control.Feedback type="invalid">
                {errors[props.name]?.message || (
                    errors[props.name]?.types?.pattern?.message
                )}
            </Form.Control.Feedback>
        </Form.Group>
    );
}

