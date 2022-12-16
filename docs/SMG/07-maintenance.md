# Maintenance

## Viewing logs
Log into the virtual machine, then to see running containers, run:
```
docker-compose ps
```
Get logs with:
```
docker-compose logs
```

## Docker Cleanup
Docker retains all of the old images when we build new ones - this can lead to the disk getting full. All of the image files are located in `/var/lib/docker` and you can assess the disk usage using:
```
sudo du -h --max-depth=1 /var/lib/docker/
```
### Check all available resources using the following commands:
```
docker container ls
```
This lists the Docker containers
```
docker image ls
```
This lists the Docker images
```
docker volume ls
```
This lists the Docker volumes
```
docker network ls
```
This lists the Docker networks

### Automatically cleaning up after Docker 
Docker has a 'prune' command to tell it to cleanup all unused docker containers but this is not done by itself so you'll need to login every now and then and tell it to.

#### Docker prune command
```
docker system prune
```
This removes all unused containers, networks, images(both dangling and unreferenced) and optionally, volumes

#### Warning
This command will delete dangling and unused images not referenced by any containers, networks that are not used, the build cache and any stopped containers.


### Docker Prune Commands
The following are prune commands:
#### Cleaning containers
```
sudo docker ps -a 
```
This lists the all the docker containers that are currently running
```
sudo docker container prune
```
This removes all stopped containers
```
sudo docker container ls
```
This lists the Docker containers

#### Cleaning dangling/zombie images
```
sudo docker image ls
```
```
sudo docker image prune -f
```
#### Cleaning volumes
```
sudo docker volume ls
```
```
sudo docker volume prune -f
```
#### Cleaning networks
```
sudo docker network ls
```
```
sudo docker network prune -f
```
#### Cleaning the system
```
sudo docker system prune
```
```
docker system df
```
This shows docker disk usage, including space reclaimable by pruning


## Steps to follow (Linux systems)
1. Set up a cronjob to execute the desired Docker Prune command eg.``` docker image prune -f```

   -f — tells Docker to force the prune command without prompting the user
  
    To check to see if the cron daemon is running, search the running processes with the ps command.  
    The cron daemon's command will show up in the output as ```crond```:
    ```
    ps -ef | grep crond
    ```
2. Navigate to the ```etc/cron.weekly/``` folder 
3. Create a new file in the folder eg. 
```
cd /etc/cron.weekly
sudo nano docker-prune-weekly
```
4. Once the file opens, add the desired prune command and inform the OS that this is a bash file(place the Bash Shebang at the top of the file):
```
#!/bin/bash
docker image prune -f
```
5. Hit the ```Ctrl + O``` and then ```Ctrl + X``` to save and close the file.

#### Scheduling
6. Once the file is created, we need to tell the Operating System that it needs to be executable with the following command:
```
sudo chmod +x /etc/cron.weekly/docker-prune-weekly
```

#### Testing
7. To test out to see if the command executes correctly next time the cronjob runs, we can force the weekly Cron register to run with the folllowing command:
```
run-parts /etc/cron.weekly
```

## Accounts and secrets for deployment

The automated deployment action makes use of secrets stored in GitHub under **Settings > Secrets > Actions** [here](https://github.com/icipe-official/vectoratlas-software-code/settings/secrets/actions).

The automated action also makes use of a dedicated ssh key for deployment that can be cycled if compromised. The admin account for the virtual machine must not be used by GitHub.

If cycling the account then remove the deployment key from the `authorized_keys` file, this will be the one that is not marked as `generated-by-azure`.

Generate a new ssh key pair with:
```
cd ~
ssh-keygen -t rsa
```
Enter the filename as `github-actions` and do not include a passphrase.

Move the new key files into the ssh folder
```
mv github-actions .ssh/
mv github-actions.pub .ssh/
```

Then append the new public key to the end of the `authorized_keys` file:
```
cd ~/.ssh
cat github-actions.pub >> ./authorized_keys
```

Copy the value in the new public key in to the GitHub repository secret `TEST_SERVER_SSH_PRIVATE_KEY`.
