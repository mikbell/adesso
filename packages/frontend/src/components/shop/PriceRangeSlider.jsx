import React, { useState, useEffect, useRef, useCallback } from 'react';

const PriceRangeSlider = ({ min, max, value, onChange }) => {
    const [minVal, setMinVal] = useState(value[0]);
    const [maxVal, setMaxVal] = useState(value[1]);
    const range = useRef(null);
    const minValRef = useRef(value[0]);
    const maxValRef = useRef(value[1]);

    const getPercent = useCallback((val) => Math.round(((val - min) / (max - min)) * 100), [min, max]);

    useEffect(() => {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(maxValRef.current);
        if (range.current) {
            range.current.style.left = `${minPercent}%`;
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [minVal, getPercent]);

    useEffect(() => {
        const minPercent = getPercent(minValRef.current);
        const maxPercent = getPercent(maxVal);
        if (range.current) {
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [maxVal, getPercent]);

    useEffect(() => {
        setMinVal(value[0]);
        setMaxVal(value[1]);
    }, [value]);

    return (
        <div>
            <div className="relative h-10 flex items-center">
                <input
                    type="range" min={min} max={max} value={minVal}
                    onChange={(event) => {
                        const value = Math.min(Number(event.target.value), maxVal - 1);
                        setMinVal(value);
                        minValRef.current = value;
                    }}
                    onMouseUp={() => onChange([minVal, maxVal])}
                    onTouchEnd={() => onChange([minVal, maxVal])}
                    className="thumb thumb--left absolute w-full h-2 bg-transparent appearance-none pointer-events-none z-30 mt-4"
                />
                <input
                    type="range" min={min} max={max} value={maxVal}
                    onChange={(event) => {
                        const value = Math.max(Number(event.target.value), minVal + 1);
                        setMaxVal(value);
                        maxValRef.current = value;
                    }}
                    onMouseUp={() => onChange([minVal, maxVal])}
                    onTouchEnd={() => onChange([minVal, maxVal])}
                    className="thumb thumb--right absolute w-full h-2 bg-transparent appearance-none pointer-events-none z-40 mt-4"
                />
                <div className="relative w-full">
                    <div className="absolute w-full h-2 bg-slate-200 rounded-lg z-10"></div>
                    <div ref={range} className="absolute h-2 bg-blue-500 rounded-lg z-20"></div>
                </div>
            </div>
            <div className="flex justify-between text-sm mt-2 text-slate-600">
                <span>${minVal}</span>
                <span>${maxVal}</span>
            </div>
            <style jsx>{`
                    .thumb { -webkit-appearance: none; -moz-appearance: none; appearance: none; }
                    .thumb::-webkit-slider-thumb {
                        -webkit-appearance: none; appearance: none; width: 20px; height: 20px;
                        border-radius: 50%; background: #3B82F6; border: 2px solid white;
                        box-shadow: 0 0 5px rgba(0,0,0,0.2); cursor: pointer; pointer-events: auto; margin-top: -8px;
                    }
                    .thumb::-moz-range-thumb {
                        width: 20px; height: 20px; border-radius: 50%; background: #3B82F6;
                        border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.2);
                        cursor: pointer; pointer-events: auto;
                    }
                `}</style>
        </div>
    );
};

export default PriceRangeSlider;