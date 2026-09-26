// ====================== mock async services (given) ======================
var Api = {
    // flip to true to exercise the error path, then Run again
    failTimesheet : false,

    _delay : function (value, ms, fail) {
        var deferred = new Ext.Deferred();
        Ext.defer(function () {
            if (fail) {
                deferred.reject('Network error while loading timesheet');
            } else {
                deferred.resolve(value);
            }
        }, ms);
        return deferred.promise;
    },

    loadProfile : function () {
        return this._delay({ id : 1, name : 'Jane Doe', employeeId : 42 }, 400);
    },

    loadPermissions : function () {
        return this._delay(['view', 'edit', 'approve'], 300);
    },

    loadTimesheet : function (employeeId) {
        var entries = [
            { day : 'Mon', hours : 8 },
            { day : 'Tue', hours : 7 },
            { day : 'Wed', hours : 6 }
        ];
        // note: depends on employeeId from the profile
        return this._delay(entries, 500, this.failTimesheet);
    }
};


Ext.define('App.DashboardController', {
    extend : 'Ext.app.ViewController',
    alias  : 'controller.dashboard',

    onLoadClick : function () {
        this.loadDashboard();
    },

    // ---------------------------------------------------------------------
    // TODO: implement this.
    //  - parallel: profile + permissions
    //  - then dependent: timesheet for profile.employeeId
    //  - mask on start, ALWAYS unmask
    //  - single error handler
    //  - guard against destroyed view
    //  - return the promise
    // ---------------------------------------------------------------------
    loadDashboard : function () {
        // TODO
    },

    // Given: renders the result. Call this on success.
    renderDashboard : function (data) {
        this.lookup('output').setHtml(
            '<div style="padding:8px;font-size:14px">' +
                '<b>' + Ext.String.htmlEncode(data.profile.name) + '</b>' +
                ' · ' + data.permissions.length + ' permissions' +
                ' · ' + data.timesheet.length + ' timesheet entries' +
            '</div>'
        );
    }
});


Ext.application({
    name : 'Fiddle',

    launch : function () {
        Ext.create('Ext.panel.Panel', {
            title       : 'Employee dashboard',
            renderTo    : Ext.getBody(),
            width       : 480,
            bodyPadding : 12,
            controller  : 'dashboard',

            tbar : [
                { text : 'Load dashboard', handler : 'onLoadClick' }
            ],

            items : [
                {
                    xtype     : 'component',
                    reference : 'output',
                    html      : '<div style="padding:8px;color:#999">Press “Load dashboard”.</div>'
                }
            ]
        });
    }
});