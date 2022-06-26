import React from 'react';
import './index.scss';

export default function Index(props) {
    return (
        <div className="form" style={{ width: props.width, margin: props.margin }}>
            <input type={props.type} name={props.name} required autoComplete="off" spellCheck={false}
                onChange={(e) => {
                    if (props.onChange)
                        props.onChange(e.target.value);
                }}
                ref={props.inputBoxRef} />
            <label htmlFor="name" className="label-name">
                <span className="content-name">{props.name}</span>
            </label>
        </div>
    )
}
