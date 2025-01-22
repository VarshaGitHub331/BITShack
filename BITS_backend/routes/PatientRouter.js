const express = require("express");
const {
  registerPatient,
  addLocation,
  fetchAppointments,
  getPatientLocation,
  getPatientProfile,
} = require("../controllers/Patient");
const {
  Patient_Documents,
  Patient_Resource,
} = require("../utils/InitializeModels");
const { uploadDocument } = require("../controllers/FileUpload");
const axios = require("axios");
const patientRouter = express.Router();
const upload = require("../utils/Multer");
patientRouter.post("/patientRegister", registerPatient);
patientRouter.put("/addLocation", addLocation);
patientRouter.get("/fetchAppointments", fetchAppointments);
patientRouter.get("/fetchLocation", getPatientLocation);
patientRouter.get("/patientProfile", getPatientProfile);
patientRouter.post(
  "/uploadDocument",
  upload.single("document"), // File upload middleware
  uploadDocument, // Middleware to set req.documentUrl
  async (req, res, next) => {
    const documentTypeMapping = {
      "Lab Report": {
        code: "55107-7",
        system: "http://loinc.org",
        display: "Laboratory report",
      },
      Imaging: {
        code: "18748-4",
        system: "http://loinc.org",
        display: "Radiology study report",
      },
      Prescription: {
        code: "57833-6",
        system: "http://loinc.org",
        display: "Medication prescription",
      },
      "Discharge Summary": {
        code: "18842-5",
        system: "http://loinc.org",
        display: "Hospital discharge document",
      },
    };

    const { user_id, record_type } = req.body;

    // Validate input
    if (!req.documentUrl) {
      return res.status(400).json({ error: "Document URL is missing" });
    }
    if (!documentTypeMapping[record_type]) {
      return res.status(400).json({ error: "Invalid document type" });
    }

    try {
      // Extract the filename from Multer's req.file
      const fileName = req.file?.originalname || "unknown";
      console.log("THE FILE NAME IS ", fileName);
      // Save the uploaded document reference to your database
      const uploadedDocument = await Patient_Documents.create({
        patient_id: user_id,
        record: req.documentUrl,
        record_type,
        file_name: fileName, // Save the filename in your database
      });

      // Fetch FHIR patient resource
      const patientResource = await Patient_Resource.findOne({
        where: { patient_id: user_id },
      });

      if (!patientResource) {
        return res.status(404).json({ error: "Patient resource not found" });
      }

      const patient_resource_fhir_id = patientResource.patient_resource_fhir_id;

      // Construct FHIR DocumentReference
      const documentCode = documentTypeMapping[record_type];
      const documentData = {
        resourceType: "DocumentReference",
        status: "current",
        type: {
          coding: [
            {
              system: documentCode.system,
              code: documentCode.code,
              display: documentCode.display,
            },
          ],
          text: record_type, // Human-readable type
        },
        content: [
          {
            attachment: {
              url: req.documentUrl,
              title: fileName, // Add the filename as the title
            },
          },
        ],
        subject: {
          reference: `Patient/${patient_resource_fhir_id}`,
        },
      };

      // Send to SimpliFHIR server (hardcoded URL and token)
      const response = await axios.post(
        "https://fhir.simplifier.net/BITS-HACK/DocumentReference", // Hardcoded SimpliFHIR URL
        documentData,
        {
          headers: {
            Authorization: `Bearer ${process.env.SIMPLIFIER_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        return res.status(201).json({
          message: "Document uploaded and metadata saved successfully",
          documentId: response.data.id,
        });
      } else {
        console.error("SimpliFHIR Response Error:", response.data);
        return res
          .status(500)
          .send("Error storing document metadata in SimpliFHIR");
      }
    } catch (e) {
      console.error("Error:", e.message || e);
      next(e);
    }
  }
);

module.exports = patientRouter;
