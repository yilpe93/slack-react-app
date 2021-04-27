import fetcher from '@utils/fetcher';
import React, { FC, useCallback } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { Redirect } from 'react-router';

import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from './styles';

const Workspace: FC = ({ children }) => {
  const { data, error, revalidate, mutate } = useSWR('/api/users', fetcher);

  const onLogout = useCallback(() => {
    axios.post('/api/users/logout', null, { withCredentials: true }).then(() => {
      mutate(false, false);
    });
  }, []);

  if (!data) {
    return <Redirect to="/login" />;
  }

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
