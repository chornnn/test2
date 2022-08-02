export const categories = [
  'Graduating Class',
  'Majors',
  'Housing',
  'Gaming',
  'Clubs/Orgs',
  'Sports',
  'Hobbies',
  'Identity',
  'Others',
];

export const groupCategories = categories.map((c) => ({
  title: c,
  selected: false,
}));

const p = [
  'Discord',
  'GroupMe',
  'Instagram',
  'Facebook',
  'YouTube',
  'Twitter',
  'Linktree',
  'Website',
  'Slack',
  'Telegram',
  'WhatsApp',
  'TikTok',
  'LinkedIn',
  'Others',
];

export const platforms = p.map((c) => ({
  title: c,
  selected: false,
}));

export const f = ['Hot', 'New', 'Rising'];

export const filters = f.map((c) => ({
  title: c,
  selected: false,
}));


export const defaultAvatar =
  'https://firebasestorage.googleapis.com/v0/b/grouphub-prod.appspot.com/o/avatar%2F20211116-114506.png?alt=media&token=0eaa9e9e-43d0-4e52-8010-e533f8a67243';

export const defaultGroupImage =
  'https://firebasestorage.googleapis.com/v0/b/grouphub-prod.appspot.com/o/posts%2Fgroup_img.png?alt=media&token=f4e97136-fde0-4d50-93d5-ae9e049f1d5e';
