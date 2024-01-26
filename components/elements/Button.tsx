export const Button = ({
    children,
    type,
    disabled,
    onClick,
}: {
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset' | undefined;
    disabled: boolean;
    onClick?: () => void;
}) => {
    console.log('onClick :>> ', onClick);

    if (onClick) {
        return (
            <button
                className="button"
                type={type}
                onClick={() => onClick()}
                disabled={disabled}
            >
                {children}
            </button>
        );
    }
    return (
        <button className="button" type={type} disabled={disabled}>
            {children}
        </button>
    );
};
