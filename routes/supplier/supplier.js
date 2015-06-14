/**
 * Created by matjames007 on 6/2/15.
 *
 * TODO: Documentation needed throughtout this file!
 *
 */

var model = require('../../models/db');
var common = require('../common/common');
var Supplier = model.Supplier;
var Address = model.Address;
var Input = model.Input;
var InputType = model.InputType;


/**
 * Retrieves all suppliers based on the criteria given in the
 * request parameters.
 *
 * @param req
 * @param res
 */
exports.getSuppliers = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        var query = req.query;

        Supplier.find(query)
            .populate('ad_address')
            .exec(function (err, docs) {
                if (err) {
                    common.handleDBError(err, res);
                } else {
                    res.send(docs);
                }
            });
    }
};

exports.createSupplier = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        var address = new Address(req.body.ad_address);
        var supplier = new Supplier(req.body);
        address.save(function (err) {
            if (err) {
                console.log(err);
                common.handleDBError(err, res);
            } else {
                supplier.ad_address = address._id;
                supplier.save(function (err2) {
                    if (err2) {
                        common.handleDBError(err2, res);
                    } else {
                        res.send(supplier);
                    }
                });
            }
        });
    }
};

exports.getSupplierById = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        Supplier.findById(req.params.id).populate('ad_address')
            .exec(function (err, item) {
                if (err) {
                    common.handleDBError(err, res);
                } else {
                    res.send(item);
                }
            });
    }
};

exports.createInput = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        var input = new Input(req.body);
        input.su_supplier = req.params.id;
        input.save(function (err, result) {
            if (err) {
                common.handleDBError(err, res);
            } else {
                res.send(result);
            }
        });
    }
};

exports.createInputType = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        var inputtype = new InputType(req.body);
        inputtype.save(function (err, result) {
            if (err) {
                common.handleDBError(err, res);
            } else {
                res.send(result);
            }
        });
    }
};

exports.getInputsById = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        Input.findById(req.params.id).populate('su_supplier un_price_unit it_input_type')
            .exec(function (err, input) {
                if (err) {
                    common.handleDBError(err, res);
                } else {
                    res.send(input);
                }
            });
    }
};

exports.searchInputs = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        var query;
        if ("searchTerms" in req.query) {
            var list = common.regexSearchTermCreator(req.query.searchTerms.split(" "));
            query = {
                $or: [
                    {ip_input_name: {$in: list}},
                    {ip_description: {$in: list}},
                    {ip_brand: {$in: list}},
                    {ip_discount_terms: {$in: list}}
                ]
            };
        } else {
            query = req.query;
        }
        Input.find(query).populate('su_supplier un_price_unit it_input_type')
            .exec(function (err, inputs) {
                if (err) {
                    common.handleDBError(err, res);
                } else {
                    res.send(inputs);
                }
            });
    }
};

exports.getInputTypes = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        InputType.find(req.query, function (err, types) {
            if (err) {
                common.handleDBError(err, res);
            } else {
                res.send(types);
            }
        });
    }
};