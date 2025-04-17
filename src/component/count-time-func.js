import { useState, useEffect } from "react";

function CountdownTimer({startTime = 300, setIsTimer}){
  const [timeLeft, setTimeLeft] = useState(startTime);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

useEffect(()=>{
  if(!timeLeft){
    setIsTimer(true)
  }
}, [timeLeft])

  return (
    
      <p className="text-base text-slate-500">{formatTime(timeLeft)}</p>
    
  );
};

export default CountdownTimer;
