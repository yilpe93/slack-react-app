import React, { VFC, useCallback, useState } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { Redirect, Switch, Route, Link, useParams } from 'react-router-dom';
import gravatar from 'gravatar';
import { toast } from 'react-toastify';
// 코드 스플리팅을 위한 lib
import loadable from '@loadable/component';
import { IChannel, IUser } from '@typings/db';
import useInput from '@hooks/useInput';

import Menu from '@components/Menu';
import Modal from '@components/Modal';
import CreateChannelModal from '@components/CreateChannelModal';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

import { Button, Input, Label } from '@pages/SignUp/styles';

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

const Workspace: VFC = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

  const { workspace } = useParams<{ workspace: string }>();

  /* Get: User */
  const { data: userData, error, revalidate, mutate } = useSWR<IUser | false>('/api/users', fetcher, {
    dedupingInterval: 2000,
  });

  /* Get: Channels */
  const { data: channelData } = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);

  const onLogOut = useCallback(() => {
    axios.post('/api/users/logout', null, { withCredentials: true }).then(() => {
      mutate(false, false);
    });
  }, []);

  const onClickUserProfile = useCallback((e) => {
    e.stopPropagation();
    setShowUserMenu((prev) => !prev);
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
  }, []);

  const onCreateWorkspace = useCallback(
    (e) => {
      e.preventDefault();

      if (!newWorkspace || !newWorkspace.trim()) return;
      if (!newUrl || !newUrl.trim()) return;

      axios
        .post(
          '/api/workspaces',
          {
            workspace: newWorkspace,
            url: newUrl,
          },
          {
            withCredentials: true,
          },
        )
        .then(() => {
          revalidate();
          setShowCreateWorkspaceModal(false);
          setNewWorkspace('');
          setNewUrl('');
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.response?.data, { position: 'bottom-center' });
        });
    },
    [newWorkspace, newUrl],
  );

  const toogleWorkspaceModal = useCallback(() => {
    setShowWorkspaceModal((prev) => !prev);
  }, []);

  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
  }, []);

  if (!userData) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.email} />
            {showUserMenu && (
              <Menu show={showUserMenu} style={{ right: 0, top: 38 }} onCloseModal={onClickUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(userData.email, { s: '36px', d: 'retro' })} alt={userData.email} />
                </ProfileModal>
                <LogOutButton onClick={onLogOut}>로그아웃</LogOutButton>
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {userData?.Workspaces?.map((ws) => {
            return (
              <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
                <WorkspaceButton>{ws.name.slice(0, 1)}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toogleWorkspaceModal}>Sleact</WorkspaceName>
          <MenuScroll>
            <Menu
              show={showWorkspaceModal}
              onCloseModal={toogleWorkspaceModal}
              style={{
                top: 95,
                left: 80,
              }}
            >
              <WorkspaceModal>
                <h2>Sleact</h2>
                <button onClick={onClickAddChannel}>채널 만들기</button>
                <button onClick={onLogOut}>로그아웃</button>
              </WorkspaceModal>
            </Menu>
            {channelData?.map((channel, index) => (
              <div key={index}>{channel.name}</div>
            ))}
          </MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            {/* 중첩 라우터 -> 계층 구조를 유지해야한다. */}
            <Route path="/workspace/:workspace/channel" component={Channel} />
            <Route path="/workspace/:workspace/dm/:id" component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
          </Label>
          <Label id="workspace-url-label">
            <span>워크스페이스 url</span>
            <Input id="workspace-url" value={newUrl} onChange={onChangeNewUrl} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
      <CreateChannelModal
        show={showCreateChannelModal}
        onCloseModal={onCloseModal}
        setShowCreateChannelModal={setShowCreateChannelModal}
      />
    </div>
  );
};

export default Workspace;
