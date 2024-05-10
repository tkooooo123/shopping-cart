const ArticleService = require("../../services/articleServics");
const ArticleController = {
    getArticles: (req, res) => {
        ArticleService.getArticles(req, res, data => {
            return res.json(data)
        })
    },
    getArticle: (req, res) => {
        ArticleService.getArticle(req, res, data => {
            if(data.statusCode === 404) {
                return  res.status(404).json(data)
              }

            return res.json(data)
        })
    }
}

module.exports = ArticleController;