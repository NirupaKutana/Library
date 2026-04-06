import React, { useEffect, useRef } from 'react'

const useIdeleTimer = (onIdel:()=>void,timeout=10* 60 * 1000) => {
    const timer = useRef<NodeJS.Timeout |null>(null);
    const LAST_ACTIVITY_KEY = "lastActivity";

    const updateActivity = () => {
        localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
        resetTimer();
    };
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
        const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
        if (lastActivity) {
            const diff = Date.now() - Number(lastActivity);
            if (diff > timeout) {
                onIdel(); // lock immediately
            } 
            else {
                // resume remaining time
                timer.current = setTimeout(onIdel,timeout - diff);
            }
        } 
        else 
        {
            localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
            resetTimer();
        }
        events.forEach(event => window.addEventListener(event,updateActivity));

        return ()=>
        {
            events.forEach(event=>window.removeEventListener(event,updateActivity));
            if (timer.current)clearTimeout(timer.current);
        };
    },[])
}

export default useIdeleTimer
