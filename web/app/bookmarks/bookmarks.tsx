'use client';

import { useContext, useRef, useState } from 'react';
import { GlobalContext } from '@/app/contexts';
import * as cheerio from 'cheerio';
import { compressHTML } from '@/app/common/client';
import { type ChildNode } from 'domhandler';
import clsx from 'clsx';
import ParsingCompleted from '@/app/bookmarks/parsing-completed';

export interface IFolder {
  name: string;
  addDate: string;
  lastModified: string;
  personalToolbarFolder: string;
  children: IFolder[];
  bookmarks: IBookmark[];
  parent?: IFolder;
}

export interface IBookmark {
  name: string;
  href: string;
  addDate: string;
  lastModified: string;
  icon: string;
}

export interface IParseBookmarkResults {
  linkCount: number;
  folderCount: number;
  otherBookmarkCount: number;
  folders: IFolder[];
}

export default function Bookmarks() {
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
    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('load', async (event) => {
          const fileContent = event.target?.result ?? '';
          if (!fileContent) {
            reject(new Error('Html file content does not exist'));
            return;
          }

          const folders: IFolder[] = [];
          const otherBookmarkFolder = {
            name: 'Other bookmarks',
            bookmarks: [],
            children: [] as IFolder[],
            addDate: Math.floor(new Date().getTime() / 1000) + '',
            lastModified: '',
            personalToolbarFolder: '',
          };
          const $ = cheerio.load(compressHTML(fileContent as string));
          $('p').remove();
          $('dl').first()[0].children.forEach(handleDtElement);

          otherBookmarkFolder.children = [
            ...otherBookmarkFolder.children,
            ...folders.slice(1),
          ];
          const _folders = [folders[0], otherBookmarkFolder];
          resolve({
            folders: _folders,
            linkCount: $('a').length,
            folderCount: $('h3').length,
            otherBookmarkCount: _folders[1]
              ? _folders[1].children.length + _folders[1].bookmarks.length
              : 0,
          });

          function handleDtElement(element: ChildNode) {
            const first = $(element).children().first();
            const folder: IFolder = {
              name: first.text() ?? 'Error: Bookmark name does not exist',
              bookmarks: [],
              children: [],
              addDate: first[0].attribs['add_date'] ?? '',
              lastModified: first[0].attribs['last_modified'] ?? '',
              personalToolbarFolder:
                first[0].attribs['personal_toolbar_folder'] ?? '',
            };

            const lastElement = $(element).children().last()[0];
            if (lastElement.name === 'a') {
              handleAElement(otherBookmarkFolder, lastElement);
              return;
            }

            folders.push(folder);
            handleDlElement(folder, lastElement);
          }

          function handleDlElement(folder: IFolder, element: ChildNode) {
            $(element)
              .children()
              .children()
              .each((i, el) => {
                if (el.name === 'a') {
                  handleAElement(folder, el);
                } else if (el.name === 'h3') {
                  folder.children.push({
                    name: $(el).text() ?? 'Error: Bookmark name does not exist',
                    bookmarks: [],
                    children: [],
                    addDate: el.attribs['add_date'] ?? '',
                    lastModified: el.attribs['last_modified'] ?? '',
                    personalToolbarFolder:
                      el.attribs['personal_toolbar_folder'] ?? '',
                  });
                } else if (el.name === 'dl') {
                  handleDlElement(
                    folder.children[folder.children.length - 1],
                    el,
                  );
                }
              });
          }

          function handleAElement(folder: IFolder, el: cheerio.Element) {
            folder.bookmarks.push({
              name: ($(el).text() ?? 'Error: Link name does not exist').trim(),
              href: el.attribs['href'] ?? '',
              addDate: el.attribs['add_date'] ?? '',
              icon: el.attribs['icon'] ?? '',
              lastModified: el.attribs['last_modified'] ?? '',
            });
          }
        });
        reader.readAsText(file);
      });
    } catch (e: any) {
      toast.current.showToast({
        type: 'warning',
        message: e?.message ?? 'Sent some questions！',
      });
      throw e;
    } finally {
      setParsing(false);
    }
  }

  function onClickReturn() {
    setFileValue('');
    fileRef.current = undefined;
    setData(undefined);
  }

  return (
    <div
      className={clsx('hero min-h-[90vh] bg-base-100', {
        'max-w-screen-md mx-auto': data,
      })}
    >
      <div
        className={clsx('hero-content text-center', {
          'w-full block': data,
        })}
      >
        {data ? (
          <ParsingCompleted data={data} onClickReturn={onClickReturn} />
        ) : (
          <div className="">
            <h1 className="text-5xl font-bold">Bookmark parser</h1>
            <p className="pt-6 pb-1 text-zinc-500 mt-4">
              Browser bookmark parsing, supporting the Chrome browser, performed
              on the client-side
            </p>
            <p className="pb-6 pt-1 text-zinc-500 mb-4">
              Quick tip: Copy&nbsp;
              <span className="underline cursor-copy select-all">
                chrome://bookmarks
              </span>
              &nbsp;and paste it into the address bar to open the bookmarks
              manager
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
                    } else {
                      setFileValue('');
                      fileRef.current = undefined;
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
        )}
      </div>
    </div>
  );
}
