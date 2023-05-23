import { Creatable } from './Common';

export interface FileMetadata extends Creatable {
  id: string;
  fileName: string;
  md5: string;
}
