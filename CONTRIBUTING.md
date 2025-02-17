# Setup

## Limited new discussions

To limit new discussion to people who have write access and above to the repo go to 

```
Repo Settings > interaction limits > Limit to repository collaborator
```

This needs to be reenabled every 6mo to prevent non-collabortors from being able to open discussinos

## Lock every discussion

WIthout locking every discussion anyone can comment on discussion topics. TO lmit disucssion comments to collabotors there is a github workflow that is run every 5mi to lock every converastion in the repo. See the work flow at

```
.github/workflows/lock-threads.yml
```

and the script at

```
scripts/lock-discussions.js
```

## Prevent non owners from merging code

To give people write access to comment and start new discussion topics but prevent them from mergiing code that could be used in a workflow to view other private repos in the org we have codeowners file that requires a code owner to review and approve a pull require before it is merged.

