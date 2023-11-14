import { useContext, useEffect, useRef, useState } from 'react';
import { GlobalContext } from '@/app/contexts';
import * as CountUpModule from 'countup.js';
import clsx from 'clsx';
import type {
  IBookmark,
  IFolder,
  IParseBookmarkResults,
} from '@/app/bookmarks/bookmarks';
import { formatCurrentDateTime } from '@/app/common/client';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import CheckLinkValidityAction from '@/app/actions/check-link-validity-action';
import ImportBookmarkAction from '@/app/actions/import-bookmark-action';
import UserProfileAction from '@/app/actions/user-profile-action';
import { useRouter } from 'next/navigation';

export interface IInvalidLink {
  name: string;
  href: string;
  status: number;
}

export default function ParsingCompleted({
  data,
  onClickReturn,
}: {
  data: IParseBookmarkResults;
  onClickReturn: () => void;
}) {
  const router = useRouter();
  const [viewExtractedData, setViewExtractedData] = useState(false);
  const [exportContent, setExportContent] = useState('');
  const [copying, setCopying] = useState(false);
  const [checking, setChecking] = useState(false);
  const { toast } = useContext(GlobalContext);
  const folderCountUpRef = useRef<HTMLDivElement>(null);
  const linkCountUpRef = useRef<HTMLDivElement>(null);
  const otherCountUpRef = useRef<HTMLDivElement>(null);
  const [importing, setImporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isCheckLinkStatus, setIsCheckLinkStatus] = useState(false);
  const [invalidLinks, setInvalidLinks] = useState<IInvalidLink[]>([]);
  const [cleanedData, setCleanedData] = useState<IParseBookmarkResults>({
    ...data,
    folders: cleanData(data.folders),
  });

  useEffect(() => {
    const folderCountUp = folderCountUpRef.current;
    let countUpAnim: any;
    if (folderCountUp) {
      countUpAnim = new CountUpModule.CountUp(
        folderCountUp,
        cleanedData.folderCount,
      );
      if (!countUpAnim.error) {
        countUpAnim.start();
      } else {
        console.error(countUpAnim.error);
      }
    }

    return () => {
      if (folderCountUp && countUpAnim) {
        countUpAnim = null;
      }
    };
  }, []);
  useEffect(() => {
    const linkCountUp = linkCountUpRef.current;
    let countUpAnim: any;
    if (linkCountUp) {
      countUpAnim = new CountUpModule.CountUp(
        linkCountUp,
        cleanedData.linkCount,
      );
      if (!countUpAnim.error) {
        countUpAnim.start();
      } else {
        console.error(countUpAnim.error);
      }
    }

    return () => {
      if (linkCountUp && countUpAnim) {
        countUpAnim = null;
      }
    };
  }, []);
  useEffect(() => {
    const otherCountUp = otherCountUpRef.current;
    let countUpAnim: any;
    if (otherCountUp) {
      countUpAnim = new CountUpModule.CountUp(
        otherCountUp,
        cleanedData.otherBookmarkCount,
      );
      if (!countUpAnim.error) {
        countUpAnim.start();
      } else {
        console.error(countUpAnim.error);
      }
    }

    return () => {
      if (otherCountUp && countUpAnim) {
        countUpAnim = null;
      }
    };
  }, []);

  const checkLinkValidityMutation = useMutation({
    mutationFn: CheckLinkValidityAction,
  });
  const importBookmarkMutation = useMutation({
    mutationFn: ImportBookmarkAction,
  });

  async function onClickImportParsedData() {
    if (checking) {
      toast.current.showToast({
        type: 'warning',
        message: 'Checking link validity status',
      });
      return;
    }

    if (importing) {
      toast.current.showToast({
        type: 'warning',
        message: 'Please wait for parsing to complete',
      });
      return;
    }

    const folders = cleanedData.folders;
    if (folders.length === 0) {
      toast.current.showToast({
        type: 'info',
        message: 'The data is empty, skip importing',
      });
      return;
    }

    try {
      setImporting(true);

      try {
        await UserProfileAction();
      } catch (_) {
        toast.current.showToast({
          type: 'warning',
          message: 'Sorry, you need to log in to import data',
          duration: 1000,
        });

        toast.current.showToast({
          type: 'warning',
          message: 'Jump to the login page after two seconds',
          duration: 2000,
        });

        setTimeout(() => {
          router.push('/login');
        }, 2000);
        return;
      }

      await importBookmarkMutation.mutateAsync(folders);

      toast.current.showToast({
        type: 'success',
        message: `Import bookmark completed`,
        duration: 1500,
      });
    } catch (e: any) {
      importBookmarkMutation.reset();
      toast.current.showToast({
        type: 'warning',
        message: [e.message, 'Sorry, importing failed'],
      });
    } finally {
      setImporting(false);
    }
  }

  async function checkLinkStatus() {
    if (checking) {
      toast.current.showToast({
        type: 'warning',
        message: 'Checking link validity status',
      });
      return;
    }

    if (importing) {
      toast.current.showToast({
        type: 'warning',
        message: 'Please wait for parsing to complete',
      });
      return;
    }

    const folders = cleanedData.folders;
    if (folders.length === 0) {
      toast.current.showToast({
        type: 'info',
        message: 'The data is empty, skip checking',
      });
      return;
    }

    try {
      setChecking(true);

      // Minimize privacy issues, so only the link address is passed
      const bookmarks = flattenBookmarks(cleanedData.folders);
      const filter = bookmarks.filter((item) => item.href);
      if (filter.length === 0) {
        toast.current.showToast({
          type: 'info',
          message: 'href value does not exist, skip checking',
        });
        return;
      }

      const responses = await checkLinkValidityMutation.mutateAsync(
        filter.map((item) => item.href),
      );
      setInvalidLinks(
        responses.map((response, index) => ({
          ...response,
          name: bookmarks[index].name,
        })),
      );

      toast.current.showToast({
        type: 'success',
        message: `Check completed`,
        duration: 1500,
      });
    } catch (e: any) {
      checkLinkValidityMutation.reset();
      toast.current.showToast({
        type: 'warning',
        message: [e.message, 'Sorry, checking failed'],
      });
    } finally {
      setChecking(false);
    }
  }

  function onClickViewExtractedData() {
    if (!viewExtractedData) {
      setExportContent(JSON.stringify(cleanedData.folders, null, 2));
    }

    setViewExtractedData(!viewExtractedData);
  }

  function onClickCopy() {
    if (checking) {
      toast.current.showToast({
        type: 'warning',
        message: 'Checking link validity status',
      });
      return;
    }

    if (copying) {
      toast.current.showToast({
        type: 'warning',
        message: 'Copying in progress',
      });
      return;
    }

    let _exportContent = exportContent;
    if (!viewExtractedData) {
      _exportContent = JSON.stringify(cleanedData.folders, null, 2);
    }

    setCopying(true);
    navigator.clipboard
      .writeText(_exportContent)
      .then(() => {
        toast.current.showToast({
          type: 'success',
          message: 'Data copied to clipboard',
          duration: 1500,
        });
      })
      .catch((e: any) => {
        console.error(e);
        toast.current.showToast({
          type: 'warning',
          message: [e.message, 'Sorry, copy failed'],
        });
      })
      .finally(() => {
        setCopying(false);
      });
  }

  async function onClickSaveJSONAsFile() {
    if (checking) {
      toast.current.showToast({
        type: 'warning',
        message: 'Checking link validity status',
      });
      return;
    }

    if (saving) {
      toast.current.showToast({
        type: 'warning',
        message: 'Saving in progress',
      });
      return;
    }

    let _exportContent = exportContent;
    if (!viewExtractedData) {
      _exportContent = JSON.stringify(cleanedData.folders, null, 2);
    }

    await saveJSONAsFile(
      _exportContent,
      `chrome_bookmarks_${formatCurrentDateTime(
        new Date(),
        'yyyy_MM_dd_HH_mm_ss',
      )}.json`,
    );
  }

  async function saveJSONAsFile(jsonStringToSave: string, fileName: string) {
    try {
      setSaving(true);
      const url = URL.createObjectURL(
        new Blob([jsonStringToSave], { type: 'application/json' }),
      );
      const downloadLink = document.createElement('a');
      downloadLink.download = fileName;
      downloadLink.href = url;
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(downloadLink);
    } catch (e: any) {
      toast.current.showToast({
        type: 'warning',
        message: [e.message, 'Sorry, Saving to file failed'],
      });
    } finally {
      setSaving(false);
    }
  }

  function flattenBookmarks(folders: IFolder[]): IBookmark[] {
    const bookmarks: IBookmark[] = [];

    function traverse(folder: IFolder) {
      folder.bookmarks?.forEach((bookmark) => {
        bookmarks.push(bookmark);
      });

      folder.children?.forEach((child) => {
        traverse(child);
      });
    }

    folders.forEach((folder) => traverse(folder));
    return bookmarks;
  }

  function cleanData(arr: Partial<IFolder>[]): IFolder[] {
    for (let i = arr.length - 1; i >= 0; i--) {
      const folder = arr[i];

      if (folder.name === '') {
        delete folder.name;
      }

      if (folder.addDate === '') {
        delete folder.addDate;
      }

      if (folder.lastModified === '') {
        delete folder.lastModified;
      }

      if (folder.personalToolbarFolder === '') {
        delete folder.personalToolbarFolder;
      }

      if (!Array.isArray(folder.children) || folder.children.length === 0) {
        delete folder.children;
      } else {
        folder.children = cleanData(folder.children);
      }

      if (!Array.isArray(folder.bookmarks) || folder.bookmarks.length === 0) {
        delete folder.bookmarks;
      } else {
        folder.bookmarks = cleanBookmarks(folder.bookmarks);
      }

      if (!folder.parent) {
        delete folder.parent;
      }
    }

    return arr as IFolder[];
  }

  function cleanBookmarks(bookmarks: Partial<IBookmark>[]): IBookmark[] {
    for (let i = bookmarks.length - 1; i >= 0; i--) {
      const bookmark = bookmarks[i];

      if (bookmark.name === '') {
        delete bookmark.name;
      }

      if (bookmark.href === '') {
        delete bookmark.href;
      }

      if (bookmark.addDate === '') {
        delete bookmark.addDate;
      }

      if (bookmark.lastModified === '') {
        delete bookmark.lastModified;
      }

      if (bookmark.icon === '') {
        delete bookmark.icon;
      }
    }

    return bookmarks as IBookmark[];
  }

  return (
    <div className="indicator w-full">
      <div className="indicator-item">
        <button
          onClick={onClickReturn}
          className="btn btn-link no-underline normal-case"
        >
          <i className="bi bi-x-lg text-xl"></i>
        </button>
      </div>
      <div className="card w-full bg-base-100 shadow">
        <div className="card-body overflow-x-auto">
          <h2 className="card-title">Parsing completed</h2>
          <p className="text-start">
            Click the button to import or export the parsed data
          </p>

          <div className="my-14">
            <div className="grid grid-cols-3 gap-4">
              <div
                className="card bg-base-100 shadow cursor-default"
                title="The total number of folders in the bookmarks bar"
              >
                <div className="card-body">
                  <div className="font-bold text-xl" ref={folderCountUpRef}>
                    {cleanedData.folderCount}
                  </div>
                  <div>Folders</div>
                </div>
              </div>
              <div
                className="card bg-base-100 shadow cursor-default"
                title="The total number of links in the bookmarks bar"
              >
                <div className="card-body">
                  <div className="font-bold text-xl" ref={linkCountUpRef}>
                    {cleanedData.linkCount}
                  </div>
                  <div>Links</div>
                </div>
              </div>
              <div
                className="card bg-base-100 shadow cursor-default"
                title="The total number of top-level items in other bookmarks (including folders and links)"
              >
                <div className="card-body">
                  <div className="font-bold text-xl" ref={otherCountUpRef}>
                    {cleanedData.otherBookmarkCount}
                  </div>
                  <div>Others</div>
                </div>
              </div>
            </div>
          </div>

          <div className="my-4 mb-10">
            <div
              className={clsx(
                'collapse bg-base-200',
                viewExtractedData ? 'collapse-open' : 'collapse-close',
              )}
            >
              <div className="flex text-start items-center justify-between space-x-4 px-4 collapse-title text-xl cursor-pointer font-medium">
                <div className="grow" onClick={onClickViewExtractedData}>
                  Click to view the extracted data
                </div>
                <div className="flex items-center">
                  <button onClick={onClickCopy} className="btn normal-case">
                    {copying ? 'Copying' : 'Copy'}
                  </button>
                  <button
                    onClick={onClickSaveJSONAsFile}
                    className="btn normal-case"
                  >
                    {saving ? 'Downloading' : 'Download'}
                  </button>
                </div>
              </div>
              <div className="collapse-content">
                <textarea
                  readOnly
                  value={exportContent}
                  name="viewExtractedData"
                  placeholder="This is the parsed data"
                  className="textarea h-80 textarea-lg w-full"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="my-4 mb-10">
            <div className="form-control">
              <label className="label cursor-pointer select-auto">
                <div className="inline-flex flex-col space-y-2">
                  <div
                    className={clsx('label-text text-start', {
                      'font-semibold': isCheckLinkStatus,
                    })}
                  >
                    Check if the link status is valid (i.e., status code 200) -
                    it may also be related to proxies, for reference only
                  </div>
                  {isCheckLinkStatus && (
                    <div className="label-text text-start">
                      Because of the same-origin policy limitation in browsers,
                      performing cross-origin network access on the client-side
                      is not feasible. Consequently, choosing this feature
                      requires sending the data to the server for inspection.
                      Please take this into consideration!
                    </div>
                  )}
                </div>
                <input
                  disabled={checking}
                  type="checkbox"
                  name="checkLinkStatus"
                  checked={isCheckLinkStatus}
                  onChange={(event) => {
                    if (!isCheckLinkStatus && !checking) {
                      setInvalidLinks([]);
                    }
                    setIsCheckLinkStatus(event.target.checked);
                  }}
                  className="checkbox"
                />
              </label>
            </div>
          </div>

          {isCheckLinkStatus && (
            <>
              <div className="alert mt-8 flex items-start flex-col">
                <div className="flex space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="stroke-info shrink-0 w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>The results of the check are displayed below</span>
                </div>

                <ul>
                  {invalidLinks.map((item) => {
                    return (
                      <li key={item.href}>
                        <Link
                          className={clsx(
                            'link link-hover',
                            item.status === 200
                              ? 'link-primary'
                              : 'link-warning',
                          )}
                          href={item.href}
                        >
                          {item.name} ({item.status})
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                {checkLinkValidityMutation.isSuccess && (
                  <ul>
                    <li className="text-success">
                      Check not started or no invalid links found
                    </li>
                  </ul>
                )}
              </div>

              <div className="mt-4">
                <div className="card-actions">
                  <button
                    disabled={checking}
                    onClick={checkLinkStatus}
                    className="btn w-full normal-case"
                  >
                    {checking && (
                      <span className="loading loading-spinner"></span>
                    )}
                    <span>{checking ? 'Checking' : 'Check link status'}</span>
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="mt-8">
            <div className="card-actions">
              <button
                disabled={importing || checking}
                onClick={onClickImportParsedData}
                className="btn btn-primary w-full normal-case"
              >
                {importing && <span className="loading loading-spinner"></span>}
                <span>{importing ? 'Importing' : 'Import parsed data'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
