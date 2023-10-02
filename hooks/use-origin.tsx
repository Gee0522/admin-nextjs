


// to safely access the window obejct in next13

import { useState, useEffect } from "react"

export const useOrigin = () => {
    const [ mounted, setIsMounted ] = useState(false);
    
    // checking if the window location is available 
    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : '';

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if(!mounted) {
        return '';
    }

    return origin

}