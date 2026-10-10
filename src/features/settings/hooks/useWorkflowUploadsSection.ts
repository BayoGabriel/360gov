import { useDeleteUpload, useUploadFile } from '../queries/settings.mutations';
import { useWorkflowUploads } from '../queries/settings.queries';

/** Owns the workflow upload list: fetching, adding, and removing files. */
export function useWorkflowUploadsSection() {
  const query = useWorkflowUploads();
  const upload = useUploadFile();
  const remove = useDeleteUpload();

  return {
    uploads: query.data ?? [],
    isPending: query.isPending,
    isError: query.isError,
    addFile: (file: File) =>
      upload.mutate({ fileName: file.name, sizeBytes: file.size }),
    isUploading: upload.isPending,
    removeFile: (uploadId: string) => remove.mutate(uploadId),
  };
}
