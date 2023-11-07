import { useContext, useEffect, useRef, useState } from 'react';
import { GlobalContext } from '@/app/contexts';
import * as CountUpModule from 'countup.js';
import clsx from 'clsx';
import { type IParseBookmarkResults } from '@/app/bookmarks/bookmarks';

export default function ParsingCompleted({
  data,
  onClickReturn,
}: {
  data: IParseBookmarkResults;
  onClickReturn: () => void;
}) {
  const [viewExtractedData, setViewExtractedData] = useState(false);
  const [exportContent, setExportContent] = useState('');
  const [copying, setCopying] = useState(false);
  const { toast } = useContext(GlobalContext);
  const folderCountUpRef = useRef<HTMLDivElement>(null);
  const linkCountUpRef = useRef<HTMLDivElement>(null);
  const otherCountUpRef = useRef<HTMLDivElement>(null);
  const [importing, setImporting] = useState(false);

  console.log(data.folders);

  useEffect(() => {
    const folderCountUp = folderCountUpRef.current;
    let countUpAnim: any;
    if (folderCountUp) {
      countUpAnim = new CountUpModule.CountUp(folderCountUp, data.folderCount);
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
  }, [folderCountUpRef.current, data.folderCount]);
  useEffect(() => {
    const linkCountUp = linkCountUpRef.current;
    let countUpAnim: any;
    if (linkCountUp) {
      countUpAnim = new CountUpModule.CountUp(linkCountUp, data.linkCount);
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
  }, [linkCountUpRef.current, data.linkCount]);
  useEffect(() => {
    const otherCountUp = otherCountUpRef.current;
    let countUpAnim: any;
    if (otherCountUp) {
      countUpAnim = new CountUpModule.CountUp(
        otherCountUp,
        data.otherBookmarkCount,
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
  }, [otherCountUpRef.current, data.otherBookmarkCount]);

  async function onClickImportParsedData() {
    if (importing) {
      toast.current.showToast({
        type: 'warning',
        message: 'Please wait for parsing to complete',
      });
      return;
    }

    const folders = data.folders;
    if (folders.length === 0) {
      toast.current.showToast({
        type: 'info',
        message: 'The data is empty, skip importing',
      });
      return;
    }

    try {
      setImporting(true);

      toast.current.showToast({
        type: 'success',
        message: `Import completed`,
        duration: 1500,
      });
    } catch (e: any) {
      toast.current.showToast({
        type: 'warning',
        message: [e.message, 'Sorry, importing failed'],
      });
    } finally {
      setImporting(false);
    }
  }

  function onClickViewExtractedData() {
    if (!viewExtractedData) {
      setExportContent(JSON.stringify(data.folders, null, 2));
    }

    setViewExtractedData(!viewExtractedData);
  }

  function onClickCopy() {
    if (copying) {
      toast.current.showToast({
        type: 'warning',
        message: 'Copying in progress',
      });
      return;
    }

    let _exportContent = exportContent;
    if (!viewExtractedData) {
      _exportContent = JSON.stringify(data.folders, null, 2);
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

  return (
    <div className="indicator">
      <div className="indicator-item">
        <button
          onClick={onClickReturn}
          className="btn btn-link no-underline normal-case"
        >
          <i className="bi bi-x-lg text-xl"></i>
        </button>
      </div>
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">Parsing completed</h2>
          <p className="text-start">
            Click the button to import or export the parsed data
          </p>

          <div className="my-14">
            <div className="grid grid-cols-3 gap-4">
              <div className="card bg-base-100 shadow">
                <div className="card-body">
                  <div className="font-bold text-xl" ref={folderCountUpRef}>
                    {data.folderCount}
                  </div>
                  <div>Folders</div>
                </div>
              </div>
              <div className="card bg-base-100 shadow">
                <div className="card-body">
                  <div className="font-bold text-xl" ref={linkCountUpRef}>
                    {data.linkCount}
                  </div>
                  <div>Links</div>
                </div>
              </div>
              <div className="card bg-base-100 shadow">
                <div className="card-body">
                  <div className="font-bold text-xl" ref={otherCountUpRef}>
                    {data.otherBookmarkCount}
                  </div>
                  <div>Others</div>
                </div>
              </div>
            </div>
          </div>

          <div className="my-4">
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
                <div>
                  <button onClick={onClickCopy} className="btn">
                    <i className="bi text-xl bi-clipboard"></i>
                    {copying ? 'Copying' : ''}
                  </button>
                </div>
              </div>
              <div className="collapse-content">
                <textarea
                  readOnly
                  value={exportContent}
                  name="viewExtractedData"
                  placeholder="This is the parsed data"
                  className="textarea textarea-bordered h-80 shadow-sm textarea-lg w-full animate__animated animate__faster animate__fadeInUp"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="card-actions">
              <button
                disabled={importing}
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
