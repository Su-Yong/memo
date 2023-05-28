import { Router } from 'express';
import { uploadFile } from './uploadFile';
import { getFile } from './getFile';
import { deleteFile } from './deleteFile';

export const fileRouter = Router({ mergeParams: true });

fileRouter.post('/', ...uploadFile);
fileRouter.get('/:id', getFile);
fileRouter.delete('/:id', deleteFile);
/*
GET api/files/:id/metadata
PATCH api/files/:id/metadata
*/