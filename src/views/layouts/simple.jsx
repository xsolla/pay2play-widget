var React = require('react');
var CreateReactClass = require('create-react-class');
var ErrorMessageView = require('../error-message.jsx');
var PaymentButton = require('../payment-button.jsx');
var Helpers = require('../../helpers');

var SimpleView = CreateReactClass({
    className: 'x-buy-button-widget-simple',
    SHOW_TIPS_THANK_DURATION: 1000,

    getInitialState: function () {
        return {
            selectedTipIndex: -1,
            isTipsListOpened: false,
            isThankShow: false
        };
    },

    getDefaultProps: function () {
        return {
            data: {},
            paymentButtonColor: null,
            themeColor: null
        };
    },

    onPaymentOpen: function (options) {
        this.props.onPaymentOpen.call(this, options);
    },

    onTipButtonClick: function (e) {
        if (e && e.stopPropagation && e.preventDefault) {
            e.stopPropagation();
            e.preventDefault();
        }

        if (!this.state.isThankShow) {
            this.setState({isTipsListOpened: true});
        }
    },

    onTipSelect: function (index) {
        if (typeof index !== 'number') {
            index = -1;
        }

        if (index !== -1) {
            this.setState({
                isTipsListOpened: false,
                selectedTipIndex: -1,
                isThankShow: true
            });

            setTimeout(function () {
                this.setState({
                        isTipsListOpened: false,
                        selectedTipIndex: index,
                        isThankShow: false
                    }
                )
            }.bind(this), this.SHOW_TIPS_THANK_DURATION);

        } else {
            this.setState({
                isTipsListOpened: false,
                selectedTipIndex: index,
                isThankShow: false
            });
        }
    },

    render: function () {
        var data = this.props.data;
        var isLoaded = !Helpers.isEmpty(data);
        var error = data.error;
        var paymentButtonColor = this.props.paymentButtonColor;
        var themeColor = this.props.themeColor;
        var logoModifiers = [themeColor];
        var amount = data.amount;
        var showPaymentButton = amount !== undefined;
        if (this.state.isTipsListOpened) {
            logoModifiers.push('moved');
        }

        var paymentButton = showPaymentButton && (
                <PaymentButton amount={amount}
                               baseClassName={this.className}
                               tips={data.tips}
                               selectedTipIndex={this.state.selectedTipIndex}
                               isTipsListOpened={this.state.isTipsListOpened}
                               isThankShow={this.state.isThankShow}
                               paymentButtonColor={paymentButtonColor}
                               onPaymentOpen={this.onPaymentOpen}
                               isReleased={ data.is_released }
                               disabled={ false }
                               tagName={'div'}
                               locale={data.locale}
                               needShowPaystation={this.props.needShowPaystation}
                />
            );

        var spinner = !isLoaded && (
                <div className="spinner-simple"></div>
            );

        var errorMessage = error && (
                <ErrorMessageView error={error}/>
            );

        var blockButton = isLoaded && (<div className={this.className + '-button-block' + ' ' + this.className + '-button-block' + '__' + themeColor}>
                {paymentButton}
            </div>);

        return (
            <div className={this.className + ' ' + this.className + '__simple' + ' ' + this.className + '__' + themeColor}>
                {blockButton}
                {spinner}
                {errorMessage}
            </div>
        );
    }
});

module.exports = SimpleView;
