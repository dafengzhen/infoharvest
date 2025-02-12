'use client';

import type { IError } from '@/app/interfaces';
import type { ICollection } from '@/app/interfaces/collection';
import type { IExcerpt } from '@/app/interfaces/excerpt';
import type { SidebarOption } from 'bootstrap-react-logic';
import type { MouseEvent } from 'react';

import { useFetchCollections, useFetchExcerptsByCollectionId } from '@/app/apis/collections';
import { useDeleteExcerpt, useFetchExcerpts } from '@/app/apis/excerpts';
import { useFetchUserProfile, useUpdateUserCustomConfig } from '@/app/apis/users';
import { BLUR_DATA_URL, IMAGE_DATA_URL, IMAGE_ERROR_DATA_URL } from '@/app/constants';
import { getQueryClient } from '@/app/get-query-client';
import ManageCollection from '@/app/home/manage-collection';
import ManageConfig from '@/app/home/manage-config';
import ManageExcerpt from '@/app/home/manage-excerpt';
import { useConfig, useTheme, useUser, useUserWallpaper } from '@/app/hooks';
import useToast from '@/app/hooks/toast';
import { getPublicPath } from '@/app/tools';
import { eventBus } from '@/app/tools/event-bus';
import { EVENT_UNAUTHORIZED } from '@/app/tools/event-types';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Checkbox,
  CloseButton,
  Input,
  Label,
  Modal,
  Sidebar,
} from 'bootstrap-react-logic';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';

const publicPath = getPublicPath();

const loadingPlaceholderOption: SidebarOption = {
  icon: <i className="bi bi-folder"></i>,
  id: 'loading',
  name: 'Loading...',
};

const addCollectionOption: SidebarOption = {
  icon: <i className="bi bi-plus-lg"></i>,
  id: 'addCollection',
  name: 'Add Collection',
};

export default function Home() {
  const [modals, setModals] = useState({
    deleteExcerpt: false,
    logout: false,
  });
  const [sidebarOptions, setSidebarOptions] = useState<SidebarOption[]>([loadingPlaceholderOption]);
  const [activeManagementType, setActiveManagementType] = useState<
    'manageCollection' | 'manageConfig' | 'manageExcerpt' | null
  >(null);
  const [selectedCollection, setSelectedCollection] = useState<ICollection | null>(null);
  const [selectedExcerpt, setSelectedExcerpt] = useState<IExcerpt | null>(null);
  const [excerpts, setExcerpts] = useState<IExcerpt[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const deferredSearchValue = useDeferredValue(searchValue);
  const [isInitialized, setIsInitialized] = useState(false);
  const [includeDescription, setIncludeDescription] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [unlockPassword, setUnlockPassword] = useState('');
  const [useEvery, setUseEvery] = useState(false);

  const lastClickedRef = useRef(0);

  const itemsPerPage = 105;
  const isStale = searchValue !== deferredSearchValue;

  const toastRef = useToast();
  const { isDarkMode, toggleTheme } = useTheme();
  const {
    config: { displayMode, moreOptions },
    updateConfig,
  } = useConfig<{
    displayMode?: 'bordered' | 'borderless';
    moreOptions?: boolean;
  }>();
  const currentUser = useUser();
  const { wallpaperExists } = useUserWallpaper();

  const collectionsQuery = useFetchCollections();
  const fetchExcerptsByCollectionIdQuery = useFetchExcerptsByCollectionId(selectedCollection?.id);
  const excerptsQuery = useFetchExcerpts(!selectedCollection);
  const deleteExcerptQuery = useDeleteExcerpt(selectedExcerpt?.id);
  const updateUserCustomConfigMutation = useUpdateUserCustomConfig(currentUser?.id);

  const filteredExcerpts = useMemo(() => {
    const value = deferredSearchValue.trim();
    if (value) {
      const searchValues = caseSensitive ? value.split(/\s+/) : value.toLowerCase().split(/\s+/);

      return excerpts.filter((item) => {
        const matchFunction = useEvery ? 'every' : 'some';

        const nameMatch = item.names?.some((nameObj) =>
          searchValues[matchFunction]((keyword) =>
            caseSensitive ? nameObj.name.includes(keyword) : nameObj.name.toLowerCase().includes(keyword),
          ),
        );

        const linkMatch = item.links?.some((linkObj) =>
          searchValues[matchFunction]((keyword) =>
            caseSensitive ? linkObj.link.includes(keyword) : linkObj.link.toLowerCase().includes(keyword),
          ),
        );

        if (includeDescription) {
          const descriptionMatch = item.description
            ? searchValues[matchFunction]((keyword) =>
                caseSensitive ? item.description!.includes(keyword) : item.description!.toLowerCase().includes(keyword),
              )
            : false;

          return nameMatch || linkMatch || descriptionMatch;
        } else {
          return nameMatch;
        }
      });
    } else {
      return excerpts;
    }
  }, [caseSensitive, deferredSearchValue, excerpts, includeDescription, useEvery]);
  const paginatedExcerpts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredExcerpts.slice(startIndex, endIndex);
  }, [currentPage, filteredExcerpts]);
  const totalPages = useMemo(() => Math.ceil(filteredExcerpts.length / itemsPerPage), [filteredExcerpts.length]);

  useEffect(() => {
    if (!selectedCollection && excerptsQuery.data) {
      setExcerpts(excerptsQuery.data);
    }
  }, [selectedCollection, excerptsQuery.data]);
  useEffect(() => {
    if (collectionsQuery.data) {
      if (collectionsQuery.data.length === 0) {
        setSidebarOptions([
          {
            ...addCollectionOption,
            onClick: (e) => {
              e.preventDefault();
              setActiveManagementType((prevState) => (prevState === 'manageCollection' ? null : 'manageCollection'));
            },
          },
        ]);
      } else {
        const mapCollectionsToSidebarOptions = (collections: ICollection[]): SidebarOption[] => {
          return collections.map((collection) => ({
            children:
              collection.children && collection.children.length > 0
                ? mapCollectionsToSidebarOptions(collection.children)
                : [],
            icon: <i className="bi bi-folder"></i>,
            id: collection.id,
            name: collection.name,
            onClick: (e) => {
              e.preventDefault();
              setSelectedCollection((prevCollection) => (prevCollection?.id === collection.id ? null : collection));
            },
          }));
        };

        setSidebarOptions(mapCollectionsToSidebarOptions(collectionsQuery.data));
      }
    } else {
      setSidebarOptions([{ ...loadingPlaceholderOption }]);
    }
  }, [collectionsQuery.data]);
  useEffect(() => {
    if (fetchExcerptsByCollectionIdQuery.data) {
      setExcerpts(fetchExcerptsByCollectionIdQuery.data);
    }
  }, [fetchExcerptsByCollectionIdQuery.data]);
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  function handleClickLink(item: IExcerpt) {
    const toast = toastRef.current;
    if (!toast) {
      return;
    }

    const link = item.links[0]?.link;

    if (!link) {
      toast.showToast('Link Not Found', 'danger');
      return;
    }

    try {
      const blank = currentUser?.customConfig?.linkTarget === '_blank';
      window.open(link, blank ? '_blank' : '_self');
    } catch (error) {
      toast.showToast((error as IError).message, 'danger');
    }
  }
  function handleClickLinkThrottled(item: IExcerpt) {
    const now = Date.now();

    if (now - lastClickedRef.current < 500) {
      return;
    }

    lastClickedRef.current = now;
    handleClickLink(item);
  }
  function handleDisplayMode() {
    updateConfig({
      displayMode: displayMode === 'bordered' ? 'borderless' : 'bordered',
    });
  }
  function handleMoreOptions() {
    updateConfig({
      moreOptions: !moreOptions,
    });
  }
  async function handleLockPage() {
    const toast = toastRef.current;
    if (!toast) {
      return;
    }

    if (!currentUser) {
      toast.showToast('The user does not exist, please try again later', 'danger');
      return;
    }

    const locked = currentUser.customConfig.locked;

    if (!locked && !currentUser.customConfig.unlockPassword?.trim()) {
      setActiveManagementType('manageConfig');
      toast.showToast('No unlock password has been set', 'danger');
      return;
    }

    try {
      await updateUserCustomConfigMutation.mutateAsync({
        locked: !locked,
        type: 'user',
      });

      toast.showToast(locked ? 'Unlocked' : 'Locked', 'success');

      void refetchQueriesByKey(useFetchUserProfile.key);
    } catch (error) {
      toast.showToast((error as IError).message, 'danger');
    }
  }
  async function handleUnlockPassword() {
    const toast = toastRef.current;
    if (!toast) {
      return;
    }

    if (!currentUser) {
      toast.showToast('The user does not exist, please try again later', 'danger');
      return;
    }

    const locked = currentUser.customConfig.locked;

    if (!locked) {
      return;
    }

    if (!currentUser.customConfig.unlockPassword?.trim()) {
      toast.showToast('Unlock failed, the password does not exist', 'danger');
      return;
    }

    if (!(currentUser.customConfig.unlockPassword?.trim() === unlockPassword.trim())) {
      toast.showToast('Unlock failed, incorrect password', 'danger');
      return;
    }

    try {
      await updateUserCustomConfigMutation.mutateAsync({
        locked: false,
        type: 'user',
      });

      setUnlockPassword('');

      toast.showToast('Unlocked', 'success');

      void refetchQueriesByKey(useFetchUserProfile.key);
    } catch (error) {
      toast.showToast((error as IError).message, 'danger');
    }
  }
  function handleEditExcerpt(item: IExcerpt) {
    setSelectedExcerpt(item);
    setActiveManagementType('manageExcerpt');
  }
  function handleDeleteExcerpt(item: IExcerpt) {
    setSelectedExcerpt(item);
    toggleModal('deleteExcerpt');
  }
  function handleBackManagement() {
    if (activeManagementType === 'manageExcerpt') {
      setSelectedExcerpt(null);
    }
    setActiveManagementType(null);
  }
  function handleErrorImage(item: IExcerpt) {
    setExcerpts((prevState) => {
      return prevState.map((state) => {
        if (item.id === state.id) {
          return {
            ...state,
            _imageError: true,
          };
        }

        return state;
      });
    });
  }

  function toggleManagementType(type: 'manageCollection' | 'manageConfig' | 'manageExcerpt') {
    setActiveManagementType((prevType) => (prevType === type ? null : type));
  }
  function confirmLogout() {
    eventBus.emit(EVENT_UNAUTHORIZED);
    location.assign(publicPath + '/login');
  }
  function cancelDeleteExcerpt(value: boolean | MouseEvent<HTMLButtonElement> = false) {
    setSelectedExcerpt(null);

    let _value = false;
    if (typeof value === 'boolean') {
      _value = value;
    }

    toggleModal('deleteExcerpt', _value);
  }
  async function confirmDeleteExcerpt() {
    const toast = toastRef.current;
    if (!toast) {
      return;
    }

    if (!selectedExcerpt) {
      toast.showToast('The excerpt to be deleted does not exist', 'danger');
      return;
    }

    try {
      await deleteExcerptQuery.mutateAsync();
      toast.showToast('Deleted successfully', 'success');

      setSelectedExcerpt(null);
      void refetchQueriesByKey(useFetchExcerpts.key);

      if (selectedCollection) {
        void refetchQueriesByKey(useFetchExcerptsByCollectionId.key);
      }

      toggleModal('deleteExcerpt', false);
    } catch (error) {
      toast.showToast((error as IError).message, 'danger');
    }
  }
  function toggleModal(modalName: 'deleteExcerpt' | 'logout', isVisible: boolean = true) {
    setModals((prev) => ({ ...prev, [modalName]: isVisible }));
  }
  async function refetchQueriesByKey(key: string) {
    void getQueryClient().refetchQueries({
      predicate: (query: { queryKey: string[] }) => query.queryKey.includes(key),
      type: 'active',
    });
  }
  function prevPage() {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  }
  function nextPage() {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  }
  function loadMorePage() {
    const toast = toastRef.current;
    if (!toast) {
      return;
    }

    if (currentPage > totalPages || currentPage === totalPages || totalPages === 0) {
      toast.showToast('No more data available', 'primary');
      return;
    }

    nextPage();
  }

  return (
    <>
      <div className={clsx('container-fluid ps-0', currentUser?.customConfig?.locked && 'blur-sm pe-none')}>
        <div className="row">
          <div className="col-auto">
            <Card
              cardBody
              className={clsx('border-0 border-end p-0 rounded-0', wallpaperExists && 'bg-transparent border-end-0')}
            >
              <Sidebar
                className="vh-100"
                footer={
                  <div>
                    <div className="d-flex align-items-center justify-content-between">
                      <Button
                        className={clsx('btn border-0 text-secondary', wallpaperExists && 'cursor-not-allowed')}
                        dropOldClass
                        onClick={() => {
                          if (wallpaperExists) {
                            return;
                          }

                          toggleTheme();
                        }}
                        size="sm"
                        startContent={
                          <i
                            className={clsx('bi me-1', isDarkMode ? 'bi-moon-stars-fill' : 'bi-brightness-high-fill')}
                          ></i>
                        }
                        title="Toggle Theme"
                      >
                        {isDarkMode ? 'Dark' : 'Light'}
                      </Button>

                      <Button
                        className="btn border-0 text-secondary"
                        dropOldClass
                        onClick={() => toggleModal('logout')}
                        size="sm"
                        startContent={<i className="bi bi-box-arrow-in-right cursor-pointer me-1" title="Logout" />}
                        title="Logout"
                      >
                        Logout
                      </Button>
                    </div>

                    {typeof window !== 'undefined' &&
                      (window as { infoharvestExtension?: { installed?: boolean } }).infoharvestExtension
                        ?.installed && (
                        <>
                          <hr />

                          <div
                            className="text-secondary text-opacity-75 small mx-auto text-center"
                            style={{ width: 120 }}
                          >
                            Hint: Press <kbd className="text-secondary bg-transparent">Ctrl + L</kbd> (or&nbsp;
                            <kbd className="text-secondary bg-transparent">Cmd + L</kbd> on Mac) to focus the address
                            bar.
                          </div>
                        </>
                      )}
                  </div>
                }
                header={{
                  icon: (
                    <Link href="./">
                      <Image
                        alt="Infoharvest"
                        className="rounded-circle"
                        height={36}
                        priority
                        src={publicPath + '/images/logo.png'}
                        width={36}
                      />
                    </Link>
                  ),
                  name: (
                    <Link className="text-decoration-none link-body-emphasis fs-5" href="./">
                      Infoharvest
                    </Link>
                  ),
                }}
                onOptionChange={setSidebarOptions}
                options={sidebarOptions}
                preventToggleActive
              />
            </Card>
          </div>
          <div className="col vh-100 d-flex flex-column px-0">
            <div className="flex-shrink-0 container-fluid py-3">
              <div className="row">
                <div className="col"></div>
                <div className="col">
                  <div className="row row-cols-auto g-2 justify-content-end">
                    <div className="col">
                      <Button
                        active={activeManagementType === 'manageExcerpt'}
                        className="w-100"
                        onClick={() => toggleManagementType('manageExcerpt')}
                        outline="secondary"
                        rounded="pill"
                        size="sm"
                        startContent={<i className="bi bi-tag me-1"></i>}
                      >
                        Manage Excerpt
                      </Button>
                    </div>
                    <div className="col">
                      <Button
                        active={activeManagementType === 'manageCollection'}
                        className="w-100"
                        onClick={() => toggleManagementType('manageCollection')}
                        outline="secondary"
                        rounded="pill"
                        size="sm"
                        startContent={<i className="bi bi-question-diamond me-1"></i>}
                      >
                        Manage Collection
                      </Button>
                    </div>
                    <div className="col">
                      <Button
                        active={activeManagementType === 'manageConfig'}
                        className="w-100"
                        onClick={() => toggleManagementType('manageConfig')}
                        outline="secondary"
                        rounded="pill"
                        size="sm"
                        startContent={<i className="bi bi-gear me-1"></i>}
                      >
                        Manage Config
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {!activeManagementType && (
                <>
                  <div className="container py-3">
                    <div className="vstack gap-2">
                      <Label className={clsx(wallpaperExists ? 'text-light' : 'text-secondary')}>Search</Label>
                      <Input
                        className={clsx(wallpaperExists && 'bg-transparent')}
                        endContent={<i className="bi bi-search text-secondary"></i>}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Please enter"
                        startEndContentClasses={{
                          container: (originalClass) => clsx(originalClass, 'w-100'),
                        }}
                        type="search"
                        value={searchValue}
                      />
                      <div className="d-flex gap-3">
                        <div className="d-flex gap-2">
                          <Checkbox
                            checked={includeDescription}
                            className={clsx(wallpaperExists && 'bg-transparent')}
                            id="includeContent"
                            name="includeContent"
                            onChange={(e) => setIncludeDescription(e.target.checked)}
                            value="includeContent"
                          />
                          <Label
                            className={clsx('user-select-none', wallpaperExists ? 'text-light' : 'text-secondary')}
                            formCheckLabel
                            htmlFor="includeContent"
                          >
                            Include Description
                          </Label>
                        </div>

                        <div className="d-flex gap-2">
                          <Checkbox
                            checked={caseSensitive}
                            className={clsx(wallpaperExists && 'bg-transparent')}
                            id="caseSensitive"
                            name="caseSensitive"
                            onChange={(e) => setCaseSensitive(e.target.checked)}
                            value="caseSensitive"
                          />
                          <Label
                            className={clsx('user-select-none', wallpaperExists ? 'text-light' : 'text-secondary')}
                            formCheckLabel
                            htmlFor="caseSensitive"
                          >
                            Case Sensitive
                          </Label>
                        </div>

                        <div className="d-flex gap-2">
                          <Checkbox
                            checked={useEvery}
                            className={clsx(wallpaperExists && 'bg-transparent')}
                            id="matchAllWords"
                            name="matchAllWords"
                            onChange={(e) => setUseEvery(e.target.checked)}
                            value="matchAllWords"
                          />
                          <Label
                            className={clsx('user-select-none', wallpaperExists ? 'text-light' : 'text-secondary')}
                            formCheckLabel
                            htmlFor="matchAllWords"
                          >
                            Match All Words
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="container py-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <div></div>

                      <div className="row row-cols-auto g-0">
                        <div className="col">
                          <Button
                            className="text-decoration-none text-secondary w-100"
                            onClick={handleLockPage}
                            rounded="pill"
                            startContent={
                              <i
                                className={clsx(
                                  'bi me-1',
                                  currentUser?.customConfig?.locked ? 'bi-lock' : 'bi-unlock',
                                  wallpaperExists && 'text-light',
                                )}
                              ></i>
                            }
                            variant="link"
                          >
                            {currentUser?.customConfig?.locked ? 'Enter Page' : 'Exit Page'}
                          </Button>
                        </div>

                        {paginatedExcerpts.length > 0 && (
                          <>
                            <div className="col">
                              <Button
                                className="text-decoration-none text-secondary w-100"
                                onClick={handleDisplayMode}
                                rounded="pill"
                                startContent={
                                  <i
                                    className={clsx(
                                      'bi me-1',
                                      displayMode === 'bordered' ? 'bi-chevron-expand' : 'bi-chevron-contract',
                                      wallpaperExists && 'text-light',
                                    )}
                                  ></i>
                                }
                                variant="link"
                              >
                                Display Mode
                              </Button>
                            </div>

                            <div className="col">
                              <Button
                                className="text-decoration-none text-secondary w-100"
                                onClick={handleMoreOptions}
                                rounded="pill"
                                startContent={
                                  <i
                                    className={clsx(
                                      'bi me-1',
                                      moreOptions ? 'bi-x' : 'bi-sliders',
                                      wallpaperExists && 'text-light',
                                    )}
                                  ></i>
                                }
                                variant="link"
                              >
                                Options
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex-grow-1 overflow-y-auto">
              {activeManagementType ? (
                <div className="container py-3">
                  {activeManagementType === 'manageCollection' && (
                    <ManageCollection collection={selectedCollection} onBack={handleBackManagement} />
                  )}
                  {activeManagementType === 'manageExcerpt' && (
                    <ManageExcerpt
                      collection={selectedCollection}
                      excerpt={selectedExcerpt}
                      onBack={handleBackManagement}
                    />
                  )}
                  {activeManagementType === 'manageConfig' && <ManageConfig onBack={handleBackManagement} />}
                </div>
              ) : (
                <>
                  <div
                    className="container py-3"
                    style={{
                      opacity: isStale ? 0.5 : 1,
                      transition: isStale ? 'opacity 0.2s 0.2s linear' : 'opacity 0s 0s linear',
                    }}
                  >
                    <div className="row row-cols-auto g-3">
                      {paginatedExcerpts.length > 0 ? (
                        paginatedExcerpts.map((item) => {
                          return (
                            <div className="col" key={item.id}>
                              {displayMode === 'bordered' ? (
                                <Card
                                  className={clsx(
                                    'rounded-4 border shadow-sm-hover cursor-pointer-hover position-relative',
                                    selectedExcerpt?.id === item.id && 'border-primary-subtle',
                                    wallpaperExists ? 'wallpaper-bg-black' : 'bg-transparent',
                                  )}
                                  onClick={() => handleClickLinkThrottled(item)}
                                  style={{
                                    minHeight: 100,
                                    minWidth: 100,
                                  }}
                                >
                                  <Card
                                    className={clsx(
                                      'hover-card-body bg-transparent border-0 max-h-max pt-2',
                                      !moreOptions && 'hover-card-body-pointer',
                                    )}
                                    onClick={(e) => {
                                      if (moreOptions) {
                                        e.stopPropagation();
                                      }
                                    }}
                                  >
                                    <CardBody className="text-center bg-transparent rounded px-2">
                                      {moreOptions && (
                                        <div className="d-flex flex-wrap justify-content-evenly pt-1">
                                          <i
                                            className="bi bi-pencil-square fs-5 text-primary cursor-pointer d-flex"
                                            onClick={() => handleEditExcerpt(item)}
                                          ></i>
                                          <i
                                            className="bi bi-trash fs-5 text-danger cursor-pointer d-flex"
                                            onClick={() => handleDeleteExcerpt(item)}
                                          ></i>
                                          <i
                                            className="bi bi-link-45deg fs-5 text-info cursor-pointer d-flex"
                                            onClick={() => handleClickLinkThrottled(item)}
                                          ></i>
                                        </div>
                                      )}
                                    </CardBody>
                                  </Card>
                                  <CardBody className="overflow-hidden p-0 mx-auto pt-2">
                                    {item._imageError ? (
                                      <Image alt="Icon" height={50} priority src={IMAGE_ERROR_DATA_URL} width={50} />
                                    ) : (
                                      <>
                                        {item.icon || item.darkIcon ? (
                                          <Image
                                            alt="Icon"
                                            blurDataURL={BLUR_DATA_URL}
                                            className="object-fit-cove"
                                            height={50}
                                            onError={() => handleErrorImage(item)}
                                            placeholder="blur"
                                            priority
                                            src={(isDarkMode && item.darkIcon ? item.darkIcon : item.icon)!}
                                            width={50}
                                          />
                                        ) : (
                                          <Image alt="Icon" height={50} priority src={IMAGE_DATA_URL} width={50} />
                                        )}
                                      </>
                                    )}
                                  </CardBody>
                                  <CardFooter className="bg-transparent border-top-0 d-flex flex-wrap gap-2 align-items-center justify-content-center">
                                    <Link
                                      className={clsx(
                                        wallpaperExists ? 'text-light' : 'text-muted',
                                        moreOptions
                                          ? 'link-offset-2 link-underline link-underline-opacity-0 link-underline-opacity-100-hover'
                                          : 'text-decoration-none',
                                      )}
                                      href={item.links[0]?.link || ''}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (!item.links[0]?.link) {
                                          e.preventDefault();
                                          handleClickLinkThrottled(item);
                                        }
                                      }}
                                      rel="noopener noreferrer nofollow"
                                      target={currentUser?.customConfig?.linkTarget === '_blank' ? '_blank' : '_self'}
                                    >
                                      {item.names[0].name || 'Unknown'}
                                    </Link>
                                  </CardFooter>
                                </Card>
                              ) : (
                                <Card
                                  className={clsx(
                                    'rounded-4 border border-transparent border-hover shadow-sm-hover cursor-pointer-hover',
                                    selectedExcerpt?.id === item.id && 'border-primary-subtle',
                                    wallpaperExists ? 'wallpaper-bg-black' : 'bg-transparent',
                                  )}
                                  onClick={() => handleClickLinkThrottled(item)}
                                  style={{
                                    minHeight: 100,
                                    minWidth: 100,
                                  }}
                                >
                                  <Card
                                    className={clsx(
                                      'hover-card-body bg-transparent border-0 max-h-max pt-2',
                                      !moreOptions && 'hover-card-body-pointer',
                                    )}
                                    onClick={(e) => {
                                      if (moreOptions) {
                                        e.stopPropagation();
                                      }
                                    }}
                                  >
                                    <CardBody className="text-center bg-transparent rounded px-2">
                                      {moreOptions && (
                                        <div className="d-flex flex-wrap justify-content-evenly pt-1">
                                          <i
                                            className="bi bi-pencil-square fs-5 text-primary cursor-pointer d-flex"
                                            onClick={() => handleEditExcerpt(item)}
                                          ></i>
                                          <i
                                            className="bi bi-trash fs-5 text-danger cursor-pointer d-flex"
                                            onClick={() => handleDeleteExcerpt(item)}
                                          ></i>
                                          <i
                                            className="bi bi-link-45deg fs-5 text-info cursor-pointer d-flex"
                                            onClick={() => handleClickLinkThrottled(item)}
                                          ></i>
                                        </div>
                                      )}
                                    </CardBody>
                                  </Card>
                                  <CardBody className="overflow-hidden p-0 mx-auto pt-2">
                                    <Card cardBody className="rounded-4 border-0 p-0 bg-transparent">
                                      {item._imageError ? (
                                        <Image alt="Icon" height={50} priority src={IMAGE_ERROR_DATA_URL} width={50} />
                                      ) : (
                                        <>
                                          {item.icon || item.darkIcon ? (
                                            <Image
                                              alt="Icon"
                                              blurDataURL={BLUR_DATA_URL}
                                              className="object-fit-cove"
                                              height={50}
                                              onError={() => handleErrorImage(item)}
                                              placeholder="blur"
                                              priority
                                              src={(isDarkMode && item.darkIcon ? item.darkIcon : item.icon)!}
                                              width={50}
                                            />
                                          ) : (
                                            <Image alt="Icon" height={50} priority src={IMAGE_DATA_URL} width={50} />
                                          )}
                                        </>
                                      )}
                                    </Card>
                                  </CardBody>
                                  <CardFooter className="bg-transparent border-top-0 d-flex flex-wrap gap-2 align-items-center justify-content-center">
                                    <Link
                                      className={clsx(
                                        wallpaperExists ? 'text-light' : 'text-muted',
                                        moreOptions
                                          ? 'link-offset-2 link-underline link-underline-opacity-0 link-underline-opacity-100-hover'
                                          : 'text-decoration-none',
                                      )}
                                      href={item.links[0]?.link || ''}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (!item.links[0]?.link) {
                                          e.preventDefault();
                                          handleClickLinkThrottled(item);
                                        }
                                      }}
                                      rel="noopener noreferrer nofollow"
                                      target={currentUser?.customConfig?.linkTarget === '_blank' ? '_blank' : '_self'}
                                    >
                                      {item.names[0].name || 'Unknown'}
                                    </Link>
                                  </CardFooter>
                                </Card>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="col-12" style={{ height: 420 }}>
                          <Card
                            cardBody
                            className={clsx(
                              'h-100 rounded-4 border d-flex align-items-center justify-content-center',
                              wallpaperExists ? 'bg-transparent' : 'bg-body-tertiary',
                            )}
                          >
                            <div className={clsx('fs-5 text-opacity-50', !wallpaperExists && 'text-secondary')}>
                              No Data
                            </div>
                          </Card>
                        </div>
                      )}
                    </div>
                  </div>

                  {(currentPage > totalPages || totalPages > 1) && excerpts.length > 0 && (
                    <div>
                      <div className="container py-3 pb-4">
                        <div className="row">
                          {currentPage > totalPages && excerpts.length > 0 && filteredExcerpts.length > 0 && (
                            <div className="col">
                              <Button
                                className="w-100"
                                onClick={() => setCurrentPage(1)}
                                type="button"
                                variant="secondary"
                              >
                                Back to Home
                              </Button>
                            </div>
                          )}

                          <div className="col">
                            <Button
                              className="w-100"
                              disabled={currentPage === 1}
                              onClick={prevPage}
                              type="button"
                              variant="primary"
                            >
                              Prev Page
                            </Button>
                          </div>
                          <div className="col">
                            <Button
                              className="w-100"
                              disabled={currentPage > totalPages}
                              onClick={loadMorePage}
                              type="button"
                              variant="primary"
                            >
                              {currentPage > totalPages ? 'Load More' : `Load More (${currentPage} - ${totalPages})`}
                            </Button>
                          </div>
                          <div className="col">
                            <Button
                              className="w-100"
                              disabled={currentPage > totalPages || currentPage === totalPages || totalPages === 0}
                              onClick={nextPage}
                              type="button"
                              variant="primary"
                            >
                              Next Page
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {currentUser?.customConfig?.locked && (
        <Card cardBody className="position-absolute top-50 start-50 translate-middle border-0 bg-transparent">
          <div className="d-flex align-items-center gap-3">
            <Input
              autoFocus
              className={clsx(
                'bg-transparent',
                currentUser.customConfig.unlockPassword === unlockPassword
                  ? 'is-valid'
                  : unlockPassword && 'is-invalid',
              )}
              disabled={updateUserCustomConfigMutation.isPending}
              name="unlockPassword"
              onChange={(e) => setUnlockPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  void handleUnlockPassword();
                }
              }}
              placeholder="Enter unlock password"
              type="password"
              value={unlockPassword}
            />

            <Button
              disabled={updateUserCustomConfigMutation.isPending}
              isLoading={updateUserCustomConfigMutation.isPending}
              onClick={handleUnlockPassword}
              type="button"
              variant="secondary"
            >
              <i className="bi bi-unlock"></i>
            </Button>
          </div>
        </Card>
      )}

      {isInitialized && (
        <>
          <Modal
            body={
              <div className="leading-normal">
                <div>Are you sure you want to log out?</div>
                <div className="text-secondary">You will not be able to continue browsing after logging out.</div>
              </div>
            }
            centered
            footer={
              <>
                <Button onClick={() => toggleModal('logout', false)} type="button" variant="secondary">
                  Cancel
                </Button>
                <Button onClick={confirmLogout} type="button" variant="primary">
                  Confirm
                </Button>
              </>
            }
            header={<CloseButton onClick={() => toggleModal('logout', false)} type="button" />}
            onVisibleChange={(value) => toggleModal('logout', value)}
            tabIndex={-1}
            title={currentUser ? currentUser.username : 'Infoharvest'}
            visible={modals.logout}
          />

          <Modal
            body={
              <div className="leading-normal">
                <div>Are you sure you want to delete this excerpt?</div>
                {selectedExcerpt && (
                  <div className="text-secondary">
                    <span>Excerpt:&nbsp;</span>
                    <span className="text-danger fw-bold">
                      {selectedExcerpt.links[0]?.link
                        ? `[ ${selectedExcerpt.names[0]?.name || 'Unknown'} ] ( ${selectedExcerpt.links[0].link} )`
                        : selectedExcerpt.names[0]?.name || 'Unknown'}
                    </span>
                  </div>
                )}
              </div>
            }
            centered
            footer={
              <>
                <Button onClick={cancelDeleteExcerpt} type="button" variant="secondary">
                  Cancel
                </Button>
                <Button onClick={confirmDeleteExcerpt} type="button" variant="primary">
                  Delete
                </Button>
              </>
            }
            header={<CloseButton onClick={cancelDeleteExcerpt} type="button" />}
            onVisibleChange={cancelDeleteExcerpt}
            tabIndex={-1}
            title="Infoharvest"
            visible={modals.deleteExcerpt}
          />
        </>
      )}
    </>
  );
}
