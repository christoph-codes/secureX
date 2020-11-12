import React from 'react';
import './Header.scss';
import logo from '../../assets/images/c1_logo.svg';
import { Link } from 'react-router-dom';

export default function Header(props) {
    return (
        <div className='Header'>
            <Link to="/">
                <img src={logo} alt="Credit One Bank" />    
            </Link>
        </div>
    )
}