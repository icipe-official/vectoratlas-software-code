# Ensure tags are fetched
git fetch --tags

# uncomment below to get the latest tag and full description (fallback to commit hash if no tags exist)
#VERSION=$(git describe --tags --long || git rev-parse --short HEAD)

# get commit hash
VERSION=$(git describe --tags --exact-match 2>/dev/null || git rev-parse --short HEAD)

# Write the version information to version.txt files
echo "$VERSION" > UI/public/version.txt
echo "$VERSION" > API/public/version.txt
