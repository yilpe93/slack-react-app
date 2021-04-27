import fetcher from '@utils/fetcher';
import React, { FC, useCallback } from 'react';
import useSWR from 'swr';
import axios from 'axios';

const Workspace: FC = ({ children }) => {
  const { data, error, revalidate } = useSWR('/api/users', fetcher);

  const onLogout = useCallback(() => {
    axios.post('/api/users/logout', null, { withCredentials: true }).then(() => {
      revalidate();
    });
  }, []);

  return (
    <div>
      <p>
        <button onClick={onLogout}>로그아웃</button>;
      </p>
      {children}
    </div>
  );
};

export default Workspace;
