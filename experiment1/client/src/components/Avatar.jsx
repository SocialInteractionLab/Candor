import React from 'react';

export function Avatar({ seed }) {

  const avatarUrl = `https://api.dicebear.com/8.x/pixel-art/svg?seed=${encodeURIComponent(seed)}`;

  return (
    <img
      className="h-16 w-16 max-w-16 rounded-md shadow bg-white p-1"
      src={avatarUrl}
      alt="Avatar"
    />
  );
}


