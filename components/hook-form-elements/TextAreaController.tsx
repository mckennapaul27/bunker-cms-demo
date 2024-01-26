import { Controller as ReactHookFormController } from 'react-hook-form';

export const TextAreaController = ({
    name,
    label,
    control,
    errors,
    type,
    rules,
    defaultValue,
}: {
    name: string;
    label: string;
    control: any;
    errors: any;
    type: string;
    rules: any;
    defaultValue?: string;
}) => {
    return (
        <div className="input-wrapper">
            <label htmlFor={name} className="label">
                {label}
            </label>
            <div>
                <ReactHookFormController
                    name={name}
                    control={control} // you need to get control from useForm
                    defaultValue={defaultValue}
                    rules={rules}
                    render={({ field }) => (
                        <textarea {...field} className="textarea" rows={3} />
                    )}
                />
            </div>
            {errors[name] && (
                <span className="form-error">{errors[name].message} </span>
            )}
        </div>
    );
};
