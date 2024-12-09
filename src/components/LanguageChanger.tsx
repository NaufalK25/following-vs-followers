import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Option {
    value: string;
    label: string;
    imageSrc: string;
}

const options: Option[] = [
    { value: 'en', label: 'english', imageSrc: 'https://flagsapi.com/GB/flat/64.png' },
    { value: 'id', label: 'indonesian', imageSrc: 'https://flagsapi.com/ID/flat/64.png' },
];

const LanguageChanger = () => {
    const { i18n, t } = useTranslation();

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState(options.find((option) => option.value === i18n.language) || options[0]);

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    const handleSelect = (option: Option) => {
        setSelectedOption(option);
        i18n.changeLanguage(option.value);
        setIsOpen(false);
    };

    return (
        <div className="fixed top-5 left-5 border border-solid border-github-border-primary p-2 rounded-lg bg-github-card flex flex-col gap-2 cursor-pointer">

            <span className="flex items-center text-github-text-primary" onClick={toggleDropdown}>
                <img
                    src={selectedOption.imageSrc}
                    alt={t(selectedOption.label)}
                    className="w-5 h-5 mr-2"
                />
                {t(selectedOption.label)}
            </span>
            {
                isOpen && (
                    <ul className="absolute w-[150px] border border-solid border-github-border-primary rounded-lg p-0 list-none z-10 top-8">
                        {options.map((option) => (
                            <li
                                key={option.value}
                                className="flex items-center p-2 cursor-pointer bg-github-card opacity-80 hover:opacity-100 text-github-text-primary"
                                onClick={() => handleSelect(option)}
                            >
                                <img
                                    src={option.imageSrc}
                                    alt={t(option.label)}
                                    className="w-5 h-5 mr-2"
                                />
                                {t(option.label)}
                            </li>
                        ))}
                    </ul>
                )
            }
        </div >
    );
};

export default LanguageChanger;