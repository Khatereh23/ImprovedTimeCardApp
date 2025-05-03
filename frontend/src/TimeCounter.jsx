import React, { useState, useEffect } from 'react';
import { userAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const TimeCounter = () => {
  const [seconds, setSeconds] = useState(0);
  const navigate = useNavigate();
  const handlePunchOut = async (e) => {
    e.preventDefault();
    try {
        navigate("/Dashboard");
    } catch (err) {
        console.error("Error", err);
        }
    console.log("Punched Out at", new Date().toISOString());
    }
    
  // Pad numbers to double digits
  const pad = (val) => (val > 9 ? val : "0" + val);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  const hours = pad(Math.floor(seconds / 3600));
  const mins = pad(Math.floor(seconds / 60));
  const secs = pad(seconds % 60);

  return (
    <div className="text-2xl font-mono">
      <span>{hours}</span>:<span>{mins}</span>:<span>{secs}</span>
      <button
            type="button"
            onClick={handlePunchOut}

            className={'w-full py-3 rounded text-white font-semibold'}
        >
            Punch Out
        </button>
    </div>
  );
};

export default TimeCounter;
