const core = require("@actions/core");
//const github = require("@actions/github");
//could use for github context object
const exec = require("@actions/exec");
//these are github actions that we can use to connect to AWS

function run() {
  // Get input values
  const bucket = core.getInput("bucket", { required: true });
  const bucketRegion = core.getInput("bucket-region", { required: true });
  const distFolder = core.getInput("dist-folder", { required: true });

  // Upload files
  // could use -> const localFolder = distFolder
  // we are accessing the s3 bucket and then syncing a local folder
  // with the s3 bucket
  s3Uri = `s3://${bucket}`;
	// This function recieves its permissions from enviornment variables
	//
	// the github runner, AWS-CLI looks for keys with
 	// specific names when making calls, ex: AWS_SECRET_KEY 
  exec.exec(`aws s3 sync ${distFolder} ${s3Uri} --region ${bucketRegion}`);

  core.notice("Hello from my custom Javascript Action!");
}

run();
