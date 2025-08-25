export function copyTextToClipboard(text) {
  navigator.clipboard.writeText(text).then(function () {
    console.log('Async: Copying to clipboard was successful!');
  }, function (err) {
    console.error('Async: Could not copy text: ', err);
  });
}
export function checkIsFollow(userId: number, followers: { id: number; followedId: number; followerId: number }[]) {
  if (userId && Array.isArray(followers)) {
    const follow = followers.find((follower) => follower.followedId === userId);
    return follow ? true : false;
  }
  return false;
}

export function formatPostImages(images: string | string[] | undefined): string[] {
  if (!images) return [];

  if (Array.isArray(images)) return images;

  if (typeof images === "string") {
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) {
        return parsed.map(img => img.trim()).filter(Boolean);
      }
    } catch (error) {
      return images
        .split(",")
        .map(img => img.trim())
        .filter(Boolean);
    }
  }

  return [];
}