import React from 'react'
import { Link } from 'react-router-dom'

const ProfileInfo = ({ profile, handleLinkClick }) => {
    return (
        <div className="flex flex-col items-center h-[120px] flex-shrink-0 p-4 border-b border-gray-700/50">
            <Link to='/seller/dashboard/profile' className="flex flex-col items-center gap-2" onClick={handleLinkClick}>
                <img
                    src={profile?.avatarUrl}
                    alt={profile?.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-indigo-400"
                />
                <span className="text-white font-semibold text-sm mt-1">{profile?.name}</span>
            </Link>
        </div>
    )
}

export default ProfileInfo