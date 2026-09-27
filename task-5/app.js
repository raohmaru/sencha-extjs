Ext.define('App.DirectoryController', {
    extend : 'Ext.app.ViewController',
    alias  : 'controller.directory',

    // ✅ TODO #1: single, replaceable filter by name (case-insensitive substring).
    // The listener is also where you debounce — see the search field below.
    handleSearchChange : function (_, value) {
        const store = this.getView().getStore();
        // const valueLower = value.toLowerCase();

        // Empty search removes the filter
        if (!value) {
            store.removeFilter('nameFilter');
            return;
        }

        // `id` makes the filter replaceable: adding the same `id` replaces the filter
        // with same id instead of piling them up
        store.filter({
            // https://docs.sencha.com/extjs/7.5.0/modern/Ext.util.Filter.html#cfg-id
            id : 'nameFilter',
            // https://docs.sencha.com/extjs/7.5.0/modern/Ext.util.Filter.html#cfg-filterFn
            // filterFn : (rec) => {
            //     return rec.get('name').toLowerCase().indexOf(valueLower) !== -1;
            // },
            // Ext compiles a single case-insensitive regex once and reads `name` directly,
            // making it slightly faster than `filterFn`
            property : 'name',
            value    : value,
            anyMatch : true   // substring, not whole-string
        });
    },

    // ✅ TODO #2: raise salary by 10% for ALL records of the chosen dept,
    // batched so the view refreshes ONCE. Use record.set(...).
    handleRaise : function () {
        const store = this.getView().getStore();
        const dept  = this.lookup('deptCombo').getValue();

        if (!dept) {
            return;
        }

        // Search all records in the store regardless of filtering
        // https://docs.sencha.com/extjs/7.5.0/modern/Ext.data.Store.html#method-queryBy
        const records = store.queryBy((rec) => rec.get('department') === dept);

        if (!records.getCount()) {
            return;
        }

        // Start of multiple changes to the store
        // https://docs.sencha.com/extjs/7.5.0/modern/Ext.data.AbstractStore.html#method-beginUpdate
        store.beginUpdate();

        // Performance optimization for loops: local variable resolves directly, while `Math.round`
        // costs a global lookup plus + property load
        const round = Math.round;

        records.each((rec) => {
            // Model API instead of poking the raw `data` object
            rec.set('salary', round(rec.get('salary') * 1.1));  // 10% increase
        });
        // Called after modifications are complete
        // https://docs.sencha.com/extjs/7.5.0/modern/Ext.data.AbstractStore.html#method-endUpdate
        store.endUpdate();
    },

    // Language-sensitive number formatting
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
    currencyFormatter : function (value) {
        // Cache `Intl.NumberFormat` this.numberFormatter for better performance
        if (!this.numberFormatter) {
            this.numberFormatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
            });
        }
        return this.numberFormatter.format(value);
    },

    // ✅ TODO #3: pure, synchronous, HTML-encoding salary renderer.
    // Runs MANY times under buffered rendering — formatting only.
    salaryRenderer : function (value) {
        let currency = this.currencyFormatter(value);
        // Encode before it is inserted as HTML so it does not break markup
        // https://docs.sencha.com/extjs/7.5.0/modern/Ext.html#method-htmlEncode
        currency = Ext.htmlEncode(currency);
        if (value > 50000) {
            currency = `<span style="color: red">${currency}</span>`;
        }
        return currency;
    }
});


Ext.application({
    name : 'Fiddle',

    launch : function () {
        var departments = ['HR', 'Payroll', 'Engineering', 'Sales', 'Support'],
            data = [],
            i;

        for (i = 1; i <= 10000; i++) {
            data.push({
                id         : i,
                name       : 'Employee ' + i,
                department : departments[i % departments.length],
                salary     : 40000 + (i % 50) * 1000
            });
        }

        Ext.create('Ext.grid.Panel', {
            title      : 'Employee directory (' + data.length + ' rows)',
            renderTo   : Ext.getBody(),
            height     : 460,
            width      : 720,
            controller : 'directory',

            store : {
                fields : ['id', 'name', 'department', { name : 'salary', type : 'number' }],
                data   : data
            },

            tbar : [
                'Search:',
                {
                    xtype     : 'textfield',
                    emptyText : 'name contains…',
                    width     : 220,
                    //  ✅ TODO #1: debounce this — e.g. { fn : 'handleSearchChange', buffer : 300 }
                    listeners : {
                        change : {
                            fn : 'handleSearchChange',
                            buffer : 300
                        }
                    }
                },
                '->',
                'Dept:',
                {
                    xtype     : 'combobox',
                    reference : 'deptCombo',
                    width     : 140,
                    editable  : false,
                    queryMode : 'local',
                    value     : 'Engineering',
                    store     : departments
                },
                {
                    text    : 'Raise 10%',
                    handler : 'handleRaise'
                }
            ],

            columns : [
                { text : 'ID', dataIndex : 'id', width : 70 },
                { text : 'Name', dataIndex : 'name', flex : 1 },
                { text : 'Department', dataIndex : 'department', width : 130 },
                { text : 'Salary', dataIndex : 'salary', width : 130, renderer : 'salaryRenderer' }
            ]
        });
    }
});