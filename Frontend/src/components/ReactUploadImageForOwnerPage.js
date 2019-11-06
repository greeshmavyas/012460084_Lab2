import React, { Component } from "react";
import axios from "axios";
import "./AddItem.css";
import ReactDropzone from "react-dropzone";
import cookie from "react-cookies";

//constants
const acceptedFileTypes =
  "image/x-png, image/png, image/jpg, image/jpeg, image/gif";
const acceptedFileTypesArray = acceptedFileTypes.split(",").map(item => {
  return item.trim();
});
const imageMaxSize = 1000000000; // bytes

class ReactUploadImageForOwnerPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: cookie.load("cookie2"),
      previewuploadedPhotos: [],
      uploadedPhotos: [],
      uploadedPhotoLimit: 1,
      file: null
    };

    this.onChange = this.onChange.bind(this);
    this.fileUploadHandler = this.fileUploadHandler.bind(this);
  }
  verifyFile = files => {
    if (files) {
      const currentFile = files;
      const currentFileType = currentFile.type;
      const currentFileSize = currentFile.size;
      if (currentFileSize > imageMaxSize) {
        alert(
          "This file is not allowed. " + currentFileSize + " bytes is too large"
        );
        return false;
      }
      if (!acceptedFileTypesArray.includes(currentFileType)) {
        alert("This file is not allowed. Only images are allowed.");
        return false;
      }
      return true;
    }
  };
  onDrop = (selectedFiles, rejectedFiles) => {
    let index;
    for (index = 0; index < selectedFiles.length; ++index) {
      const selectedfile = selectedFiles[index];
      const rejectedfile = rejectedFiles[index];
      if (rejectedfile) {
        this.verifyFile(rejectedfile);
      }

      if (selectedfile) {
        const isVerified = this.verifyFile(selectedfile);
        if (isVerified) {
          if (
            this.state.previewuploadedPhotos.length <
            this.state.uploadedPhotoLimit
          ) {
            this.setState(({ previewuploadedPhotos }) => ({
              previewuploadedPhotos: previewuploadedPhotos.concat(selectedfile)
            }));

            console.log(this.state.selectedfile);

            this.setState({
              uploadedPhotos: this.state.uploadedPhotos.concat(selectedfile)
            });

            console.log(this.state.uploadedPhotos);
            this.setState({ file: selectedfile });
          } else {
            this.setState(({ previewuploadedPhotos }) => ({
              previewuploadedPhotos: []
            }));
            this.setState(({ previewuploadedPhotos }) => ({
              previewuploadedPhotos: previewuploadedPhotos.concat(selectedfile)
            }));
            console.log(this.state.selectedfile);

            this.setState({
              uploadedPhotos: this.state.uploadedPhotos.concat(selectedfile)
            });

            console.log(this.state.uploadedPhotos);
            this.setState({ file: selectedfile });
            console.log(this.state.previewuploadedPhotos.length);
            alert(
              "You are again changing the profile picture. Click upload if you actually want to do it"
            );
          }
        }
      }
    }
  };
  fileUploadHandler = () => {
    const formData = new FormData();

    formData.append("myImage", this.state.file);
    formData.append("email", cookie.load("cookie2"));
    console.log("form data" + formData);
    console.log(this.state.file);
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };
    axios
      .post("http://localhost:3001/grubhub/owner/upload", formData, config)
      .then(response => {
        this.props.readFileName(response.data.fileName);
        alert("The file is successfully uploaded");
      });
  };

  onChange(e) {
    this.setState({ file: e.target.files[0] });
  }

  render() {
    return (
      <div className="container">
        <div className="row" style={{ width: "70%", marginLeft: "10%" }}>
          <div className="col-md-10 text-center border card-body">
            <p>
              {" "}
              Requirements: JPEG, at least 1920 x 1080 pixels, less than 20MB
              file size.
            </p>
            <h5> Update your profile picture</h5>

            {this.state.previewuploadedPhotos.length > 0 ? (
              <div>
                <div>
                  {this.state.previewuploadedPhotos.map(selectedfile => (
                    <img
                      className="mypreview"
                      src={selectedfile.preview}
                      alt="Property Preview"
                    />
                  ))}
                </div>
              </div>
            ) : null}

            <br></br>
            <ReactDropzone
              name="uploadedPhoto"
              onDrop={this.onDrop}
              accept={acceptedFileTypes}
              multiple={true}
              maxSize={imageMaxSize}
            >
              Drop your image here!!
            </ReactDropzone>
            <button onClick={this.fileUploadHandler}>Upload</button>
          </div>
        </div>
      </div>
    );
  }
}

export default ReactUploadImageForOwnerPage;
