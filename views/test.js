module.exports = function (params) {
	return [
 		'<!DOCTYPE>',
		{
			tag: 'html',
			content: [
				{
					tag: 'head',
					content: [
						{
							tag: 'title',
							content: 'Video Sync'
						},
						{
							tag: 'script',
							src: '/javascripts/index.js'
						},
						{
							tag: 'link',
							rel: 'stylesheet',
							type: 'text/css'
							href: '/stylesheets/index.css'
						}
					]
				},
				{
					tag: 'body',
					content: '123olo2'
				}
			]
		}
	]
}