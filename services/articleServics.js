const db = require('../models');
const { Article } = db;
const { Op } = require("sequelize");
const ArticleService ={
    getArticles: async(req, res, cb) => {
        try {
            const articles = await Article.findAll({
                where: { isPublic: true },
                nest: true,
                raw: true
            })
            return cb({
                articles
            })
        } catch (error) {
            console.log(error)
        }
    },
    getArticle: async(req, res, cb) => {
        try {
            console.log(req.params.id)
            const article = await Article.findOne({
                where: {
                    [Op.and]:  [
                        { id: req.params.id },
                        { isPublic: true }
                    ]
                },
                nest: true,
                raw: true
            })
           if(!article) {
            return cb({
                statusCode: 404,
                message: '找不到文章！'
            })
           }
            return cb({
                article
            })
               
         
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = ArticleService