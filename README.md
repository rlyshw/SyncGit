# GitSync
Syncronize a folder on a remote server with git. 
I write code on my laptop and push it to a non-production development server for testing. This model is great for my workflow. I offload app processing from my laptop and can test unimpeded in a near-production environment with a no-nonsense build/deploy system. Plus it's secure and forces me to keep a good commit history.

This will take a few steps of configuration per specific environment.

This is intended to be installed with a project and run in the same repo you are developing on. So it's node-only for now.

## Usage
  ```node gitsync branch webhookSecret [port] [endpoint]```

### Launch the service
Use whatever means necessary to launch the system in a persistent way (so that it will stay listening while you do other things)

### Register a webhook to an open endpoint.
Your system will need to be open to the internet to receive update events from github's webhooks services.
1. Go to the repo you want to use.
2. Click "Settings" (it's on the right)
3. Click "Webhooks and Services"
4. Click "Add a Webhook" and confirm your password
5. Enter `https://[exampledomain.com]:3021/nodedevhook` in the given prompt. (you can configure the port and /nodedevhook part in the source)
6. Enter a secret value, REMEMBER THIS. You'll need to provide it to the devhook CLI.
7. click "Add Webhook"
