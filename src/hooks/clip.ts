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
