var toJapanTimeIfNeeded = require('../../../base/clock').toJapanTimeIfNeeded;
var format_money        = require('../../../common_functions/currency_to_symbol').format_money;
var japanese_client     = require('../../../common_functions/country_base').japanese_client;

var Portfolio = (function() {
    'use strict';

    function getBalance(balance, currency) {
        balance = parseFloat(balance);
        return currency ? format_money(currency, balance) : balance;
    }

    function getPortfolioData(c) {
        var portfolio_data = {
            transaction_id: c.transaction_id,
            contract_id   : c.contract_id,
            payout        : parseFloat(c.payout).toFixed(2),
            longcode      : typeof module !== 'undefined' ?
                c.longcode : (japanese_client() ?
                    toJapanTimeIfNeeded(undefined, undefined, c.longcode) : c.longcode),
            currency : c.currency,
            buy_price: c.buy_price,
            app_id   : c.app_id,
        };

        return portfolio_data;
    }

    function getProposalOpenContract(proposal) {
        var proposal_data = {
            contract_id     : proposal.contract_id,
            bid_price       : parseFloat(proposal.bid_price || 0).toFixed(2),
            is_sold         : proposal.is_sold,
            is_valid_to_sell: proposal.is_valid_to_sell,
            currency        : proposal.currency,
        };

        return proposal_data;
    }

    function getSum(values, value_type) { // value_type is: indicative or buy_price
        var sum = 0;
        var keys = Object.keys(values);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (values[key] && !isNaN(values[key][value_type])) {
                sum += parseFloat(values[key][value_type]);
            }
        }

        return sum.toFixed(2);
    }

    var external = {
        getBalance             : getBalance,
        getPortfolioData       : getPortfolioData,
        getProposalOpenContract: getProposalOpenContract,
        getIndicativeSum       : function(values) { return getSum(values, 'indicative'); },
        getSumPurchase         : function(values) { return getSum(values, 'buy_price'); },
    };

    return external;
})();

module.exports = {
    Portfolio: Portfolio,
};
