import { Router } from 'express';
import { uploadFile } from './uploadFile.js';
import { getFile } from './getFile.js';


export const fileRouter = Router({ mergeParams: true });

fileRouter.post('/', ...uploadFile);
fileRouter.get('/:id', getFile);
/*
POST api/files
DELETE api/files/:id
GET api/files/:id
GET api/files/:id/metadata
PATCH api/files/:id/metadata
*/