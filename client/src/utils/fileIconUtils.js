// src/utils/fileIconUtils.js
import audio from '../assets/icons/audio.png';
import excel from '../assets/icons/excel.png';
import other from '../assets/icons/file.png';
import video from '../assets/icons/mp4.png';
import pdf from '../assets/icons/pdf.png';
import ppt from '../assets/icons/ppt.png';
import txt from '../assets/icons/txt.png';
import word from '../assets/icons/word.png';
import zip from '../assets/icons/zip.png';



export const fileIcons = {
    pdf,
    word,
    excel,
    ppt,
    zip,
    txt,
    video,
    audio,
    other
};

export const getFileType = (fileName = '') => {
    const extension = fileName.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
    if (['pdf'].includes(extension)) return 'pdf';
    if (['doc', 'docx'].includes(extension)) return 'word';
    if (['xls', 'xlsx'].includes(extension)) return 'excel';
    if (['ppt', 'pptx'].includes(extension)) return 'ppt';
    if (['zip', 'rar', '7z'].includes(extension)) return 'zip';
    if (['txt'].includes(extension)) return 'txt';
    if (['mp4', 'mkv', 'avi', 'mov', 'webm'].includes(extension)) return 'video';
    if (['mp3', 'wav', 'ogg', 'aac'].includes(extension)) return 'audio';
    return 'other';
};
