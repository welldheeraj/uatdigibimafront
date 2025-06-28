
import Select, { components } from 'react-select';
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

const DropdownWithSearch = ({
    id,
    name,
    value = null,
    onChange,
    placeholder = "Select an option...",
    disabled,
    options = [],
}) => {
    const handleChange = (selectedOption) => {
        onChange(selectedOption ? selectedOption.value : "");
    };

    const extendedOptions = [{ value: "no-selection", label: "-- No Selection --" }, ...options];

    const customStyles = {
        control: (provided) => ({
            ...provided,
            outline: 'none',
            backgroundColor: 'white',
            color: 'black',
            borderRadius: '7px',
            border: '1px solid #ccc',
            fontSize: "14px",
            focus: 'none',
            boxShadow: 'none',
            hover: 'none',
            cursor: 'pointer',
            height: '34px',
        }),
        menu: (provided) => ({
            ...provided,
            fontSize: '14px',
            cursor: 'pointer',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#DDE7EE' : 'white',
            color: state.isSelected ? 'black' : 'black',
            cursor: 'pointer',
        }),
    };

    const DropdownIndicator = (props) => {
        return (
            <components.DropdownIndicator {...props}>
                <KeyboardArrowDown
                    style={{
                        transition: 'transform 0.2s ease',
                        color: '#000',
                        fontWeight: 'bold',
                        transform: props.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                />
            </components.DropdownIndicator>
        );
    };


    return (
        <div className="w-full">
    
            <Select
                id={id}
                name={name}
                value={options.find(opt => opt.value === value) || null}
                onChange={handleChange}
                placeholder={placeholder}
                options={extendedOptions}
                isSearchable
                isDisabled={disabled}
                styles={customStyles}
                components={{ DropdownIndicator }}

            />
        </div>
    )
}

export default DropdownWithSearch