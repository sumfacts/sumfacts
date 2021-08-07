import fileDownload from 'js-file-download';

export const isValidUrl = (string: string) => {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
};

export const parse = (data: any) => {
  return JSON.stringify(data, null, 2);
};

export const download = (fileName: string | number, data: any) => {
  const exportData = parse(data);
  fileDownload(exportData, `${fileName}.json`);
};

export const copy = (data: string) => {
  navigator.clipboard.writeText(data);
};
