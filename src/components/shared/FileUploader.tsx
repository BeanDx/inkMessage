import React, { useCallback, useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';

type FileUploaderProps = {
    fieldChange: (files: FileWithPath[]) => void;
    mediaUrl: string;
}

const MyDropzone = ({ fieldChange, mediaUrl, files }: FileUploaderProps) => {
    const [fileUrl, setFileUrl] = useState('');

    const onDrop = useCallback(
        (acceptedFiles: FileWithPath[]) => {
            fieldChange(acceptedFiles);
            setFileUrl(URL.createObjectURL(acceptedFiles[0]));
        }, [fieldChange]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpeg', 'jpg', '.svg']
        },
    });

    return (
        <div {...getRootProps()} className='flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer'>
            <input {...getInputProps()} className='cursor-pointer' />
            {
                fileUrl ? (
                    <>
                        <div className='flex flex-1 justify-center w-full p-5 lg:p-10'>
                            <img
                                src={fileUrl}
                                alt='image'
                                className='file_uploader-img'
                            />
                        </div>
                            <p className='file_uploader-label'>Click or drag photo to replace</p>
                    </>
                ) : (
                    <div className='file_uploader-box'>
                        <img
                            src='/assets/icons/file-upload.svg'
                            width={96}
                            height={77}
                            alt='file-upload'
                        />
                        <h3 className='base-medium text-light-2 mb-2 mt-6'>Drag photo here</h3>
                        <p className='text-light-4 small-regular mb-6'>SVG, PNG, JPG</p>

                        <button className='flex items-center shad-button_dark_4'>
                            Select from computer
                        </button>
                    </div>
                )
            }
        </div>
    );
}

const FileUploader = () => {
    const [files, setFiles] = useState<FileWithPath[]>([]);

    const handleFieldChange = (acceptedFiles: FileWithPath[]) => {
        setFiles(acceptedFiles);
    }

    return (
        <div>
            <MyDropzone fieldChange={handleFieldChange} files={files} mediaUrl='' />
        </div>
    );
}

export default FileUploader;
