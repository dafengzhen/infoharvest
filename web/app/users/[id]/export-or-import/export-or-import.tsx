'use client';

import { useContext, useState } from 'react';
import { GlobalContext } from '@/app/contexts';
import { useMutation } from '@tanstack/react-query';
import ExportAction from '@/app/actions/export-action';
import ImportAction from '@/app/actions/excerpts/import-action';
import { formatCurrentDateTime } from '@/app/common/client';

export default function ExportOrImport({ id }: { id: number }) {
  const [isImport, setIsImport] = useState(false);
  const [isExport, setIsExport] = useState(false);
  const [copying, setCopying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [importContent, setImportContent] = useState('');
  const [exportContent, setExportContent] = useState('');
  const [showExportContent, setShowExportContent] = useState(false);
  const [showImportContent, setShowImportContent] = useState(false);
  const { toast } = useContext(GlobalContext);

  const exportMutation = useMutation({
    mutationFn: ExportAction,
  });
  const importMutation = useMutation({
    mutationFn: ImportAction,
  });

  function onClickCopyExport() {
    if (copying) {
      toast.current.showToast({
        type: 'warning',
        message: 'Copying in progress',
      });
      return;
    }

    setCopying(true);
    navigator.clipboard
      .writeText(exportContent)
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
    if (!exportContent) {
      toast.current.showToast({
        type: 'warning',
        message: 'The data to be saved to the file does not exist',
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

    await saveJSONAsFile(
      exportContent,
      `infoharvest_export_u${id}_${formatCurrentDateTime(
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

  function onClickHideOutputBox() {
    if (exportMutation.isPending) {
      toast.current.showToast({
        type: 'warning',
        message: 'Exporting data and cannot be closed',
      });
      return;
    }

    setShowExportContent(false);
  }

  function onClickShowOutputBox() {
    setShowExportContent(true);
  }

  function onClickHideInputBox() {
    if (importMutation.isPending) {
      toast.current.showToast({
        type: 'warning',
        message: 'Data is being imported and cannot be closed',
      });
      return;
    }

    setShowImportContent(false);
  }

  function onClickShowInputBox() {
    setShowImportContent(true);
  }

  async function onClickExport() {
    if (isImport) {
      toast.current.showToast({
        type: 'warning',
        message: 'Please wait for the import to complete',
      });
      return;
    }

    try {
      setIsExport(true);

      const data = await exportMutation.mutateAsync();
      setExportContent(JSON.stringify(data, null, 2));
      setShowExportContent(true);

      toast.current.showToast({
        type: 'success',
        message: `The export is complete, please feel free to use it`,
        duration: 1500,
      });
    } catch (e: any) {
      exportMutation.reset();
      toast.current.showToast({
        type: 'warning',
        message: [e.message, 'Sorry, export failed'],
      });
    } finally {
      setIsExport(false);
    }
  }

  async function onClickImport() {
    if (isExport) {
      toast.current.showToast({
        type: 'warning',
        message: 'Please wait for the export to complete',
      });
      return;
    }

    if (!importContent) {
      setShowImportContent(true);
      toast.current.showToast({
        type: 'warning',
        message: 'Please enter the data to import',
      });
      return;
    }

    try {
      setIsImport(true);

      await importMutation.mutateAsync(JSON.parse(importContent));

      toast.current.showToast({
        type: 'success',
        message: `The import is complete, thank you for using it`,
        duration: 1500,
      });
    } catch (e: any) {
      importMutation.reset();
      toast.current.showToast({
        type: 'warning',
        message: [e.message, 'Sorry, import failed'],
      });
    } finally {
      setIsImport(false);
    }
  }

  return (
    <div className="hero min-h-screen bg-base-100">
      <div className="hero-content text-center">
        <div className="flex flex-col gap-4">
          <div className="flex gap-8">
            <div className="indicator">
              {!showExportContent && exportContent && (
                <div className="indicator-item">
                  <button
                    onClick={onClickShowOutputBox}
                    className="btn btn-xs normal-case"
                  >
                    Show
                  </button>
                </div>
              )}

              <div className="card bg-base-100 shadow-md">
                <div className="px-10 pt-10"></div>
                <div className="card-body items-center text-center">
                  <h2 className="card-title">Export</h2>
                  <p className="my-3">
                    Exporting data, please wait for the export to complete
                  </p>
                  <div className="card-actions">
                    <button
                      disabled={exportMutation.isPending}
                      onClick={onClickExport}
                      className="btn btn-primary normal-case"
                    >
                      {exportMutation.isPending && (
                        <span className="loading loading-spinner"></span>
                      )}
                      <span>
                        {exportMutation.isPending ? 'Exporting' : 'Start'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="indicator">
              {!showImportContent && importContent && (
                <div className="indicator-item">
                  <button
                    onClick={onClickShowInputBox}
                    className="btn btn-xs normal-case"
                  >
                    Show
                  </button>
                </div>
              )}

              <div className="card bg-base-100 shadow-md">
                <div className="card-body items-center text-center">
                  <div className="px-10 pt-10"></div>
                  <h2 className="card-title">Import</h2>
                  <p className="my-3">
                    Import data, note that it will be appended to the existing
                    data
                  </p>
                  <div className="card-actions">
                    <button
                      onClick={onClickImport}
                      className="btn btn-primary normal-case"
                    >
                      Start
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showExportContent && (
            <div className="text-start grow my-4">
              <div className="flex my-4 items-center justify-between gap-4">
                <div className="text-zinc-500">Data to export</div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={onClickCopyExport}
                    className="btn btn-xs normal-case"
                  >
                    {copying ? 'Copying' : 'Copy'}
                  </button>
                  <button
                    onClick={onClickSaveJSONAsFile}
                    className="btn btn-xs normal-case"
                  >
                    {saving ? 'Downloading' : 'Download'}
                  </button>
                  <button
                    onClick={onClickHideOutputBox}
                    className="btn btn-xs normal-case"
                  >
                    Hide
                  </button>
                </div>
              </div>
              <textarea
                readOnly
                value={exportContent}
                name="exportContent"
                placeholder="This is the exported data"
                className="textarea textarea-bordered h-80 shadow-sm textarea-lg w-full animate__animated animate__faster animate__fadeInUp"
              ></textarea>
            </div>
          )}

          {showImportContent && (
            <div className="text-start grow my-4">
              <div className="flex my-4 items-center justify-between gap-4">
                <div className="text-zinc-500">Data to import</div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={onClickHideInputBox}
                    className="btn btn-xs normal-case"
                  >
                    Hide
                  </button>
                </div>
              </div>
              <textarea
                autoFocus
                value={importContent}
                name="importContent"
                onChange={(event) => setImportContent(event.target.value.trim)}
                placeholder="Please fill in the data to be imported, the format should be consistent with the export"
                className="textarea textarea-bordered h-80 shadow-sm textarea-lg w-full animate__animated animate__faster animate__fadeInUp"
              ></textarea>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
