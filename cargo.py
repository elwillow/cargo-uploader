#       Filename: cargo.py
#       Date:     2011-06-12
#       author:   Mathieu Charron <mathieu@hyberia.ca>
#       Project:  G-Anime Cargo
#       desc:     File uploader in HTML5
#
#       Copyright 2011 Hyberia Inc.
#
#       Redistribution and use in source and binary forms, with or without
#       modification, are permitted provided that the following conditions are
#       met:
#
#       * Redistributions of source code must retain the above copyright
#         notice, this list of conditions and the following disclaimer.
#       * Redistributions in binary form must reproduce the above
#         copyright notice, this list of conditions and the following disclaimer
#         in the documentation and/or other materials provided with the
#         distribution.
#       * Neither the name of the Hyberia Inc. nor the names of its
#         contributors may be used to endorse or promote products derived from
#         this software without specific prior written permission.
#
#       THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
#       "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
#       LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
#       A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
#       OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
#       SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
#       LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
#       DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
#       THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
#       (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
#       OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
#
#!/usr/bin/python
import cgi
import os
import cgitb; cgitb.enable()

try: # Windows needs stdio set for binary mode.
    import msvcrt
    msvcrt.setmode (0, os.O_BINARY) # stdin  = 0
    msvcrt.setmode (1, os.O_BINARY) # stdout = 1
except ImportError:
    pass

# Destination for the files, add the trailing slash
FILE_DESTINATION = "/home/elwillow/dump/"

form = cgi.FieldStorage()

# Generator to buffer file chunks
def fbuffer(f, chunk_size=10000):
   while True:
      chunk = f.read(chunk_size)
      if not chunk: break
      yield chunk

# A nested FieldStorage instance holds the file
fileitems = form['file']

message = ""
# Test if the file was uploaded
if fileitems:
    for item in fileitems:
        # strip leading path from file name to avoid directory traversal attacks
        fn = os.path.basename(item.filename)
        f = open(FILE_DESTINATION + fn, 'wb', 10000)

        # Read the file in chunks
        for chunk in fbuffer(item.file):
            f.write(chunk)
        f.close()
        message = message + 'The file "' + fn + '" was uploaded successfully<br />'

else:
    message = 'No file was uploaded'

print """\
Content-Type: text/html\n
%s
""" % (message,)
