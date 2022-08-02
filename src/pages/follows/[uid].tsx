import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

import { AppHeader } from '@components/Headers';
import Follow from '@components/Follow';
import { getUserInfo } from '@store/features/user/request';
import { IUserInfo } from '@types';

const Follows: React.FC = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = React.useState<IUserInfo>();

  const activeIndex = Number(router.query?.activeIndex ?? 0);

  const init = async () => {
    const uid = router.query?.uid as string;
    if (!uid) {
      return;
    }

    const result = await getUserInfo(uid);
    const user = result.data['data'] as IUserInfo;
    setUserInfo(user);
  };

  useEffect(() => {
    init();
  }, [router.query]);

  return (
    <>
      <AppHeader />
      <Follow defaultActiveIndex={activeIndex} userInfo={userInfo} />
    </>
  );
};

export default Follows;
