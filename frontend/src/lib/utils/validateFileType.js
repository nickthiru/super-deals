// A function to validate the type of file (extension)
const validateFileType = (allowedFileTypes) => {
  return (file) => {
    const fileType = file.name.split('.').pop();
    return allowedFileTypes.includes(`.${fileType}`);
  };
};

export default validateFileType;