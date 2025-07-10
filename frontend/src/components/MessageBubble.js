'use client';

import React from 'react';
import { cn } from '../lib/utils'; 

export default function MessageBubble({ message, isUser }) {
  return (
    <div
      className={cn(
        'flex mb-2',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[75%] px-4 py-2 rounded-lg text-sm shadow-md',
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        )}
      >
        {message}
      </div>
    </div>
  );
}
