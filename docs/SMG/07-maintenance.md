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

## Clearing out old docker images to free disk space

Docker retains all of the old images when we build new ones - this can lead to the disk getting full. All of the image files are located in `/var/lib/docker` and you can assess the disk usage using:
```
sudo du -h --max-depth=1 /var/lib/docker/
```
To clear the images, stop the system with:
```
docker-compose down
```
from the `src/Docker` folder and then run:
```
docker system prune -a
```
This may take a while, but once done then rebuild and restart the system.

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