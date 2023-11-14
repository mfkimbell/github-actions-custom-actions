# github-actions-custom-actions

### **Tools Used:**
* `Composite Actions` For simple combinations of different jobs, with inputs and outputs for dynamic responses
* `Javascript Actions` For custom actions that run scripts in combination with a .js file
* `Docker Actions` For cutom actions that need scripts run in a non-javascript language and for more control over enviornment
* `AWS-S3` For static website hosting

    

<img width="847" alt="Screenshot 2023-11-03 at 12 51 46 PM" src="https://github.com/mfkimbell/github-actions-custom-actions/assets/107063397/2651e96f-7302-441b-8a24-d3f8ea93be42">

### Custom Composite Action:

The first action I assigned is a composite action. This composite action checks whether caching needs to be performed, then uses a Github custom action to download, install, and then cache dependencies with "actions/cache@v3". The install step is only run if we fail our cache-hit or we specify with an input to specifically not use cache:  

```if: steps.cache.outputs.cache-hit != 'true' || inputs.caching != 'true'```

 ```echo "cache='${{ inputs.caching }}'" >> $GITHUB_OUTPUT```
 
  This line adds an ouput that is used lated in our "deploy.yml":
  
  ```
- name: Load & cache dependencies
        id: cache-deps
        uses: ./.github/actions/cached-deps
        with:
          caching: "false" #disables cache for this step
      - name: Output information
        run: echo "Cache used? ${{steps.cache-deps.outputs.used-cache}}"
```

  


  <img width="774" alt="Screenshot 2023-11-04 at 4 45 36 PM" src="https://github.com/mfkimbell/github-actions-custom-actions/assets/107063397/a62e2277-e6e6-4a73-9f71-dc57285c9256">



  Caching will only be attempted if it was attempted previously OR a step has specified with a input "caching=false"
  

By default, if not specified, we attempt to use cached dependencies if they are available. We check an output from the "Install dependencies" step by referencing the "install" id, and print whether cache was used as a log for the step. The output is assigned from the cache step in line


This is where this custom action is used in the main workflow:

<img width="638" alt="Screenshot 2023-11-04 at 4 44 18 PM" src="https://github.com/mfkimbell/github-actions-custom-actions/assets/107063397/5a1ef2e9-9e19-4e7a-a128-7adfffbfe892">

Next we run a test step. It gathers the required files and then uses a built in npm testing library to run a test.jsx file that tests for the presence of a button as well as the popup component of the button. 

<img width="579" alt="Screenshot 2023-11-04 at 5 26 59 PM" src="https://github.com/mfkimbell/github-actions-custom-actions/assets/107063397/1d1e24c3-7281-4a51-8057-89dfe98112b0">

### Custom Javascript Action:

For our website deployment, I use a javascript custom action. I define input parameters, with "bucket" and "dist-folder" being required, and "bucket-region" defaulting to 'us-east-1', which are passed in from the "deploy.yml" if they are set as "required: true". These will be used during the execution of the "main.js" file. 

<img width="573" alt="Screenshot 2023-11-04 at 5 33 19 PM" src="https://github.com/mfkimbell/github-actions-custom-actions/assets/107063397/043e6ed7-ecc1-47a9-84dd-ee739015f1ae">

"main.js" Uses built-in Github commands through the "require()" function passing in Github custom actions "@actions/core" and "@actions/exec". We can use that "core" object to connect to AWS and pass in our inputs, and upload our static webpage to AWS. 

<img width="699" alt="Screenshot 2023-11-04 at 5 35 42 PM" src="https://github.com/mfkimbell/github-actions-custom-actions/assets/107063397/c61b5f48-2b46-49b1-b17c-9e9c2c86a4d6">

We add an "output" to action.yml
```
outputs:
  website-url:
    description: 'The URL of the deployed website.'
```
and then set that output in "main.js"

```
 const websiteUrl = `http://${bucket}.s3-website-${bucketRegion}.amazonaws.com`
  core.setOutput('website-url',websiteUrl) // ::set
```
and that results in our URL being added to our actions logs:

<img width="851" alt="Screenshot 2023-11-06 at 11 13 25 AM" src="https://github.com/mfkimbell/github-actions-custom-actions/assets/107063397/451546f2-97c4-451b-8025-06af93f427ad">


### Custom Javascript Action:
Key difference is that we are going to use a docker image based on a Dockerfile. This is so we can execute in a language of our choice. I chose Python. 

<img width="558" alt="Screenshot 2023-11-06 at 12 15 43 PM" src="https://github.com/mfkimbell/github-actions-custom-actions/assets/107063397/7f402900-93dc-47f0-b776-b170dc39994c">

All our docker file does is copy the requirements.txt and deployment.py, install the dependencies, then call the python function, which performs the exact same as main.js but in Python.

<img width="449" alt="Screenshot 2023-11-06 at 12 16 44 PM" src="https://github.com/mfkimbell/github-actions-custom-actions/assets/107063397/bc3503dc-1a77-4a04-8e65-dc094f411d37">

And here's the python file:

<img width="813" alt="Screenshot 2023-11-06 at 12 18 20 PM" src="https://github.com/mfkimbell/github-actions-custom-actions/assets/107063397/416ad168-34f3-44e3-a0dd-4feebe16df19">

We change the deploy step to use our new docker action:

<img width="533" alt="Screenshot 2023-11-06 at 12 15 00 PM" src="https://github.com/mfkimbell/github-actions-custom-actions/assets/107063397/9eeb7b0a-4fad-4ae2-b747-f46400791b10">

Finally, we can see the results of our change, we can see our job is now running on a Docker image.

<img width="536" alt="Screenshot 2023-11-06 at 12 20 21 PM" src="https://github.com/mfkimbell/github-actions-custom-actions/assets/107063397/1d8d99bc-1d18-48bc-b9b9-10c361e53ee5">

And we get the same result as before:

<img width="537" alt="Screenshot 2023-11-06 at 12 10 36 PM" src="https://github.com/mfkimbell/github-actions-custom-actions/assets/107063397/d0a3aaf1-f1dd-4ede-8967-8fe0c5d44a2e">







