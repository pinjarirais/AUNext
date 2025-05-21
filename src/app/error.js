'use client';

import React, { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.log("Error caught:", error.message);
  }, [error]);

  return (
    <div>
      <p className='text-red-400'>{error.message}</p>
      {/* <button onClick={() => reset()}>Try Again</button> */}
    </div>
  );
}
