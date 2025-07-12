import React from 'react';
import { FiEye } from 'react-icons/fi';
import CustomButton from '../shared/CustomButton';

const ChatHeader = ({ contact, detailsPath }) => (
    <header className="p-4 border-b bg-white flex justify-between items-center shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">
            Chat con {contact.name}
        </h2>

        {detailsPath && (
            <CustomButton
                variant="link"
                to={detailsPath}
                
            >
                <FiEye size={16} />
                Vedi Dettagli
            </CustomButton>
        )}
    </header>
);

export default ChatHeader;