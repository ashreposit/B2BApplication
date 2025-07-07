import { StorageEngine } from "multer";
import { Request } from "express";
import AWS from "aws-sdk";
import sharp from "sharp";
import concat from "concat-stream";
import path from "path";
import fs from "fs";
import CONFIG from "../config/config";

interface BodyData {
    imageType: string;
    content?: string;
    region?: string;
}

export class CustomStorage implements StorageEngine {
    private s3: AWS.S3;
    private getDestination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename?: string) => void) => void;

    constructor(opts: {
        destination?: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename?: string) => void) => void;
    }) {
        this.s3 = new AWS.S3({
            accessKeyId: CONFIG.AWS_ACCESS_KEY,
            secretAccessKey: CONFIG.AWS_SECRET_KEY,
            region: CONFIG.AWS_REGION
        });
        this.getDestination = opts.destination || ((req, file, cb) => cb(null, "/dev/null"));
    }

    _handleFile(req: Request, file: Express.Multer.File, cb: (error: Error | null, info?: Partial<Express.Multer.File>) => void): void {
        this.getDestination(req, file, (err, destPath) => {
            if (err) return cb(err);

            const finalPath = this.removeSpecialCharacterForFile(destPath!);
            file.stream.pipe(
                concat({ encoding: "buffer" }, async (bufferData: Buffer) => {
                    try {
                        const bodyData: BodyData = JSON.parse(req?.body?.data || '{}');

                        const isImage = file.mimetype.startsWith("image/");

                        if (isImage) {
                            const metadata = await sharp(bufferData).metadata();
                            const resizedBuffer = await sharp(bufferData)
                                .resize({
                                    width: metadata.width && metadata.width > 1200 ? 1200 : metadata.width,
                                    height: metadata.height && metadata.height > 1200 ? 1200 : metadata.height,
                                    fit: "inside",
                                    withoutEnlargement: true,
                                })
                                .toBuffer();

                            const compressedBuffer = await this.compressUntilUnderSize(resizedBuffer, 300 * 1024, 80);

                            const keyParam = `imageupload/${finalPath}`;

                            const data = await this.uploadFile(compressedBuffer, keyParam, CONFIG.S3_DIRECTORY_NAME, CONFIG.S3_BUCKET_NAME);

                            if (data?.url) {
                                delete (bodyData as any).imageType;
                                req.body = {...bodyData,awsImageUrl:data?.url};
                            }

                            cb(null, {
                                path: finalPath,
                                size: compressedBuffer.length,
                            });
                        } else {
                            cb(null, {
                                buffer: bufferData,
                                size: bufferData.length,
                            });
                        }
                    } catch (error: any) {
                        console.error(error);
                        cb(error);
                    }
                })
            );
        });
    }

    _removeFile(_req: Request, file: Express.Multer.File, cb: (error: Error | null) => void): void {
        if (file && file.path) {
            fs.unlink(file.path, cb);
        }
    }

    private async compressUntilUnderSize(buffer: Buffer, targetSize = 300 * 1024, quality = 80): Promise<Buffer> {
        if (quality < 20) return buffer;

        const processedBuffer = await sharp(buffer).webp({ quality }).toBuffer();
        return processedBuffer.length <= targetSize
            ? processedBuffer
            : this.compressUntilUnderSize(buffer, targetSize, quality - 10);
    }

    private removeSpecialCharacterForFile(fileName: string): string {
        const ext = path.extname(fileName);
        let baseName = path.basename(fileName, ext);
        baseName = baseName.replace(/[^a-zA-Z0-9_\-]/g, "").replace(/\s/g, "_");
        return baseName + ext;
    }

    private async uploadFile(
        data: Buffer,
        filename: string,
        directoryName: string,
        bucketName: string,
    ): Promise<{ url: string }> {
        const format = path.extname(filename).slice(1);
        const params: AWS.S3.PutObjectRequest = {
            Key: `${directoryName}local/${filename}`,
            Bucket: bucketName,
            Body: data,
        };

        const uploadResult = await this.s3.upload(params).promise();

        const signedUrl = this.s3.getSignedUrl("getObject", {
            Key: params.Key,
            Bucket: params.Bucket,
            ResponseContentType: `application/${format}`,
        });

        if (!signedUrl) throw new Error("URL_NOT_RECEIVED");

        return { url: signedUrl };
    }
}
