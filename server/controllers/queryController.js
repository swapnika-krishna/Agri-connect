const Query = require('../models/Query');
const Reply = require('../models/Reply');
const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * @desc    Create a new agricultural query (Farmer only)
 * @route   POST /api/queries
 * @access  Private (Farmer)
 */
exports.createQuery = async (req, res, next) => {
  try {
    const query = await Query.create({
      farmer: req.user.id,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category || 'General',
      farmId: req.body.farmId || undefined,
    });

    // Notify registered specialists in this category
    const experts = await User.find({ role: 'expert', isActive: true, isApproved: true });
    for (const exp of experts) {
      await Notification.create({
        user: exp._id,
        message: `New Query Posted: "${query.title.substring(0, 45)}..." in ${query.category}`,
        type: 'query_new',
        link: `/expert/queries/${query._id}`,
      });
    }

    res.status(201).json({ success: true, data: query });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all queries posted by the logged-in farmer
 * @route   GET /api/queries/mine
 * @access  Private (Farmer)
 */
exports.getMyQueries = async (req, res, next) => {
  try {
    const queries = await Query.find({ farmer: req.user.id })
      .populate('farmer', 'name state district')
      .populate({
        path: 'replies',
        populate: { path: 'expert', select: 'name expertise' },
      })
      .sort('-createdAt');

    res.status(200).json({ success: true, count: queries.length, data: queries });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all queries (for experts and admins, filterable by category and status)
 * @route   GET /api/queries
 * @access  Private (Expert, Admin)
 */
exports.getAllQueries = async (req, res, next) => {
  try {
    const { category, status } = req.query;
    const filter = {};

    if (category && category !== 'All') filter.category = category;
    if (status && status !== 'All') filter.status = status;

    const queries = await Query.find(filter)
      .populate('farmer', 'name state district')
      .populate({
        path: 'replies',
        populate: { path: 'expert', select: 'name expertise' },
      })
      .sort('-createdAt');

    res.status(200).json({ success: true, count: queries.length, data: queries });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single query with conversation replies
 * @route   GET /api/queries/:id
 * @access  Private
 */
exports.getQueryById = async (req, res, next) => {
  try {
    const query = await Query.findById(req.params.id)
      .populate('farmer', 'name state district phone')
      .populate({
        path: 'replies',
        populate: { path: 'expert', select: 'name expertise state' },
      });

    if (!query) {
      return res.status(404).json({ success: false, message: 'Query not found' });
    }

    res.status(200).json({ success: true, data: query });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Post a reply to a query (Expert & Admin)
 * @route   POST /api/queries/:id/replies
 * @access  Private (Expert, Admin)
 */
exports.addReply = async (req, res, next) => {
  try {
    const query = await Query.findById(req.params.id);
    if (!query) {
      return res.status(404).json({ success: false, message: 'Query not found' });
    }

    const reply = await Reply.create({
      query: req.params.id,
      expert: req.user.id,
      message: req.body.message,
    });

    // Update query status to Answered
    query.status = 'Answered';
    await query.save();

    // Automatically send notification to the farmer
    await Notification.create({
      user: query.farmer,
      message: `${req.user.name} posted an advisory response on: "${query.title.substring(0, 40)}..."`,
      type: 'query_reply',
      link: `/queries/${query._id}`,
    });

    const populatedReply = await Reply.findById(reply._id).populate(
      'expert',
      'name expertise state'
    );

    res.status(201).json({ success: true, data: populatedReply });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark query as resolved
 * @route   PUT /api/queries/:id/resolve
 * @access  Private
 */
exports.resolveQuery = async (req, res, next) => {
  try {
    const query = await Query.findById(req.params.id);
    if (!query) {
      return res.status(404).json({ success: false, message: 'Query not found' });
    }

    query.status = 'Resolved';
    await query.save();

    res.status(200).json({ success: true, data: query });
  } catch (error) {
    next(error);
  }
};
