import { Controller as ReactHookFormController } from 'react-hook-form';

export const SelectController = ({
    name,
    label,
    control,
    errors,
    type,
    rules,
    defaultValue,
    options,
}: {
    name: string;
    label: string;
    control: any;
    errors: any;
    type: string;
    rules: any;
    defaultValue?: string;
    options: any[];
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
                        <select {...field} className="select">
                            <option value={''}>Select {label}</option>
                            {options.map((option) => (
                                <option value={option._id} key={option._id}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    )}
                />
            </div>
            {errors[name] && (
                <span className="form-error">{errors[name].message} </span>
            )}
        </div>
    );
};
