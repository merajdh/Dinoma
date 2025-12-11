import { setUser } from '../utils/auth';

import React, { useEffect, useState } from 'react';

const MainWrapper = ({ children }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = async () => {
      setLoading(true);
      await setUser();
      setLoading(false);
    };
    handler();
  }, []);
  return <>{loading ? null : children}</>;
};

export default MainWrapper;
