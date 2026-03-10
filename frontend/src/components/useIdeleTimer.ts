import React, { useEffect, useRef } from 'react'

const useIdeleTimer = (onIdel:()=>void,timeout=1 * 60 * 1000) => {
    const timer = useRef<NodeJS.Timeout |null>(null);
    const resetTimer = ()=>
    {
        if(timer.current)clearTimeout(timer.current);
        timer.current = setTimeout(()=>{
            onIdel();
        },timeout);
    };
     useEffect(()=>
    {
        const events = ["mousemove", "keydown", "click", "scroll"] ;
        events.forEach(event => window.addEventListener(event,resetTimer));
        resetTimer();
        return ()=>
        {
            events.forEach(event=>window.removeEventListener(event,resetTimer));
            if (timer.current)clearTimeout(timer.current);
        };
    },[])
}

export default useIdeleTimer
