# Warning

This project may never be finished. I am thinking of abandoning it and trying
it in python (maybe without the GUI), since JS is really not suitable for this.

# Brief

This project consists of a react frontend, nodejs backend and a mysql
database.

The idea is a website where the user uploads an audio file. This file shall be
converted to WAV and processed. The output shown to the user should consist of 
chords extracted from the audio file.

When finished, the website should consist of:
 - File upload panel
 - A wave chart visualising the input file
 - A slider to navigate in the file
 - Chords display (for the actual slider position)
 - Info (eg. BPM)
 - Tools (eg. edit BPM, transpose chords, ...)
 - All chords list with timestamps (in a compact format)

# Running

To run the server, run 'npm run dev' from the main folder.

To run the client, run 'npm start' from the client folder.

The database client expects a mysql database 'chord_recognizer_db' running. Run
it by 'node index.js' in db folder.
