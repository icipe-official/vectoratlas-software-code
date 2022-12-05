# DOCKER CLEANUP
## Check all available resources using the following commands:
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

## Automatically cleaning up after Docker 
Docker has a 'prune' command to tell it to cleanup all unused docker containers but this is not done by itself so you'll need to login every now and then and tell it to.

### Docker prune command
```
docker system prune
```
This removes all unused containers, networks, images(both dangling and unreferenced) and optionally, volumes

#### Warning
This command will delete dangling and unused images not referenced by any containers, networks that are not used, the build cache and any stopped containers.

## STEPS TO FOLLOW (Linux systems)
1. Set up a cronjob to execute the desired Docker Prune command eg.``` docker image prune -f```
-f — tells Docker to force the prune command without prompting the user
  
  a. Check if cron package is installed:
  ```
  dpkg 

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
2. Create a new folder in the ```/etc/```directory eg. ```etc/cron.weekly/```
3. Create a new file in the folder eg. 
```
cd /etc/cron.weekly
sudo nano docker-prune
```
4. Once the file opens, add the desired prune command and inform the OS that this is a bash file(place the Bash Shebang at the top of the file):
```
#!/bin/bash
docker image prune -f
```
5. Save and close the file
