import algoliasearch from 'algoliasearch/lite';

const client = algoliasearch('6XFJ9H9OTL', '9d2a11f2b74899b813f57f75f4a798a4');
const locations = client.initIndex('all-locations');
const users = client.initIndex('users');
const posts = client.initIndex('group-posts');

function search(text: string) {
  return locations.search(text);
}

function searchUsers(text: string, query?) {
  return users.search(text, query);
}

function searchPosts(text: string, query?) {
  return posts.search(text, query);
}

export { search, searchUsers, searchPosts };
