import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

/**
 * Un componente slider per selezionare un intervallo di prezzo.
 * @param {object} props - Le props del componente.
 * @param {number[]} [props.values=[0, 0]] - L'array con i valori correnti [min, max].
 * @param {(values: number[]) => void} props.onChange - Funzione chiamata al cambio dei valori.
 * @param {number} props.min - Il valore minimo possibile per lo slider.
 * @param {number} props.max - Il valore massimo possibile per lo slider.
 * @param {string} [props.label] - Un'etichetta opzionale.
 */
const PriceRangeSlider = ({
    values = [0, 0], // -> SOLUZIONE: Aggiunto un valore di default
    onChange,
    min,
    max,
    label = "Prezzo"
}) => {
    // Questo controllo extra garantisce che i valori non siano mai undefined.
    const currentValues = Array.isArray(values) ? values : [min, max];

    return (
        <div className="w-full px-2">
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-gray-800">{label}</span>
                <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
                    €{currentValues[0]} - €{currentValues[1]}
                </span>
            </div>

            <Slider
                range
                value={currentValues}
                onChange={onChange}
                min={min}
                max={max}
                step={10}
                allowCross={false}
                styles={{
                    track: { backgroundColor: '#4f46e5', height: 6 },
                    rail: { backgroundColor: '#e5e7eb', height: 6 },
                }}
                handleStyle={[
                    { borderColor: '#4f46e5', height: 20, width: 20, marginTop: -7, backgroundColor: 'white' },
                    { borderColor: '#4f46e5', height: 20, width: 20, marginTop: -7, backgroundColor: 'white' },
                ]}
            />
        </div>
    );
};

export default PriceRangeSlider;