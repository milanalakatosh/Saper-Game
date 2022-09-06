var express = require('express');
const req = require('express/lib/request');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', { title: 'Express' });
});

router.post('/getWidth', (req, res) => {
	let height;
	let width;
	if (req.body.level === 'beginner') {
		height = 9;
		width = height;
	} else if (req.body.level === 'intermediate') {
		height = 16;
		width = height;
	} else if (req.body.level === 'expert') {
		height = 16;
		width = 30;
	}

	res.json({ height, width });
});

module.exports = router;
