import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const multerConfig = {
    storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
            const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
            callback(null, uniqueName);
        },
    }),
    fileFilter: (req, file, callback) => {
        const allowedMimeTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'image/jpeg',
            'image/png',
            'image/gif',
            'text/plain',
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new Error('Type de fichier non autorisé'), false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max
    },
};
