import React, { useState, useEffect, Fragment, forwardRef, useRef, useImperativeHandle } from "react"; 
import { Row, Col, Button} from "reactstrap"; 
import { useDropzone } from "react-dropzone"; 
import { toast } from "react-toastify";
import _ from "lodash"; 
import { IntakeFormImage } from "../configs/ApiActionUrl"; 
import "../assets/scss/plugins/extensions/dropzone.scss"; 
import Cancel from "../assets/img/icons/cancel.png";
import DocxImg from "../assets/img/icons/docx.png"; 

/*Multi File uploader */
const MultiFileUploder = forwardRef((props, ref) => {
  const [files, setFiles, FileExtension] = useState([]);  
  const { setFieldValue, initFiles = [] } = props;  
  
  const { getRootProps, getInputProps, open } = useDropzone({
    accept: "image/png, image/gif, image/jpeg, image/tiff, .tif, application/pdf",
    noClick: true,
    noKeyboard: true,
    onDrop: (acceptedFiles) => { 
      var fileToupload = acceptedFiles;

      setFiles(
        acceptedFiles.map((file) =>{
          let fileType = file.type.split('/')[0]; 
          let previewUrl = DocxImg;
          if(fileType == "image"){
            previewUrl = URL.createObjectURL(file) 
          }
          return( Object.assign(file, {
            preview: previewUrl, 
          }))
        })
      );  
      setFieldValue("filesToUpload", fileToupload);
    }
  });

  useImperativeHandle(ref, () => ({ 
    resetFiles() {
      setFiles([])
    } 
  }));
  
  const thumbs = files.map((file, r) => (
    <div className="text-center dz-wrap" key={file.name}>
      <div className="dz-thumb">
        <div className="dz-thumb-inner">
          <a className="cancel-icon" onClick={()=>{removeImg(r)}}>
            <img src={Cancel} alt='close'/>
          </a>
          <img src={file.preview} className="dz-img" alt={file.name} />
        </div>
      </div>
      <label className="d-block">{file.name}</label>
    </div>
  )); 

  const removeImg = (r) =>{ 
    var removedFiles = _.remove(files, function(f, k) {
      return k != r;
    });  
    setFiles(removedFiles)
    setFieldValue("filesToUpload", removedFiles); 
  } 
  
  const initThumds = initFiles.map((file, i) =>{ 
    let previewUrl = DocxImg;
    let split = file.split('.');
    let fileType = split[split.length - 1];  
   
     if(_.toLower(fileType) == "png" || _.toLower(fileType) == "jpg" || _.toLower(fileType) == "jpeg"){
       previewUrl = `${IntakeFormImage.path}${file}`
     }
    return(
        <div className="text-center dz-wrap" key={i}>  
          <div className="dz-thumb">
            <div className="dz-thumb-inner">
            <a className="cancel-icon" 
              onClick={()=>{removeFile(i)}}><img
                src={Cancel}
                alt='close'
          /></a>
              <img src={previewUrl} className="dz-img" alt={file.split('_')[1]} />
            </div> 
          </div>
          <label className="d-block">{file.split('_')[1]}</label>
        </div>
    )
  });

  const removeFile = (i) =>{ 
    var init = _.remove(initFiles, function(f, k) {
      return k == i;
    });   
    props.deleteFile(init[0])
  } 
 
 
  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <Row className="align-items-center mb-4">
      <Col md="9">
  <aside className="thumb-container border p-2 mt-0">{initThumds}{thumbs}</aside>
        <p className="position-absolute">
          Accepted Formats: PDF, JPG, PNG, TIFF
        </p>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
        </div>
      </Col>
      <Col md="3" className="pl-0">
        <div className="d-block ripple">
          <Button.Ripple color="primary" className="btn-block" onClick={open}>
            Browse
          </Button.Ripple>
        </div>
      </Col>
    </Row>
  );
})

export { MultiFileUploder}