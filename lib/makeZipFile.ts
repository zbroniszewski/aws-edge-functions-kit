import AdmZip from 'adm-zip';
import { v4 as uuid } from 'uuid';

const zip = new AdmZip();

export function makeZipFile(sourceFilePath: string) {
  const zipFilePath = `/tmp/${uuid()}.zip`;
  zip.addLocalFile(sourceFilePath);
  zip.writeZip(zipFilePath);

  return zipFilePath;
}
