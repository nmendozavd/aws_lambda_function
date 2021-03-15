const stream = require('stream')
const readline = require('readline')
const AWS = require('aws-sdk')
const S3 = new AWS.S3()

// AWS Lambda function to read and write S3 files by line to perform efficient processing
// read S3 file by line
function createReadline(Bucket, Key) {

    // s3 read stream
    const input = S3
        .getObject({
            Bucket,
            Key
        })
        .createReadStream()

    // node readline with stream
    return readline
        .createInterface({
            input,
            terminal: false
        })
}

// write S3 file
function createWriteStream(Bucket, Key) {
    const writeStream = new stream.PassThrough()
    const uploadPromise = S3
        .upload({
            Bucket,
            Key,
            Body: writeStream
        })
        .promise()
    return { writeStream, uploadPromise }
}

// perform processing on line
function processLine(line) {
    // code to parse relevant data from log files (string manipulation)
    return line
}

exports.handler = function execute(event, context, callback) {
    console.log(JSON.stringify(event, null, 2))
    var totalLineCount = 0

    // create input stream from S3
    const readStream = createReadline(inputBucket, inputKey)

    // create output stream to S3
    const { writeStream, uploadPromise } = createWriteStream(outputBucket, outputKey)

    // read each line
    readStream.on('line', line => {
        
        // close stream on limit
        if (limit <= totalLineCount) {
            return readStream.close()
        }
        
        // process parsed line
        else {
            line = processLine(line)
            writeStream.write(`${line}\n`)
        }

        totalLineCount++
    })

    // clean up on close
    readStream.on('close', async () => {
        
        // end write stream
        writeStream.end()

        // wait for upload
        const uploadResponse = await uploadPromise
        
        // return processing insights
        callback(null, {
            totalLineCount,
            uploadResponse
        })
    })
}