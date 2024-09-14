//upload multi image to aws s3
import AWS from "aws-sdk";
// import { suppress } from "aws-sdk/lib/maintenance_mode_message.js";
// suppress = true;


const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
};

const S3 = new AWS.S3(awsConfig);


//upload to s3
export const uploadToS3 = (fileData) => {
  var signatures = {
    JVBERi0: "pdf",
    R0lGODdh: "gif",
    R0lGODlh: "gif",
    iVBORw0KGgo: "png",
    "/9j/": "jpg",
    "/9j": "jpeg"
  };
  
  function detectMimeType(b64) {
    for (var s in signatures) {
      if (b64.indexOf(s) === 0) {
        return signatures[s];
      }
    }
  }
  const fileMeme = detectMimeType(fileData)
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `cabdriver/${Date.now().toString()}.${fileMeme}`,
      Body: fileData,
    };
    S3.upload(params, (err, data) => {
      if (err) {
        return reject(err);
      }

      return resolve(data.Location);
    });
  });
};

// Example usage:

// const deleteFile = (fileName) => {
//   const parsedUrl = new URL(fileName);
//   const objectKey = parsedUrl.pathname.substring(1);
//   return new Promise((resolve, reject) => {
//     const params = {
//       Bucket: bucketName,
//       Key: objectKey,
//     };
//     S3.deleteObject(params, (err, data) => {
//       if (err) {
//         return reject(err);
//       }
//       return resolve(true);
//     });
//   });
// };

//export default { uploadToS3, deleteFile };
