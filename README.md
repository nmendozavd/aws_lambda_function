# AWS Lambda Function

AWS Lambda allowed me to run code without provisioning or managing any other server. It also executes the code only when triggered and can scale automatically from handling a few requests per day to more than thousands of requests per second. I configured the function to get triggered every time an access log file is written to the export access logs bucket. The function, which was written in Node.js, parsed the log files, extracted relevant information and wrote into a new bucket. 