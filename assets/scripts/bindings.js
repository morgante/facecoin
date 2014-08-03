var clipboard = require('zeroclipboard');

ko.bindingHandlers.slideVisible = {
    init: function(element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function(element, valueAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        ko.unwrap(value) ? $(element).slideDown() : $(element).slideUp();
    }
};

ko.bindingHandlers.copyClick = {
    init: function(element, valueAccessor) {
        var $el = $(element);
        $el.attr('data-clipboard-text', valueAccessor());

        var client = new clipboard($el);

        client.on("ready", function(e) {
            client.on("aftercopy", function(e) {
                $el.text("Copied!");
                $el.removeClass('btn-warning');
                $el.addClass('btn-info');
            });
        });
        
    }
};