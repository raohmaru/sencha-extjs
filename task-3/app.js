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
                    // ----------------------------------------------------------
                    // TODO: make these recompute on every inline edit / add / remove.
                    // The plain-function form below is the NAIVE version and does
                    // NOT stay in sync when a `hours` cell is edited.
                    // ----------------------------------------------------------
                    totalHours : function (get) {
                        return get('entries').sum('hours');
                    },

                    saveDisabled : function (get) {
                        var store = get('entries'),
                            total = store.sum('hours');

                        return total === 0 || total > 40;   // (also: no invalid-row check yet)
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