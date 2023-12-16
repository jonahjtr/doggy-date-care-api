const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const authMiddleware = require("../../middleware/authMiddleware");
const dogMiddleware = require("../../middleware/dogMiddleware");
const photoControllers = require("../../controllers/photoControllers");

const { GetSignedUrl, getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

//GET
router.get(
  "/single/:photoName",
  authMiddleware.decodeJwt,
  photoControllers.getPhotoByName
);
//get all by dog id
router.get(
  "/:dogId",
  authMiddleware.decodeJwt,
  photoControllers.getPhotosByDogId
);
//CREATE

//DELETE
router.delete(
  "/:dogId/:medId",
  authMiddleware.decodeJwt,
  authMiddleware.verifyDogOwner,
  dogMiddleware.verifyDogMedicine
);

router.post(
  "/:dogId",
  authMiddleware.decodeJwt,
  upload.single("file"),
  photoControllers.postPhoto
);

module.exports = router;

//   async (req, res) => {
//     console.log("req.body", req.body);
//     console.log("req.body", req.file);
//     const params = {
//       Bucket: bucketName,
//       Key: randomizeImageName(),
//       Body: req.file.buffer,
//       ContentType: req.file.mimetype,
//     };
//     const command = new PutObjectCommand(params);
//     await s3.send(command);
//     res.send({});
//   };
