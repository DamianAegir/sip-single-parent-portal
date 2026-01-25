# Chat assets

This folder is used to store chat uploads (images and files) when a backend is available.

In the current prototype, attachments are kept in memory as data URLs and displayed in the chat. Once you add a server, you can save uploaded files here (e.g. `chat-assets/{groupId}/{filename}`) and serve them from this directory.
