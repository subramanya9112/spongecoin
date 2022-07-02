import React from 'react';
import './index.scss';

export default function Index(props) {
    return (
        <div className="form" style={props.style}>
            <input type={props.type} name={props.name} value={props.value} required autoComplete="off" spellCheck={false}
                onChange={(e) => {
                    if (props.onChange)
                        props.onChange(e.target.value);
                }} />
            <label htmlFor="name" className="label-name">
                <span className="content-name">{props.name}</span>
            </label>
        </div>
    )
}
