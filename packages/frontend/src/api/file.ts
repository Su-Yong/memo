import { FileMetadata } from '../models/FileMetadata';
import axios from './config';

export const uploadFile = async (file: File): Promise<FileMetadata> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`/files`, formData);

  return response.data;
};

export const deleteFile = async (id: string): Promise<void> => await axios.delete(`/files/${id}`);
