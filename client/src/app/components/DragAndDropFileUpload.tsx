import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography, Paper, IconButton } from "@mui/material";
import { CloudUpload, PictureAsPdf, Close } from "@mui/icons-material";
import React from "react";

interface DragAndDropFileUploadProps {
  onFileUpload: (file: File) => void;
}

const DragAndDropFileUpload: React.FunctionComponent<
  DragAndDropFileUploadProps
> = ({ onFileUpload }) => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setSelectedFile(file);
        onFileUpload(file);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 600, margin: "0 auto" }}>
      {!selectedFile ? (
        <Paper
          {...getRootProps()}
          sx={{
            border: "2px dashed",
            borderColor: isDragActive ? "primary.main" : "grey.300",
            borderRadius: 2,
            p: 3,
            cursor: "pointer",
            bgcolor: isDragActive ? "action.hover" : "background.paper",
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: "primary.main",
              bgcolor: "action.hover",
            },
          }}
        >
          <input {...getInputProps()} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CloudUpload sx={{ fontSize: 48, color: "primary.main" }} />
            <Typography variant="h6" color="textPrimary">
              {isDragActive
                ? "Drop the PDF file here"
                : "Drag and drop a PDF file here, or click to select"}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Only PDF files are accepted
            </Typography>
          </Box>
        </Paper>
      ) : (
        <Paper
          sx={{
            p: 2,
            border: "1px solid",
            borderColor: "grey.300",
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PictureAsPdf color="primary" />
              <Typography noWrap>{selectedFile.name}</Typography>
            </Box>
            <IconButton
              onClick={removeFile}
              size="small"
              sx={{ color: "grey.500" }}
            >
              <Close />
            </IconButton>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default DragAndDropFileUpload;
