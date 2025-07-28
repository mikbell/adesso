// Nel tuo componente PriceRangeSlider

import React, { useEffect } from 'react';
import ReactSlider from 'react-slider';
import './PriceRangeSlider.css';

// Aggiungi onAfterChange tra le props
const PriceRangeSlider = ({ value, onChange, onAfterChange, min, max, label = "Prezzo" }) => {
    const displayValues = Array.isArray(value) && value.length === 2 ? value : [min, max];

    useEffect(() => {
    }, [value]);

    const handleSliderChange = (newValues) => {
        if (onChange) onChange(newValues);
    };

    // Funzione per gestire il rilascio del cursore
    const handleSliderAfterChange = (newValues) => {
        if (onAfterChange) onAfterChange(newValues);
    };

    const renderThumbWithLog = (props, state) => {
        return <div {...props}></div>;
    };

    const renderTrackWithLog = (props, state) => {
        return <div {...props} className={`example-track example-track-${state.index}`} />;
    };

    return (
        <div className="w-full px-2">
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-gray-800">{label}</span>
                <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
                    €{displayValues[0].toFixed(2)} - €{displayValues[1].toFixed(2)}
                </span>
            </div>

            <ReactSlider
                className="horizontal-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                min={min}
                max={max}
                step={1}
                value={displayValues}
                onChange={handleSliderChange} // Aggiorna lo stato locale durante il trascinamento
                onAfterChange={handleSliderAfterChange} // Aggiorna lo stato principale al rilascio
                pearling
                minDistance={1}
                renderThumb={renderThumbWithLog}
                renderTrack={renderTrackWithLog}
            />
        </div>
    );
};

export default PriceRangeSlider;