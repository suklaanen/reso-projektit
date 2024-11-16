SET BAT_FILE_PATH=%~dp0

cd  %BAT_FILE_PATH%\backend
start "backend" npm start

cd  %BAT_FILE_PATH%\frontend
start "frontend" npx expo start -c