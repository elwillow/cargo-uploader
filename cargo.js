//      Filename: cargo.js
//      Date:     2011-06-12
//      author:   Mathieu Charron <mathieu@hyberia.ca>
//      Project:  G-Anime Cargo
//      desc:     File uploader in HTML5
//
//      Copyright 2011 Hyberia Inc.
//
//      Redistribution and use in source and binary forms, with or without
//      modification, are permitted provided that the following conditions are
//      met:
//
//      * Redistributions of source code must retain the above copyright
//        notice, this list of conditions and the following disclaimer.
//      * Redistributions in binary form must reproduce the above
//        copyright notice, this list of conditions and the following disclaimer
//        in the documentation and/or other materials provided with the
//        distribution.
//      * Neither the name of the Hyberia Inc. nor the names of its
//        contributors may be used to endorse or promote products derived from
//        this software without specific prior written permission.
//
//      THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
//      "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
//      LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
//      A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
//      OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
//      SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//      LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
//      DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
//      THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
//      (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
//      OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//      Original by  Andrea Giammarchi  webreflection.blogspot.com
//

// We the form is going
var POST_URL = "cargo_debug.py"

function sizeByte(bytes){
    var i = 0;
    while(1023 < bytes){
        bytes /= 1024;
        ++i;
    };
    return  i ? bytes.toFixed(2) + ["", " KB", " MB", " GB", " TB"][i] : bytes + " bytes";
};
// simple function to show a friendly size for BITS
function sizeBit(bits){
    var i = 0;
    while(1000 < bits){
        bits /= 1000;
        ++i;
    };
    return  i ? bits.toFixed(2) + ["", " Kbit", " Mbit", " Gbit", " Tbit"][i] : bits + " bits";
};

// Format the seconds into something meaningful.
function remainingTime(seconds) {
    var h = Math.floor(seconds / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 3600 % 60);
    return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
}

// Update Fields stats
function updater() {
    var currentBytes = bytesUploaded;
    var bytesDiff = currentBytes - previousBytesLoaded;
    if (bytesDiff == 0) return;
    previousBytesLoaded = currentBytes;
    var secondsRemaining = (bytesTotal - previousBytesLoaded) / bytesDiff;

    //transferSpeed.innerHTML = speed;
    document.getElementById('transferSpeedInfo').innerHTML = sizeByte(bytesDiff) + "/s";
    document.getElementById("timeRemainingInfo").innerHTML = 'eta ' + remainingTime(secondsRemaining);
}

// Once the file is selected, start the file process
function fileSelected() {
    document.getElementById('file').setAttribute("disabled", "true");
    var inp = document.getElementById('file');
    document.getElementById('fileInfo').style.display = 'block';
    var fileInfoName = inp.files.length > 1 ? "[Multiple Files]" : inp.files[0].name;
    var fileInfoType = inp.files.length > 1 ? "[Multiple Files]" : inp.files[0].type;
    var fileInfoSize = 0;
    for (var i = 0; i < inp.files.length; ++i) {
        fileInfoSize = fileInfoSize + inp.files[i].fileSize
    }
    document.getElementById('fileName').innerHTML = 'Name: ' + fileInfoName;
    document.getElementById('fileSize').innerHTML = 'Size: ' + sizeByte(fileInfoSize);
    document.getElementById('fileType').innerHTML = 'Type: ' + fileInfoType;

    previousBytesLoaded = 0;
    document.getElementById('uploadResponse').style.display = 'none';
    document.getElementById('progressIndicator').style.display = "block";
    document.getElementById('progressNumber').innerHTML = '';
    var progressBar = document.getElementById('progressBar');
    progressBar.style.display = 'block';
    progressBar.style.width = '0px';

    var fd = new FormData();
    //fd.append("author", "");
    for (var i = 0; i < inp.files.length; ++i) {
        fd.append("file", inp.files[i]);
    }
    //fd.append("file", document.getElementById('file').files[0]);
    /* entire form */
    //var fd = document.getElementById('form1').getFormData();

    // Instanciate the upload request
    var xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", uploadProgress, false);
    xhr.addEventListener("load", uploadComplete, false);
    xhr.addEventListener("error", uploadFailed, false);
    xhr.addEventListener("abort", uploadCanceled, false);
    xhr.open("POST", POST_URL, true);
    //xhr.setRequestHeader("Content-Type", "multipart/form-data");
    xhr.setRequestHeader("X-File-Name", fileInfoName);
    xhr.setRequestHeader("X-File-Size", fileInfoSize);
    xhr.setRequestHeader("X-File-Type", fileInfoType);
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    //xhr.send(fd);

    // Start the updater
    intervalTimer = setInterval(updater, 1000);
    xhr.send(fd);
}

function uploadProgress(evt) {
    if (evt.lengthComputable) {
        bytesUploaded = evt.loaded;
        bytesTotal = evt.total;
        var percentComplete = Math.round(evt.loaded * 100 / evt.total);
        // Update text
        document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%';
        document.getElementById('progressBar').style.width = (percentComplete * 3.55).toString() + 'px';
        document.getElementById('transferBytesInfo').innerHTML = sizeByte(bytesUploaded);
        // When complete
        if (percentComplete == 100) {
            document.getElementById('progressIndicator').style.display = "none";
            var uploadResponse = document.getElementById('uploadResponse');
            uploadResponse.className = "mehResponse";
            uploadResponse.innerHTML = '<strong>Please wait...</strong>';
            uploadResponse.style.display = 'block';
        }
    }
    else {
        document.getElementById('progressBar').innerHTML = 'unable to compute';
    }
}

function uploadComplete(evt) {
    clearInterval(intervalTimer);
    var uploadResponse = document.getElementById('uploadResponse');
    uploadResponse.className = "goodResponse";
    uploadResponse.innerHTML = evt.target.responseText;
    uploadResponse.style.display = 'block';
    document.getElementById('file').removeAttribute("disabled");
}

function uploadFailed(evt) {
    clearInterval(intervalTimer);
    document.getElementById('progressIndicator').style.display = "none";
    var uploadResponse = document.getElementById('uploadResponse');
    uploadResponse.className = "badResponse";
    uploadResponse.innerHTML = "<strong>Upload failed</strong><br />An error occurred ";
    uploadResponse.style.display = 'block';
    document.getElementById('file').removeAttribute("disabled");
}

function uploadCanceled(evt) {
    clearInterval(intervalTimer);
    document.getElementById('progressIndicator').style.display = "none";
    var uploadResponse = document.getElementById('uploadResponse');
    uploadResponse.className = "badResponse";
    uploadResponse.innerHTML = "<strong>Upload canceled</strong><br />Connection lost.";
    uploadResponse.style.display = 'block';
}
