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

    // TODO: make `value` the default bind target and two-way bindable.

    baseCls : 'app-starrating',

    // TODO: applyValue  — normalize/clamp to an integer in [0, maxStars]
    // TODO: updateValue — re-render stars when the value changes (guard render)
    // TODO: render the stars and handle clicks → setValue(n)

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