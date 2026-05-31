const Post = require('../models/Post');
const User = require('../models/User');

// Escape special regex characters so searches like "#PPT" don't crash
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/search?q=...
const search = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q?.trim()) {
      return res.json({ posts: [], users: [], tags: [], courses: [] });
    }

    const raw = q.trim();
    const cleanTag = raw.replace(/^#/, '').toLowerCase(); // strip leading #
    const escaped = escapeRegex(raw);
    const escapedTag = escapeRegex(cleanTag);

    const postConditions = [
      { tags: { $in: [cleanTag] } },                              // exact tag match
      { course:  { $regex: escaped,    $options: 'i' } },
      { title:   { $regex: escaped,    $options: 'i' } },
      { body:    { $regex: escaped,    $options: 'i' } },
      { tags:    { $elemMatch: { $regex: escapedTag, $options: 'i' } } },
    ];

    const [posts, users] = await Promise.all([
      Post.find({ $or: postConditions })
        .sort({ createdAt: -1 })
        .limit(30)
        .populate('author', 'username avatar'),

      User.find({ username: { $regex: escapedTag, $options: 'i' } })
        .select('username avatar bio')
        .limit(10),
    ]);

    // Aggregate tags & courses from matching posts
    const tagMap = new Map();
    const courseSet = new Set();
    for (const post of posts) {
      for (const tag of post.tags || []) {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      }
      if (post.course) courseSet.add(post.course);
    }

    res.json({
      posts,
      users,
      tags: [...tagMap.entries()].map(([tag, count]) => ({ tag, count })),
      courses: [...courseSet],
    });
  } catch (err) {
    console.error('Search error:', err); // always log
    next(err);
  }
};

module.exports = { search };
