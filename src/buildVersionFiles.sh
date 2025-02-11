# Ensure tags are fetched
git fetch --tags

# Get the latest tag and full description (fallback to commit hash if no tags exist)
VERSION=$(git describe --tags --long || git rev-parse --short HEAD)

# Write the version information to version.txt files
echo "$VERSION" > UI/public/version.txt
echo "$VERSION" > API/public/version.txt
