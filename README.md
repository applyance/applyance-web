Applyance Client
==

Client component for Applyance that interfaces with the server.

API blueprints for the server can be found on [Apiary](http://docs.applyance.apiary.io//).

Prerequisites
--

The following prerequisites must be installed before installing the client application.

- Ruby installed
- Bundler gem installed

Installation
--

Within the client folder, run `bundle install` from the cmd line. This will install the necessary gems to run the client, including Sinatra.

Running
--

After installation, within the `client` folder, run `rerun --signal KILL -- rackup -p 5678`. This will startup the client application.

You can then point your browser to `localhost:5678`.
