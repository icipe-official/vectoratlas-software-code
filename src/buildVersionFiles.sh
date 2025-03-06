# uncomment toEnsure tags are fetched
# git fetch --tags

# Uncomment below to get the latest tag and full description (fallback to commit hash if no tags exist)
# VERSION=$(git describe --tags --long || git rev-parse --short HEAD)

# Get commit hash or exact tag if available
VERSION=$(git describe --tags --exact-match 2>/dev/null || git rev-parse --short HEAD)

# Ensure version files exist before writing
[ -f UI/public/version.txt ] || touch UI/public/version.txt
[ -f API/public/version.txt ] || touch API/public/version.txt

# Write the version information
echo "$VERSION" > UI/public/version.txt
echo "$VERSION" > API/public/version.txt
