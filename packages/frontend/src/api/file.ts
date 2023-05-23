import { FileMetadata } from '../models/FileMetadata.js';
import axios from './config.js';

export const uploadFile = async (file: File): Promise<FileMetadata> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`/files`, formData);

  return response.data;
};

export const deleteFile = async (id: string): Promise<void> => await axios.delete(`/files/${id}`);
