import React from 'react';

/**
 * Custom hook for form handling with validation
 * @param {object} initialValues - Initial form values
 * @param {function} validate - Validation function
 * @param {function} onSubmit - Form submission handler
 */
const useForm = (initialValues = {}, validate = () => ({}), onSubmit = () => { }) => {
    const [values, setValues] = React.useState(initialValues);
    const [errors, setErrors] = React.useState({});
    const [touched, setTouched] = React.useState({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    // Update values if initialValues change
    React.useEffect(() => {
        setValues(initialValues);
    }, [JSON.stringify(initialValues)]);

    // Handle field change
    const handleChange = (name, value) => {
        setValues(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when field is changed
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    // Mark field as touched on blur
    const handleBlur = (name) => {
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));

        // Validate field on blur
        const fieldErrors = validate({ [name]: values[name] });
        setErrors(prev => ({
            ...prev,
            [name]: fieldErrors[name]
        }));
    };

    // Handle form submission
    const handleSubmit = async () => {
        // Validate all fields
        const formErrors = validate(values);
        setErrors(formErrors);

        // Mark all fields as touched
        const allTouched = Object.keys(values).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {});
        setTouched(allTouched);

        // If no errors, submit form
        if (Object.keys(formErrors).length === 0) {
            setIsSubmitting(true);
            try {
                await onSubmit(values);
            } catch (error) {
                console.error('Form submission error:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    // Reset form
    const resetForm = (newValues = initialValues) => {
        setValues(newValues);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    };

    // Set field value programmatically
    const setFieldValue = (name, value) => {
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Set multiple field values
    const setMultipleFields = (fieldsObject) => {
        setValues(prev => ({
            ...prev,
            ...fieldsObject
        }));
    };

    return {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        resetForm,
        setFieldValue,
        setMultipleFields,
        setValues
    };
};

export default useForm;