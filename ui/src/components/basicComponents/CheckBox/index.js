import './index.scss';

export default function Index({ checked, onChecked, id, className }) {
    return (
        <div className={`checkbox-container ${className}`}>
            <input
                defaultChecked={checked}
                type="checkbox"
                id={`checkBox${id}`}
                onChange={onChecked} />
            <label className="checkbox" htmlFor={`checkBox${id}`}></label>
        </div>
    );
}