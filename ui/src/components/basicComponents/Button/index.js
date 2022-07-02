import React from 'react';
import './index.scss';

export default function Index(props) {
    return (
        <button className="button" onClick={props.onClick} style={props.style}>
            {props.name}
        </button>
    )
}
