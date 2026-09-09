import { useState } from "react";

export function useDateUtils() {
    const [date, setDate] = useState<string>('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    
    return {
        date,
        setDate,
        showDatePicker,
        setShowDatePicker
    }
}
