import { FileMetadataResponse } from '@suyong/memo-core';
import axios from './config';

export const uploadFile = async (file: File): Promise<FileMetadataResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`/files`, formData);

  return response.data;
};

export const deleteFile = async (id: string): Promise<void> => await axios.delete(`/files/${id}`);
