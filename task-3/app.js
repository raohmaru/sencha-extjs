Ext.define('App.TimesheetController', {
    extend : 'Ext.app.ViewController',
    alias  : 'controller.timesheet',

    handleAddRow : function () {
        this.getViewModel().getStore('entries').add({ day : '—', project : 'New', hours : 0 });
    },

    handleRemoveSelected : function () {
        var grid = this.lookup('grid'),
            sel  = grid.getSelection();

        if (sel.length) {
            grid.getStore().remove(sel);
        }
    },

    handleSave : function () {
        Ext.Msg.alert('Saved', 'Submitted ' + this.getViewModel().get('totalHours') + ' h');
    }
});


Ext.application({
    name : 'Fiddle',

    launch : function () {
        Ext.create('Ext.panel.Panel', {
            title    : 'Weekly timesheet',
            controller : 'timesheet',
            renderTo : Ext.getBody(),
            width    : 560,
            bodyPadding : 0,
            layout   : 'border',
            height   : 360,

            viewModel : {
                stores : {
                    entries : {
                        fields : ['day', 'project', { name : 'hours', type : 'number' }],
                        data   : [
                            { day : 'Mon', project : 'Onboarding', hours : 8 },
                            { day : 'Tue', project : 'Payroll run', hours : 7 },
                            { day : 'Wed', project : 'Support',     hours : 6 }
                        ]
                    }
                },

                formulas : {
                    // Deep bind to the store so the formula recomputes on every store change
                    // https://docs.sencha.com/extjs/7.5.0/modern/Ext.app.ViewModel.html#method-bind
                    totalHours : {
                        bind : {
                            bindTo : '{entries}',  // Bind to the store object
                            deep   : true          // Deep Binding
                        },
                        get : function (store) {
                            return store ? store.sum('hours') : 0;
                        }
                    },

                    saveDisabled : {
                        bind : {
                            bindTo : '{entries}',  // Bind to the store object
                            deep   : true          // Deep Binding
                        },
                        get : function (store) {
                            // Validate the hours of each record
                            const recs = store.getRange();
                            // const recs = store.getData();
                            for (let i = 0; i < recs.length; i++) {
                                let hours = recs[i].get('hours');
                                // let hours = recs.getAt(i).get("hours")
                                if (hours < 0 || hours > 24) {
                                    return true;
                                }
                            }

                            const total = store.sum('hours');
                            return total <= 0 || total > 40;
                        }
                    }
                }
            },

            items : [
                {
                    xtype  : 'grid',
                    region : 'center',
                    reference : 'grid',
                    bind   : { store : '{entries}' },
                    selModel : 'rowmodel',
                    plugins : [{ ptype : 'cellediting', clicksToEdit : 1 }],
                    columns : [
                        { text : 'Day', dataIndex : 'day', width : 80,
                          editor : { xtype : 'textfield' } },
                        { text : 'Project', dataIndex : 'project', flex : 1,
                          editor : { xtype : 'textfield' } },
                        { text : 'Hours', dataIndex : 'hours', width : 90,
                          editor : { xtype : 'numberfield', minValue : 0, maxValue : 24 } }
                    ],
                    tbar : [
                        {
                            text : 'Add row',
                            handler : 'handleAddRow'
                        },
                        {
                            text : 'Remove selected',
                            handler : 'handleRemoveSelected'
                        }
                    ]
                },
                {
                    xtype  : 'toolbar',
                    region : 'south',
                    items  : [
                        { xtype : 'tbtext', bind : { html : '<b>Total: {totalHours} h</b>' } },
                        '->',
                        {
                            text : 'Save',
                            bind : { disabled : '{saveDisabled}' },
                            handler : 'handleSave'
                        }
                    ]
                }
            ]
        });
    }
});