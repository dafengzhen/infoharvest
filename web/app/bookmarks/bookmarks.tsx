'use client';

import { useRouter } from 'next/navigation';
import { useContext, useRef, useState } from 'react';
import { GlobalContext } from '@/app/contexts';
import * as htmlparser2 from 'htmlparser2';

interface IFolder {
  name: string;
  addDate: string;
  lastModified: string;
  personalToolbarFolder: string;
  children: IFolder[];
  bookmarks: IBookmark[];
  parent?: IFolder;
}

interface IBookmark {
  name: string;
  href: string;
  addDate: string;
  lastModified: string;
  icon: string;
}

interface IParseBookmarkResults {
  sameQuantity: boolean;
  linkCount: number;
  folderCount: number;
  folders: IFolder[];
}

export default function Bookmarks() {
  const router = useRouter();
  const [parsing, setParsing] = useState(false);
  const [fileValue, setFileValue] = useState('');
  const fileRef = useRef<File>();
  const { toast } = useContext(GlobalContext);
  const [data, setData] = useState<IParseBookmarkResults>();

  async function onClickStart() {
    if (parsing) {
      toast.current.showToast({
        type: 'warning',
        message: 'Please wait for parsing to complete',
      });
      return;
    }

    const currentFile = fileRef.current;
    if (!currentFile) {
      toast.current.showToast({
        type: 'warning',
        message: 'Please upload the bookmark HTML file',
      });
      return;
    }

    try {
      setParsing(true);

      const data = await parser(currentFile);
      setData(data);
      console.log(data);

      toast.current.showToast({
        type: 'success',
        message: `Parsing completed`,
        duration: 1500,
      });
    } catch (e: any) {
      toast.current.showToast({
        type: 'warning',
        message: [e.message, 'Sorry, parsing failed'],
      });
    } finally {
      setParsing(false);
    }
  }

  async function parser(file: File): Promise<IParseBookmarkResults> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', (event) => {
        const fileContent = event.target?.result ?? '';
        if (!fileContent) {
          reject(new Error('Html file content does not exist'));
          return;
        }

        const folders: IFolder[] = [];
        let currentFolder: IFolder;
        let currentBookmark: IBookmark;
        let dlCount = 0;
        let dtCount = 0;
        let h3Count = 0;
        let aCount = 0;
        let closeDlTag = false;
        let closeDlTagIndex = 0;

        const parser = new htmlparser2.Parser(
          {
            onopentag(name: string, attribs: { [p: string]: string }) {
              if (name === 'dl') {
                dlCount = dlCount + 1;
              } else if (name === 'dt') {
                dtCount = dtCount + 1;
              } else if (name === 'h3') {
                h3Count = h3Count + 1;
                currentFolder = {
                  name: '',
                  addDate: attribs.add_date ?? '',
                  lastModified: attribs.last_modified ?? '',
                  personalToolbarFolder: attribs.personal_toolbar_folder ?? '',
                  children: [],
                  bookmarks: [],
                };
              } else if (name === 'a') {
                aCount = aCount + 1;
                currentBookmark = {
                  name: '',
                  href: attribs.href ?? '',
                  addDate: attribs.last_modified ?? '',
                  lastModified: attribs.personal_toolbar_folder ?? '',
                  icon: attribs.icon ?? '',
                };
              }
            },
            ontext(data: string) {
              if (currentFolder) {
                currentFolder.name = data;
              }
              if (currentBookmark) {
                currentBookmark.name = data;
              }
            },
            onclosetag(name: string) {
              if (name === 'dl') {
                closeDlTagIndex = closeDlTagIndex + 1;
                closeDlTag = true;
              } else if (name === 'h3') {
                const _bookmarks = folders[0];
                if (!_bookmarks) {
                  folders.push({ ...currentFolder });
                } else {
                  let _parent = _bookmarks;
                  let _children = _bookmarks.children;

                  while (_children.length > 0) {
                    const folder = _children[_children.length - 1];
                    _parent = folder;
                    _children = folder.children;
                  }

                  _children.push({ ...currentFolder, parent: _parent });
                }
              } else if (name === 'a') {
                const _bookmarks = folders[0];
                let _children = _bookmarks.children;
                let _folder: IFolder = _bookmarks;
                const closeDlTags: IFolder[] = [];

                while (_children.length > 0) {
                  const folder = _children[_children.length - 1];
                  _folder = folder;
                  _children = folder.children;
                  closeDlTags.unshift(_folder);
                }
                closeDlTags.push(_bookmarks);

                if (closeDlTag) {
                  closeDlTags[closeDlTagIndex].bookmarks.push({
                    ...currentBookmark,
                  });
                } else {
                  _folder.bookmarks.push({ ...currentBookmark });
                }
              }
            },
            onend() {
              resolve({
                sameQuantity: dtCount === h3Count + aCount,
                folderCount: h3Count,
                linkCount: aCount,
                folders,
              } as IParseBookmarkResults);
            },
            onerror(error: Error) {
              reject(error);
            },
          },
          {
            decodeEntities: true,
          },
        );
        parser.write(fileContent as string);
        parser.end();
      });
      reader.readAsText(file);
    });
  }

  return (
    <div className="hero min-h-[90vh] bg-base-100">
      <div className="hero-content text-center">
        <div className="">
          <h1 className="text-5xl font-bold">Bookmark parser</h1>
          <p className="py-6 text-zinc-500 my-4">
            Browser bookmark parsing, supporting the Chrome browser, performed
            on the client-side
          </p>

          <div className="my-8 mb-12">
            <div className="form-control w-full">
              <input
                disabled={parsing}
                value={fileValue}
                type="file"
                name="file"
                accept=".html"
                placeholder="Please upload the bookmark HTML file"
                className="file-input file-input-bordered w-full cursor-pointer"
                onChange={(event) => {
                  const files = event.target.files;
                  if (files && files.length === 1) {
                    setFileValue(event.target.value);
                    fileRef.current = files[0];
                  }
                }}
              />
            </div>
          </div>

          <button
            disabled={parsing}
            onClick={onClickStart}
            type="button"
            className="btn btn-primary normal-case"
          >
            {parsing && <span className="loading loading-spinner"></span>}
            <span>{parsing ? 'Parsing' : 'Start'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
