/**
 * This is intended to enable any logic/control for
 * any operations on a buyer.  All functions here
 * are used by endpoints in the buyer_routes.js
 * file and must ensure that appropriate validations
 * are done.
 *
 * Created by matjames007 on 5/12/15.
 */
var common = require('../common/common');
var model = require('../../models/db');
var Buyer = model.Buyer;
var BuyerType = model.BuyerType;


/**
 * Retrieves all buyers based on the criteria given in the
 * request parameters. If the parameter "searchTerms" is present
 * in the req.query object then it will do a match to facilitate
 * the search engine of the front end application.
 *
 * TODO: Need to ensure that this uses the request params!
 *
 * @param req
 * @param res
 */
exports.getBuyers = function(req, res) {
    var query;
    if("searchTerms" in req.query) {
        var list = common.regexSearchTermCreator(req.query.searchTerms.toUpperCase().split(" "));
        query = {
            $or: [
                {bu_buyer_name: {$in: list}},
                {bu_phone: {$in: list}},
                {bu_email: {$in: list}}
            ]
        };
    } else {
        query = req.query;
    }

    Buyer.find(query)
        .populate('ad_address bt_buyer_type')
        .exec(function(err, docs) {
            if(err) {
                common.handleDBError(err, res);
            } else {
                res.send(docs);
            }
        });
};

/**
 * This function attempts to create the buyer based on the body of
 * the web service request.  MongoDB handles the validation of info.
 * @param req
 * @param res
 */
exports.createBuyer = function(req, res) {
    var buyer = new Buyer(req.body);
    buyer.save(function(err) {
        if(err) {
            common.handleDBError(err, res);
        } else {
            res.send(buyer);
        }
    })
};

/**
 * Attempts to retrieve document based on the document _id.
 * @param req
 * @param res
 */
exports.getBuyerById = function(req, res) {
    Buyer.findById(req.params.id).populate('ad_address', 'bt_buyer_type')
        .exec(function(err, item) {
            if(err) {
                common.handleDBError(err, res);
            } else {
                if(item) {
                    res.send(item);
                } else {
                    res.status(404);
                    res.send({error: "Not Found"});
                }
            }
        })
};


/**
 * Attempt to update buyer given an id in the req.params
 *
 * TODO: How do I handle the updating of a buyer_type?
 *
 * @param req
 * @param res
 */
exports.updateBuyerById = function(req, res) {
    Buyer.update({_id: req.params.id}, req.body, function(err, response) {
        if(err) {
            common.handleDBError(err, res);
        } else {
            //update the address
            model.Address.update({_id: req.body.ad_address._id}, req.body.ad_address,
                function(err2, response2) {
                    if(err2) {
                        common.handleDBError(err2, res);
                    } else {
                        res.send(req.body);
                    }
                });
        }
    })
};

/**
 * Create New Buyer Type. Validation done by DB.
 * @param req
 * @param res
 */
exports.createBuyerType = function(req, res) {
    var bt = new BuyerType(req.body);
    bt.save(function(err, item) {
        if(err) {
            common.handleDBError(err, res);
        } else {
            res.send(item);
        }
    });
};

/**
 * Retrieve all buyer types.
 *
 * @param req
 * @param res
 */
exports.getBuyerTypes = function(req, res) {
    BuyerType.find(req.query, function(err, list) {
        if(err) {
            common.handleDBError(err, res);
        } else {
            res.send(list);
        }
    })
};