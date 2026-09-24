// =========================================================================
//  TODO: implement this component. It must be a proper two-way bindable
//  control built on the Ext JS config system.
// =========================================================================
Ext.define('App.ux.StarRating', {
    extend : 'Ext.Component',
    xtype  : 'starrating',

    config : {
        value    : 0,
        maxStars : 5
    },

    // Makes bind: '{rating}' target inner property `value`
    // https://docs.sencha.com/extjs/7.5.0/modern/Ext.Component.html#property-defaultBindProperty
    defaultBindProperty : 'value',
    // setValue() publishes back to the viewModel
    // https://docs.sencha.com/extjs/7.5.0/modern/Ext.Component.html#cfg-twoWayBindable
    twoWayBindable : ['value'],    

    baseCls : 'app-starrating',

    // Save internal property
    applyValue: function (value) {
        const newValue = parseInt(value, 10) || 0;
        // Clamp to an integer in [0, maxStars]
        return Math.min(Math.max(newValue, 0), this.getMaxStars());
    },

    // Re-render stars when the value changes (guard render), runs on the deferred binding too
    updateValue: function () {
        if (this.rendered) {
            this.renderStars();
        }
    },

    onRender: function () {
        this.callParent(arguments); // Call the superclass onRender method

        // One delegated listener survives every repaint
        this.el.on('click', this.onStarClick, this, { delegate: '.app-starrating__star' });

        // Initial paint; binding re-paints later
        this.renderStars();
    },

    renderStars: function () {
        const value = this.getValue();
        const max = this.getMaxStars();
        let stars = '';

        for (let i = 1; i <= max; i++) {
            stars += `<span class="app-starrating__star" style="cursor:pointer" data-rating="${i}">${i <= value ? '★' : '☆'}</span>`;
        }

        this.update(stars);
    },

    onStarClick: function (_, target) {
        const rating = parseInt(target.dataset.rating, 10);
        // 2-way binding publishes back to the viewModel
        this.setValue(rating);
    }
});


Ext.application({
    name : 'Fiddle',

    launch : function () {
        Ext.create('Ext.form.Panel', {
            title      : 'Performance review',
            renderTo   : Ext.getBody(),
            width      : 420,
            bodyPadding: 16,

            viewModel : {
                data : { rating : 2 }
            },

            items : [
                {
                    xtype      : 'starrating',
                    fieldLabel : 'Overall rating',   // cosmetic; Component ignores it
                    reference  : 'stars',
                    bind       : '{rating}'
                },
                {
                    xtype  : 'displayfield',
                    margin : '10 0 0 0',
                    bind   : 'You rated: {rating} / 5'
                }
            ],

            buttons : [
                {
                    text    : 'Reset to 5',
                    handler : function (btn) {
                        // VM → component path; don't touch the starrating directly
                        btn.lookupViewModel().set('rating', 5);
                    }
                },
                {
                    text : 'Save',
                    bind : { disabled : '{!rating}' },
                    handler : function (btn) {
                        Ext.Msg.alert('Saved', 'Stored rating = ' + btn.lookupViewModel().get('rating'));
                    }
                }
            ]
        });
    }
});