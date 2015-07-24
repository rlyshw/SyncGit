# GitSync
Syncronize a local branch with the remote counterpart using github's webhooks services.

### Why?
I write code on my laptop and push it to a non-production development server for testing. This model is great for my workflow. I offload app processing from my laptop and can test unimpeded in a near-production environment with a no-nonsense build/deploy system. Plus it's secure and forces me to keep a good commit history.

This will take a few steps of configuration per specific environment.

This is intended to be installed with a project and run in the same repo you are developing on. So it's node-only for now. It also relies on github's webhooks infrastructure, so it is limited to github-based projects.

## Usage
  ```node gitsync -s secret [-b branch] [-p port] [-r route]```

### Launch the service
Use whatever means necessary to launch the system in a persistent way (so that it will stay alive while you do other things).
>!Important! Make sure you remember the value you use for the secret. This doesn't have to be super secure, just enough that it might not be guessed.

### Register a webhook to an open endpoint.
Your system will need to be open to the internet to receive update events from github's webhooks services.

1. Go to the github page for the repo.
2. Click "Settings" (it's on the right)
3. Click "Webhooks and Services"
4. Click "Add a Webhook" and confirm your password
5. Enter `https://[exampledomain.com]:3021/nodedevhook` in the given prompt. (you can configure port and route should match the arguments you passed to the command)
>Your system needs to be accessible by github from the web. Make sure you are using an open port!
6. Enter the secret value you provided to the command to begin with. REMEMBER this, you'll have to provide it to the gitsync script each time you rerun it.
7. click "Add Webhook".
8. Done! Start rapidly developing/testing webapps in a near-production environment.
