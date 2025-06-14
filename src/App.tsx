import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import LanguageChanger from './components/LanguageChanger';
import UserCard from './components/UserCard';
import { User, UserType } from './type';
import './App.css';

const App = () => {
  const { t } = useTranslation();

  const [username, setUsername] = useState('');
  const [notFollowing, setNotFollowing] = useState<User[]>([]);
  const [notFollowers, setNotFollowers] = useState<User[]>([]);


  useEffect(() => {
    document.title = t('pageTitle');
  }, [t]);


  const getAll = async () => {
    setNotFollowing([]);
    setNotFollowers([]);

    const loadingToast = toast.loading(t('fetchingData'));

    const token = import.meta.env.VITE_GH_TOKEN;

    const headers = {
      Authorization: `token ${token}`,
    };

    const userResponse = await fetch(`https://api.github.com/users/${username}`, {
      headers
    });
    const userData = await userResponse.json();

    if (userResponse.status === 403) {
      toast.dismiss(loadingToast);
      toast.error(t('apiRateLimit'));
      setUsername('');
      return;
    }

    if (userResponse.status === 404) {
      toast.dismiss(loadingToast);
      toast.error(t('userNotFound'));
      setUsername('');
      return;
    }

    const fetchedUser = {
      username: userData.login,
      following: userData.following,
      followers: userData.followers,
    };

    const { followers, following } = fetchedUser;

    if (following > 2000 || followers > 2000) {
      const maxDataLabel = following >= followers ? t('following') : t('followers');
      const maxDataCount = new Intl.NumberFormat('id-ID').format(Math.max(following, followers));
      toast.dismiss(loadingToast);
      toast.error(t('tooManyData', { dataLabel: maxDataLabel, dataCount: maxDataCount }));
      setUsername('');
      return;
    }

    const updateToast = (msg: string) => {
      toast.loading(msg, { id: loadingToast });
    };

    const fetchAll = async (url: string, total: number, label: string, updateToast: (message: string) => void) => {
      let page = 1;
      let results: User[] = [];

      while (true) {
        const response = await fetch(`${url}?per_page=100&page=${page}`, { headers });
        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) break;

        results = results.concat(data);

        const percent = Math.min(Math.round((results.length / total) * 100), 100);
        updateToast(`${t('fetching')} ${t(label)}: ${percent}%`);

        page++;
      }

      return results;
    };

    const followingData = (await fetchAll(
      `https://api.github.com/users/${username}/following`,
      following,
      t('following'),
      updateToast
    )).filter((user: User) => user.type === UserType.User);

    const followersData = await fetchAll(
      `https://api.github.com/users/${username}/followers`,
      followers,
      t('followers'),
      updateToast
    );

    getNotFollowing(followingData, followersData);
    getNotFollowers(followingData, followersData);

    toast.dismiss(loadingToast);
    toast.success(t('dataSuccessfullyFetched'));
  }

  const getNotFollowing = (following: User[], followers: User[]) => {
    const followerSet = new Set(followers.map(user => user.login));
    const notFollowingData = following.filter(user => !followerSet.has(user.login));
    setNotFollowing(notFollowingData);
  };

  const getNotFollowers = (following: User[], followers: User[]) => {
    const followingSet = new Set(following.map(user => user.login));
    const notFollowersData = followers.filter(user => !followingSet.has(user.login));
    setNotFollowers(notFollowersData);
  };




  return (
    <>
      <Toaster position="top-right" />
      <div className="bg-github-bg min-h-dvh flex flex-col pt-10 px-5 pb-5 gap-y-10">
        <div className="flex flex-col items-center gap-y-5 text-center">
          <h1 className="text-github-text-primary font-semibold text-2xl">{t('title')}</h1>
          <p className="text-github-text-secondary w-full sm:w-2/3">{t('tagline')}</p>
        </div>

        <div className="text-github-text-secondary italic w-full sm:w-2/3 mx-auto bg-github-card rounded-r-lg p-5 border-l-[6px] border-solid border-github-text-secondary">
          <p>📝 <strong>{t('note')}:</strong> {t('noteText')}<br /><br />
            ⚠️ <strong>{t('heavyDataWarningTitle')}:</strong> {t('heavyDataWarningText')}</p>
        </div>

        <div className="flex justify-center w-full sm:w-2/3 mx-auto">
          <input
            className="md:w-5/6 w-2/3 bg-github-card text-github-text-primary p-2 outline-none rounded-l-lg placeholder:text-github-text-placeholder border border-solid border-github-border-primary"
            type="text"
            placeholder={t('usernameInput')} value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (!!username && e.key === 'Enter') {
                getAll();
              }
            }}
          />
          <button
            className="md:w-1/6 w-1/3 bg-github-button-primary-bg opacity-80 disabled:hover:opacity-80 hover:opacity-100 transition-all text-github-button-primary-text p-2 rounded-r-lg"
            type="button"
            disabled={!username}
            onClick={getAll}>
            {t('usernameInputButton')}
          </button>
        </div>

        <div className="flex flex-col justify-center w-full sm:w-2/3 mx-auto gap-5">
          <h2 className="text-github-text-primary font-semibold text-xl">{t('notFollowing')} ({notFollowing.length})</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {notFollowing.map((data) => (
              <UserCard key={data.login} data={data} btnText={t('unfollow')} />
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center w-full sm:w-2/3 mx-auto gap-5">
          <h2 className="text-github-text-primary font-semibold text-xl">{t('notFollowers')} ({notFollowers.length})</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {notFollowers.map((data) => (
              <UserCard key={data.login} data={data} btnText={t('follow')} />
            ))}
          </div>
        </div>

        <div>
          <p className="text-github-text-primary italic text-end">Developed by <a className="hover:underline" href="https://github.com/NaufalK25" rel="noopener noreferrer">@NaufalK25</a></p>
        </div>
      </div>

      <LanguageChanger />
    </>
  )
}

export default App
