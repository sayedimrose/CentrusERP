import React from 'react';
import CAvatar from './CAvatar';

export interface CActivityItemProps {
  /** User initials */
  userInitials: string;
  /** Display name */
  userName: string;
  /** Action verb e.g. 'marked', 'created' */
  action: string;
  /** Target entity name */
  target: string;
  /** Time ago label */
  time: string;
  /** Color class for avatar */
  avatarColor?: string;
  /** Status dot color class */
  dotColor?: string;
  className?: string;
}

export default function CActivityItem({
  userInitials,
  userName,
  action,
  target,
  time,
  avatarColor = 'bg-gray-100 text-gray-500',
  dotColor = 'bg-gray-400',
  className = '',
}: CActivityItemProps) {
  return (
    <div className={`flex items-center gap-3 py-2.5 ${className}`}>
      <CAvatar initials={userInitials} colorClass={avatarColor} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-main">
          <span className="font-medium">{userName}</span>
          {' '}{action}{' '}
          <span className="font-medium">&ldquo;{target}&rdquo;</span>
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        <span className="text-xs text-text-muted">{time}</span>
      </div>
    </div>
  );
}
