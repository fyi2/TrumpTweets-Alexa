rm lambda.zip
cd src
npm prune --production
node index.js
7z a -r ../lambda.zip *
cd ..
aws lambda update-function-code --function-name <Function Name> --zip-file fileb://lambda.zip
