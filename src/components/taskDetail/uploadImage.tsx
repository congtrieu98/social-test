/* eslint-disable @next/next/no-img-element */
"use client";

import { uploadVercel } from "@/lib/utils";
import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { useSession } from "next-auth/react";
import { Upload, XCircle } from "lucide-react";
import { CompleteTask } from "@/lib/db/schema/tasks";
import { STATUS_IMAGE } from "@/utils/constant";
interface FileWithPreview extends File {
  preview?: string;
  loading?: boolean;
  path?: string;
}

const UploadImage = ({
  t,
  taskId,
  files,
  setFiles,
}: {
  t: CompleteTask;
  taskId: string;
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
}) => {
  const router = useRouter();
  const utils = trpc.useContext();
  const { data: session } = useSession();

  const { mutate: createHistory } = trpc.histories.createHistory.useMutation();
  const { mutate: updateHistory } = trpc.histories.updateHistory.useMutation();
  const { mutate: updateImage, isLoading: isImageUpdating } =
    trpc.medias.updateMedia.useMutation({
      onSuccess: async () => {
        const findHistory = t?.history?.find(
          (item) => item.action === "deleteImage"
        );
        if (!findHistory) {
          createHistory({
            taskId: taskId as string,
            createAt: new Date(),
            content: "đã xóa ảnh",
            action: "deleteImage",
            userId: session?.user?.name as string,
          });
        } else {
          updateHistory({
            id: findHistory.id,
            taskId: taskId as string,
            createAt: new Date(findHistory.createAt),
            content: "đã xóa ảnh",
            action: "deleteImage",
            userId: session?.user?.name as string,
          });
        }
        await utils.tasks.getTaskById.invalidate();
        router.refresh();
        toast({
          title: "Success",
          description: `Image deledated successfully!`,
          variant: "default",
        });
      },
    });

  const onDrop = useCallback((acceptedFiles: Array<FileWithPreview>) => {
    if (acceptedFiles?.length) {
      setFiles((previousFiles) => [
        ...previousFiles,
        ...acceptedFiles.map((file) => ({
          ...file,
          loading: true,
          erorrs: [],
        })),
      ]);

      acceptedFiles.forEach((file, index) => {
        uploadVercel(file).then((url) => {
          setFiles((previousFiles) =>
            previousFiles.map((prevFile, prevIndex) => {
              if (
                prevIndex ===
                index + previousFiles.length - acceptedFiles.length
              ) {
                return { ...prevFile, preview: url, loading: false };
              } else {
                return prevFile;
              }
            })
          );
        });
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxSize: 1024 * 1000,
    onDrop,
  });

  useEffect(() => {
    return () =>
      files.forEach((file: FileWithPreview) =>
        URL.revokeObjectURL(file.preview as string)
      );
  }, [files]);

  const removeFile = (path: string) => {
    setFiles((files) =>
      files.filter((file: FileWithPreview) => file.path !== path)
    );
  };
  return (
    <>
      <div className="text-xl font-semibold">Image</div>
      <section className="border border-gray-100 p-5 rounded-xl shadow-md max-w-xl">
        <div
          {...getRootProps()}
          className="p-2 border border-dashed border-gray-300"
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-4">
            <Upload />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag & drop files here, or click to select files</p>
            )}
          </div>
        </div>
        {/* Accepted files */}
        <h3 className="title text-lg font-semibold text-neutral-600 mt-4 border-b pb-3">
          Accepted Files
        </h3>
        {/* sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 */}
        <ul className="mt-6 grid grid-cols-1 gap-10">
          {(t?.medias?.length as number) > 0 &&
            t?.medias.map((item, index) => {
              if (item?.status === STATUS_IMAGE.ACTIVE)
                return (
                  <li key={index} className="relative h-auto rounded-md">
                    {isImageUpdating ? (
                      <svg
                        className="absolute top-[-10px] sm:right-0 right-[156px] animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="black"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="black"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <>
                        <img
                          src={item.url}
                          alt={item.url}
                          className="h-full w-full object-contain rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            updateImage({
                              id: item.id,
                              status: STATUS_IMAGE.DISABLE,
                              updateAt: new Date(),
                              userId: session?.user?.name as string,
                            });
                          }}
                          className="w-5 h-5 border border-secondary-400 bg-secondary-400 rounded-full flex justify-center items-center absolute -top-3 -right-3 transition-colors bg-black"
                        >
                          <XCircle color="white" />
                        </button>
                      </>
                    )}
                  </li>
                );
            })}
          {files.map((file: FileWithPreview, index) => (
            <li key={index} className="relative h-auto rounded-md">
              {file.loading ? (
                <svg
                  className="absolute top-[-10px] sm:right-0 right-[156px] animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="black"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="black"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <>
                  <img
                    src={file.preview}
                    alt={file.name}
                    onLoad={() => {
                      URL.revokeObjectURL(file.preview as string);
                    }}
                    className="h-full w-full object-contain rounded-md"
                  />
                  <button
                    type="button"
                    className="w-5 h-5 border border-secondary-400 bg-secondary-400 rounded-full flex justify-center items-center absolute -top-3 -right-3 transition-colors bg-black"
                    onClick={() => removeFile(file.path as string)}
                  >
                    <XCircle color="white" />
                  </button>
                </>
              )}
              <div className=" text-neutral-500 text-[12px] font-medium">
                {/* {file.path} */}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default UploadImage;
