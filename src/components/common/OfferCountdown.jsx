import { useState, useEffect } from 'react';

const calcTimeLeft = (endDate) => {
  const diff = new Date(endDate) - new Date();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  if (days > 0) return `ينتهي بعد ${days} أيام و ${hours} ساعات`;
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return `ينتهي بعد ${hours} ساعات و ${minutes} دقائق`;
};

const OfferCountdown = ({ endDate, className = '' }) => {
  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(endDate));

  useEffect(() => {
    setTimeLeft(calcTimeLeft(endDate));
    const timer = setInterval(() => {
      setTimeLeft(calcTimeLeft(endDate));
    }, 60000);
    return () => clearInterval(timer);
  }, [endDate]);

  if (!timeLeft) return null;

  return (
    <span className={`inline-flex items-center gap-1 text-[11px] text-amber-600 font-medium ${className}`}>
      <span>⏳</span>
      {timeLeft}
    </span>
  );
};

export default OfferCountdown;
