Cargo Uploader
==============

Install in a Python enable server and edit the FILE_DESTINATION in
cargo.py to what you want.

Web server Configuration
------------------------

### Lighttpd

You need to enable the mod_cgi module

    server.modules += ( "mod_cgi" )

Then assign the .py extension to your python interpreter

    cgi.assign = (
        ".py" => "/usr/local/bin/python2.7",
    )

Your path is probably different

### Apache

No idea ;)

Contribution
------------

If you find a bug or you want to improve it, check https://github.com/elwillow/cargo-uploader
