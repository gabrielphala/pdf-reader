const multer = require('multer');
const path = require('path');


export const checkExt = function (file: any, cb: Function, type = 'std') {
    let allowed = std();

    if (type == 'multi') allowed = multi()
    else if (type == 'images') allowed = images()
    else if (type == 'video') allowed = video()

    let fileExt = path.extname(file.originalname);

    let ext = allowed.test(fileExt.toLowerCase());
    let mimetype = allowed.test(file.mimetype);

    if (!mimetype || !ext) {
        const err = new Error(fileExt + ' is not allowed!');
        (err as any)['code'] = 'FILE_TYPE_NOT_ALLOWED';

        return cb(err);
    }

    cb(null, true);
}

const images = () => {
    return /jpg|jpeg|png|webp/
}

const std = () => {
    return /jpg|jpeg|png|pdf|doc|docx|zip|zar|7z|ppt|pptx/;
}

const multi = () => {
    return /jpg|jpeg|png|pdf|doc|docx|zip|zar|7z|ppt|pptx|mp3|mp4|avi|mkv|ts/;
}

const pdf = () => {
    return /pdf/;
}

const video = () => {
    return /mp4|avi|mkv|ts/;
}

const getExtension = (fname: string) => {
    return path.extname(fname);
}

const getNameWithoutExt = (ext: string, fname: string) => {
    return fname.split(ext)[0];
}

export const setStorage = (destination: string) => {
    return multer.diskStorage({
        destination: destination,
        filename: (req: any, file: any, cb: any) => {
            let ext = getExtension(file.originalname),
                nameWithoutExt = getNameWithoutExt(ext, file.originalname),
                timestamp = Date.now();

            cb(null, nameWithoutExt + '-' + timestamp + ext)
        }
    });
}

const getLimits = (type = 'images') => {
    return {
        fileSize: type == 'images' ? 18_000_000 : 500_000_000,
        fileFilter: () => ((_req: any, file: any, cb: any) => {
            return checkExt(file, cb, type);
        })
    }
}

export const anyFiles = (destination: string, type: string = 'pdf') => {
    let storage = setStorage(destination);

    return multer({
        storage,
        limits: getLimits(type)
    }).any();
}