# PDF-ReadyPlanet
### run firebase emulator for test pdf generator
```
 cd function
 npm install
 npm install -g firebase-tools
 firebase emulators:start
```

### git command
```
 git pull origin main
 
 git status
 git add -A
 git commit -m 'comment bla bla ...'
 git push origin main
```

### clone database on firebase
```
 No Project
 gcloud config set project 'PROJECT ID'

 gcloud firestore export gs://backupdataetax/database-backup
 
 cd functions
 gsutil -m cp -r gs://backupdataetax/database-backup .

 npm install --save firebase-admin
 
 firebase emulators:start --import ./database-backup
```