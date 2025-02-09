import { useState, useEffect } from 'react';

const InlineCountdownTimer = () => {
  // Helper function to compute the number of seconds remaining
  const calculateTimeLeft = () => {
    const now = new Date();
    // Note: In JavaScript, months are 0-indexed (0 = January, 1 = February, etc.)
    const start = new Date(2025, 1, 10, 0, 0, 0); // Feb 10, 2025 00:00:00
    const end = new Date(2025, 1, 11, 0, 0, 0);   // Feb 11, 2025 00:00:00

    let target;

    if (now < start) {
      // Before Feb 10, count down to the start of the event.
      target = start;
    } else if (now >= start && now < end) {
      // During the event period, count down to Feb 11.
      target = end;
    } else {
      // After Feb 11, the countdown is over.
      return 0;
    }

    // Return the total seconds remaining until the target.
    return Math.floor((target.getTime() - now.getTime()) / 1000);
  };

  // Initialize state with the current remaining seconds.
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      
      // When the countdown is complete, clear the interval.
      if (newTimeLeft <= 0) {
        clearInterval(timer);
      }
      
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Convert total seconds into hours, minutes, seconds.
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <span className="text-xs text-blue-600 font-semibold">
      ({String(hours).padStart(2, '0')}:
      {String(minutes).padStart(2, '0')}:
      {String(seconds).padStart(2, '0')} left)
    </span>
  );
};

export default InlineCountdownTimer;
