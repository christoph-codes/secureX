import React from 'react';
import './FormContainer.scss'

export default function FormContainer({ children }) {
    return (
        <div className='FormContainer'>
            {children}
        </div>
    )
}