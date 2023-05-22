import { Router } from 'express';
import { uploadFile } from './uploadFile.js';
import { getFile } from './getFile.js';
import { deleteFile } from './deleteFile.js';

export const fileRouter = Router({ mergeParams: true });

fileRouter.post('/', ...uploadFile);
fileRouter.get('/:id', getFile);
fileRouter.delete('/:id', deleteFile);
/*
GET api/files/:id/metadata
PATCH api/files/:id/metadata
*/