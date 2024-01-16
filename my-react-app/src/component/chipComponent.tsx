import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import './chipComponent.scss';

interface Chip {
    id: string;
    label: string;
    email: string;
    icon?: string;
}
const items: { id: string; icon?: string; label: string; email: string }[] = [
    { id: "1", icon: "😍", label: "Alice Johnson", email: "alice@example.com" },
    { id: "2", icon: "🌟", label: "Bob Smith", email: "bob@example.com" },
    { id: "3", icon: "🎉", label: "Catherine Davis", email: "catherine@example.com" },
    { id: "4", icon: "🌈", label: "David Miller", email: "david@example.com" },
    { id: "5", icon: "🚀", label: "Eva Robinson", email: "eva@example.com" },
    { id: "6", icon: "💡", label: "Frank Wilson", email: "frank@example.com" },
    { id: "7", icon: "🔔", label: "Grace Brown", email: "grace@example.com" },
    { id: "8", icon: "🌺", label: "Henry Taylor", email: "henry@example.com" },
    { id: "9", icon: "🍎", label: "Isabel White", email: "isabel@example.com" },
    { id: "10", icon: "🎸", label: "Jack Anderson", email: "jack@example.com" },
];

const ChipComponent: React.FC = () => {
    const [inputValue, setInputValue] = useState<string>('');
    const [chips, setChips] = useState<Chip[]>([]);
    const [filteredItems, setFilteredItems] = useState<Chip[]>([]);
    const [isListVisible, setIsListVisible] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const chipContainerRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        setListVisibility(true);
        const filtered = items.filter(
            item =>
                item.label.toLowerCase().includes(value.toLowerCase()) &&
                !chips.find(chip => chip.label === item.label)
        );
        setFilteredItems(filtered);
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            const selectedChip = filteredItems.find(item => item.label === inputValue);
            if (selectedChip) {
                const newChip: Chip = { id: selectedChip.id, label: selectedChip.label, email: selectedChip.email };
                setChips([...chips, newChip]);
                setInputValue('');
                setFilteredItems([]);
                setListVisibility(false);
            }
        } else if (e.key === 'Backspace' && inputValue === '' && chips.length > 0) {
            const lastChip = chips[chips.length - 1];
            handleDeleteChip(lastChip);
        }
    };

    const handleSelectItem = (item: Chip) => {
        const newChip: Chip = { id: item.id, label: item.label, email: item.email };
        setChips([...chips, newChip]);
        setInputValue('');
        setFilteredItems([]);
        setListVisibility(false);
    };

    const handleDeleteChip = (chip: Chip) => {
        setChips(chips.filter(c => c.id !== chip.id));
    };

    const setListVisibility = (visible: boolean) => {
        setIsListVisible(visible);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (chipContainerRef.current && !chipContainerRef.current.contains(event.target as Node)) {
                setListVisibility(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        inputRef.current?.focus();
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="main-container">
            <div className="chip-container" ref={chipContainerRef}>
                <div className="chip-input">
                    {chips.map(chip => (
                        <div key={chip.id} className="chip">
                            {chip.label}
                            <span className="delete-icon" onClick={() => handleDeleteChip(chip)}>
                                ❌
                            </span>
                        </div>
                    ))}
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        ref={inputRef}
                    />
                </div>
                {isListVisible && filteredItems.length > 0 && (
                    <ul className="item-list">
                        {filteredItems.map(item => (
                            <li key={item.id} onClick={() => handleSelectItem(item)}>
                                <span className='icon'>{item?.icon}</span>

                                {item.label}
                                <span className='email'>{item.email}</span>

                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ChipComponent;