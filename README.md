# Demo

This project was generated with nodejs, express, shelljs, fs, async

## Development server
step 1 : Run `node server.js` for a dev server. Navigate to `http://localhost:3001/`.
 
step 2 : Nevigate to 'http://localhost:3001/generate-verification' to generate tracker
token which is needs to be added in to package json file for verification in your project.

step 3 : 'http://localhost:3001/fetch-repo' send tracker you received and url = your repo url,  
example('http://localhost:3001/fetch-repo?url=https://github.com/indorseio/indorse-poc-backend.git&tracker=0.b3wfcqn59ph')

step 4 : 'http://localhost:3001/verification-tracker' pass your tracker to find current status of your repo, 
example('http://localhost:3001/track-verification?tracker=0.b3wfcqn59ph')


